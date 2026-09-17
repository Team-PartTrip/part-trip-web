import assert from 'node:assert/strict'
import test from 'node:test'

import { formatDday, getTravelStatusCopy, hasTravelPlan } from '../src/widgets/main/model/dday.ts'

test('메인 화면의 D-day 상태와 휴식 상태를 구분한다', () => {
  assert.equal(formatDday('D - 20'), 'D-20')
  assert.equal(formatDday('D-Day'), 'D-Day')
  assert.equal(formatDday('여행 중'), '여행 중')
  assert.equal(formatDday('쉬는 중'), '쉬는 중')
})

test('서버 여행 상태별 메인 화면 문구와 여행 표시 여부를 구분한다', () => {
  assert.equal(getTravelStatusCopy('NO_TRIP'), '다음 여행이 아직 없어요')
  assert.equal(getTravelStatusCopy('BEFORE'), '다가오는 여행')
  assert.equal(getTravelStatusCopy('DURING'), '여행 중')
  assert.equal(getTravelStatusCopy('ENDED'), '여행 종료')

  assert.equal(hasTravelPlan({ status: 'NO_TRIP' }), false)
  assert.equal(hasTravelPlan({ status: 'BEFORE' }), true)
  assert.equal(hasTravelPlan({ status: 'DURING' }), true)
  assert.equal(hasTravelPlan({ status: 'ENDED' }), true)
  assert.equal(hasTravelPlan(undefined), false)
})
