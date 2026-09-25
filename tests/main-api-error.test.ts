import assert from 'node:assert/strict'
import test from 'node:test'
import { createTestJiti } from './helpers.ts'

import { isMissingTravelPlanResponse } from '../src/entities/travel/main-error.ts'

test('등록된 여행 일정이 없다는 400 응답을 빈 상태로 구분한다', () => {
  assert.equal(isMissingTravelPlanResponse(400, '등록된 여행 일정이 없습니다.'), true)
})

test('다른 400 응답과 서버 오류는 빈 상태로 처리하지 않는다', () => {
  assert.equal(isMissingTravelPlanResponse(400, '국가 정보를 찾을 수 없습니다.'), false)
  assert.equal(isMissingTravelPlanResponse(500, '등록된 여행 일정이 없습니다.'), false)
})

test('D-day 응답 상태는 서버 값만 사용하고 잘못된 값은 오류로 처리한다', async () => {
  const jiti = createTestJiti()
  const api = await jiti.import('./src/entities/travel/api.ts')
  const normalizeDdayResponse = (api as {
    normalizeDdayResponse: (response: {
      status?: unknown
      startDate?: string | null
      endDate?: string | null
      dday?: string | null
    }) => { status: string; dday?: string | null }
  }).normalizeDdayResponse

  assert.throws(() => normalizeDdayResponse({ status: undefined, startDate: null, endDate: null, dday: 'old' }), /여행 상태 응답이 올바르지 않습니다/)
  assert.throws(() => normalizeDdayResponse({ status: 'UNKNOWN', startDate: '2000-01-01', endDate: '2000-01-02', dday: 'old' }), /여행 상태 응답이 올바르지 않습니다/)
  assert.equal(normalizeDdayResponse({ status: 'DURING' }).status, 'DURING')
})
