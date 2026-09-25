import assert from 'node:assert/strict'
import test from 'node:test'
import type { AxiosAdapter } from 'axios'
import { QueryClient } from '@tanstack/react-query'
import { createTestJiti } from './helpers.ts'

const jiti = createTestJiti()
const { apiClient } = await jiti.import('./src/shared/libs/api-client.ts') as {
  apiClient: { defaults: { adapter?: AxiosAdapter } }
}
const { clearAuthTokens, saveAuthTokens } = await jiti.import('./src/shared/libs/token-storage.ts') as {
  clearAuthTokens: () => void
  saveAuthTokens: (tokens: { accessToken: string; refreshToken: string }) => void
}
const { getTravelRecord, getTravelRecords } = await jiti.import('./src/entities/trip-card/records.ts') as {
  getTravelRecord: (tripId: number, summary?: { tripId?: number; cityName?: string; countryName?: string; images?: string[]; photoCount?: number }) => Promise<{
    tripId?: number
    images?: string[]
    places?: unknown[]
  }>
  getTravelRecords: () => Promise<Array<{ places?: unknown[] }>>
}
const { travelRecordQueryOptions } = await jiti.import('./src/entities/trip-card/record-queries.ts') as {
  travelRecordQueryOptions: (tripId: number) => Parameters<QueryClient['fetchQuery']>[0]
}
const { tripCardQueryKeys } = await jiti.import('./src/entities/trip-card/query-keys.ts') as {
  tripCardQueryKeys: { records: () => readonly unknown[] }
}

function createStorage() {
  const values = new Map<string, string>()
  return {
    getItem: (key: string) => values.get(key) ?? null,
    removeItem: (key: string) => values.delete(key),
    setItem: (key: string, value: string) => values.set(key, value),
  }
}

async function withApiAdapter(adapter: AxiosAdapter, run: (requests: string[]) => Promise<void>) {
  const storage = createStorage()
  const previousStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  const previousAdapter = apiClient.defaults.adapter
  const requests: string[] = []
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: storage })
  saveAuthTokens({ accessToken: 'test-access', refreshToken: 'test-refresh' })
  apiClient.defaults.adapter = async (config) => {
    requests.push(`${config.method?.toUpperCase()} ${config.url}`)
    return adapter(config)
  }

  try {
    await run(requests)
  } finally {
    clearAuthTokens()
    if (previousStorage) Object.defineProperty(globalThis, 'localStorage', previousStorage)
    else Reflect.deleteProperty(globalThis, 'localStorage')
    apiClient.defaults.adapter = previousAdapter
  }
}

test('상세 API 성공은 목록 API 실패와 분리한다', async () => {
  await withApiAdapter(async (config) => {
    if (config.url === '/travel-cards') throw new Error('list unavailable')
    return {
      config,
      data: { cardId: 17, timeline: [{ imageUrl: '/uploads/photo.jpg', type: 'PHOTO' }] },
      headers: {},
      status: 200,
      statusText: 'OK',
    }
  }, async () => {
    const record = await getTravelRecord(17)
    assert.equal(record.tripId, 17)
    assert.deepEqual(record.images, ['/uploads/photo.jpg'])
  })
})

test('목록 요약에는 상세 API에서 얻지 않은 방문 장소 수를 만들지 않는다', async () => {
  await withApiAdapter(async (config) => ({
    config,
    data: [{ cardId: 17, countryName: 'Japan', cityName: 'Osaka', coverImageUrl: '/uploads/cover.jpg', photoCount: 3 }],
    headers: {},
    status: 200,
    statusText: 'OK',
  }), async () => {
    const [record] = await getTravelRecords()
    assert.equal(record.places, undefined)
  })
})

test('기록 요약 캐시는 상세 조회에 재사용되어 목록 API를 다시 호출하지 않는다', async () => {
  await withApiAdapter(async (config) => ({
    config,
    data: config.url === '/travel-cards'
      ? [{ cardId: 17, countryName: 'Japan', cityName: 'Osaka', photoCount: 3 }]
      : { cardId: 17, timeline: [{ imageUrl: '/uploads/photo.jpg', type: 'PHOTO' }] },
    headers: {},
    status: 200,
    statusText: 'OK',
  }), async (requests) => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } })
    queryClient.setQueryData(tripCardQueryKeys.records(), [{ tripId: 17, countryName: 'Japan', cityName: 'Osaka', images: ['/uploads/cover.jpg'], photoCount: 3 }])
    await queryClient.fetchQuery(travelRecordQueryOptions(17))
    assert.deepEqual(requests, ['GET /travel-cards/17'])
    queryClient.clear()
  })
})
