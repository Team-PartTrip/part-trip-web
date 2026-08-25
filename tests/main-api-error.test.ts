import assert from 'node:assert/strict'
import test from 'node:test'

import { isMissingTravelPlanResponse } from '../src/entities/travel/main-error.ts'

test('등록된 여행 일정이 없다는 400 응답을 빈 상태로 구분한다', () => {
  assert.equal(isMissingTravelPlanResponse(400, '등록된 여행 일정이 없습니다.'), true)
})

test('다른 400 응답과 서버 오류는 빈 상태로 처리하지 않는다', () => {
  assert.equal(isMissingTravelPlanResponse(400, '국가 정보를 찾을 수 없습니다.'), false)
  assert.equal(isMissingTravelPlanResponse(500, '등록된 여행 일정이 없습니다.'), false)
})
