import assert from 'node:assert/strict'
import test from 'node:test'
import type { AxiosAdapter } from 'axios'

import { apiClient } from '../src/shared/libs/api-client.ts'
import { clearAuthTokens, saveAuthTokens } from '../src/shared/libs/token-storage.ts'
import { getSharedTripDetail, listSharedTrips } from '../src/entities/trip-card/api.ts'

function createStorage() {
  const values = new Map<string, string>()
  return {
    getItem: (key: string) => values.get(key) ?? null,
    removeItem: (key: string) => values.delete(key),
    setItem: (key: string, value: string) => values.set(key, value),
  }
}

test('공유 여행 목록과 상세는 개인 여행 카드 endpoint를 재사용하지 않는다', async () => {
  const storage = createStorage()
  const previousStorage = globalThis.localStorage
  const previousApiAdapter = apiClient.defaults.adapter
  const requests: string[] = []
  const adapter: AxiosAdapter = async (config) => {
    const url = config.url ?? ''
    requests.push(url)

    if (url === '/community/shared-trips') {
      return {
        config,
        data: { content: [{ tripId: 7, title: '공유 일정' }], hasNext: false, page: 0, size: 20, totalElements: 1, totalPages: 1 },
        headers: {},
        status: 200,
        statusText: 'OK',
      }
    }

    if (url === '/community/shared-trips/7') {
      return {
        config,
        data: { tripId: 7, title: '공유 일정 상세' },
        headers: {},
        status: 200,
        statusText: 'OK',
      }
    }

    throw new Error(`unexpected request: ${url}`)
  }

  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: storage })
  apiClient.defaults.adapter = adapter
  saveAuthTokens({ accessToken: 'access', refreshToken: 'refresh' })

  try {
    const list = await listSharedTrips({ page: 0, size: 20 })
    const detail = await getSharedTripDetail(7)

    assert.equal(list.content?.[0]?.tripId, 7)
    assert.equal(detail.title, '공유 일정 상세')
    assert.deepEqual(requests, ['/community/shared-trips', '/community/shared-trips/7'])
  } finally {
    clearAuthTokens()
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: previousStorage })
    apiClient.defaults.adapter = previousApiAdapter
  }
})
