import assert from 'node:assert/strict'
import test from 'node:test'
import type { AxiosInstance } from 'axios'
import type { TravelPreferenceRequestDto, TravelPreferenceResponseDto } from '../src/entities/user/api.ts'
import { createTestJiti } from './helpers.ts'

const jiti = createTestJiti()
const { apiClient } = await jiti.import('./src/shared/libs/api-client.ts') as { apiClient: AxiosInstance }
const { getTravelPreferences, updateTravelPreferences } = await jiti.import('./src/entities/user/api.ts') as typeof import('../src/entities/user/api.ts')
const { saveAuthTokens } = await jiti.import('./src/shared/libs/token-storage.ts') as typeof import('../src/shared/libs/token-storage.ts')

test('여행 편의 API는 미선택 필드를 생략하고 없음 답변과 음식 코드를 그대로 전송한다', async () => {
  const previousStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  const previousAdapter = apiClient.defaults.adapter
  const storage = new Map<string, string>()
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: (key: string) => storage.get(key) ?? null,
    setItem: (key: string, value: string) => storage.set(key, value),
    removeItem: (key: string) => storage.delete(key),
  } })
  saveAuthTokens({ accessToken: 'test-access', refreshToken: 'test-refresh' })
  const base: TravelPreferenceRequestDto = { preferredTransport: 'CAR', dailyScheduleCount: 3, canUseStairs: true }
  let saved: TravelPreferenceResponseDto = { ...base, avoidFoods: null, usesWheelchair: null, limitedWalking: null }
  let sent: TravelPreferenceRequestDto | undefined
  apiClient.defaults.adapter = async (config) => {
    assert.equal(config.url, '/profile/travel-preferences')
    assert.ok(config.method === 'get' || config.method === 'put')
    if (config.method === 'put') {
      sent = JSON.parse(config.data)
      saved = { ...saved, ...sent }
    }
    return { config, data: saved, headers: {}, status: 200, statusText: 'OK' }
  }
  try {
    assert.deepEqual(await getTravelPreferences(), saved)
    await updateTravelPreferences({ ...base, avoidFoods: undefined, usesWheelchair: undefined, limitedWalking: undefined })
    assert.deepEqual(sent, base)
    assert.equal(saved.avoidFoods, null)
    assert.equal(saved.usesWheelchair, null)
    assert.equal(saved.limitedWalking, null)

    const selected: TravelPreferenceRequestDto = {
      ...base, canUseStairs: false,
      avoidFoods: ['SEAFOOD', 'SPICY', 'HARD', 'MEAT', 'DAIRY'], usesWheelchair: true, limitedWalking: true,
    }
    assert.deepEqual(await updateTravelPreferences(selected), selected)
    assert.deepEqual(sent, selected)
    await updateTravelPreferences(base)
    assert.deepEqual(sent, base)
    assert.deepEqual(await getTravelPreferences(), { ...selected, canUseStairs: true })

    const none: TravelPreferenceRequestDto = { ...base, avoidFoods: [], usesWheelchair: false, limitedWalking: false }
    assert.deepEqual(await updateTravelPreferences(none), none)
    assert.deepEqual(sent, none)
    apiClient.defaults.adapter = async () => { throw new Error('test save failure') }
    await assert.rejects(updateTravelPreferences(selected), /test save failure/)
  } finally {
    apiClient.defaults.adapter = previousAdapter
    if (previousStorage) Object.defineProperty(globalThis, 'localStorage', previousStorage)
    else Reflect.deleteProperty(globalThis, 'localStorage')
  }
})
