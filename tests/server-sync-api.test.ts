import assert from 'node:assert/strict'
import test from 'node:test'
import type { AxiosInstance } from 'axios'
import { createTestJiti } from './helpers.ts'

test('서버 신규 API 경로·설문·재생성 경고·걷기 시간·사진 출처를 그대로 전달한다', async () => {
  const jiti = createTestJiti()
  const { apiClient } = await jiti.import('./src/shared/libs/api-client.ts') as { apiClient: AxiosInstance }
  const planner = await jiti.import('./src/entities/planner/api.ts') as typeof import('../src/entities/planner/api.ts')
  const travel = await jiti.import('./src/entities/travel/api.ts') as typeof import('../src/entities/travel/api.ts')
  const user = await jiti.import('./src/entities/user/api.ts') as typeof import('../src/entities/user/api.ts')
  const cards = await jiti.import('./src/entities/trip-card/api.ts') as typeof import('../src/entities/trip-card/api.ts')
  const { saveAuthTokens } = await jiti.import('./src/shared/libs/token-storage.ts') as typeof import('../src/shared/libs/token-storage.ts')
  const previousStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  const previousAdapter = apiClient.defaults.adapter
  const storage = new Map<string, string>()
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
  } })
  saveAuthTokens({ accessToken: 'fixture-access', refreshToken: 'fixture-refresh' })
  const survey = { plannerId: 7, blocks: [{ type: 'WALKING', value: '10분 이내', placeName: null, latitude: null, longitude: null }] }
  const schedule = { plannerId: 7, days: [], warnings: [{ tourPlaceId: 11, message: '무장애 정보를 확인해주세요.' }] }
  const calls: string[] = []
  apiClient.defaults.adapter = async config => {
    calls.push(`${config.method} ${config.url}`)
    let data: unknown
    switch (config.url) {
      case '/planners/7/survey': data = survey; break
      case '/planners/7/regenerate':
        assert.equal(config.data, undefined)
        data = schedule
        break
      case '/places/address':
        assert.deepEqual(config.params, { latitude: 37.5, longitude: 127 })
        data = { address: null }
        break
      case '/profile/travel-preferences':
        assert.equal(JSON.parse(config.data).maxWalkingMinutes, 10)
        assert.equal('limitedWalking' in JSON.parse(config.data), false)
        data = { ...JSON.parse(config.data), limitedWalking: true }
        break
      case '/travel-cards/1/entries/2/metadata':
        assert.equal(JSON.parse(config.data).fromCamera, true)
        data = { entryId: 2, locationSource: 'CAMERA', takenAtSource: 'CAMERA' }
        break
      default: throw new Error(`Unexpected request: ${config.url}`)
    }
    return { config, data, headers: {}, status: 200, statusText: 'OK' }
  }
  try {
    assert.deepEqual(await planner.getPlannerSurvey(7), survey)
    assert.deepEqual(await planner.regeneratePlanner(7), schedule)
    assert.deepEqual(await travel.getPlaceAddress(37.5, 127), { address: null })
    assert.equal((await user.updateTravelPreferences({ preferredTransport: 'CAR', dailyScheduleCount: 3, canUseStairs: true, maxWalkingMinutes: 10 })).maxWalkingMinutes, 10)
    assert.equal((await cards.updateTravelCardEntryMetadata(1, 2, { latitude: 37.5, longitude: 127, fromCamera: true })).locationSource, 'CAMERA')
    assert.deepEqual(calls, ['get /planners/7/survey', 'post /planners/7/regenerate', 'get /places/address', 'put /profile/travel-preferences', 'patch /travel-cards/1/entries/2/metadata'])
    apiClient.defaults.adapter = async () => { throw new Error('직접 수정한 일정은 다시 생성할 수 없습니다.') }
    await assert.rejects(planner.regeneratePlanner(7), /직접 수정한 일정/)
  } finally {
    apiClient.defaults.adapter = previousAdapter
    if (previousStorage) Object.defineProperty(globalThis, 'localStorage', previousStorage)
    else Reflect.deleteProperty(globalThis, 'localStorage')
  }
})
