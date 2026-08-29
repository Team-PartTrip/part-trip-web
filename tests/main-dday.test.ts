import assert from 'node:assert/strict'
import test from 'node:test'

import { formatDday, hasTravelPlan } from '../src/widgets/main/model/dday.ts'

test('메인 화면의 D-day 상태와 휴식 상태를 구분한다', () => {
  assert.equal(formatDday('D - 20'), 'D-20')
  assert.equal(formatDday('D-Day'), 'D-Day')
  assert.equal(formatDday('여행 중'), '여행 중')
  assert.equal(formatDday('쉬는 중'), '쉬는 중')
  assert.equal(hasTravelPlan({ dday: '쉬는 중' }), false)
  assert.equal(hasTravelPlan({ dday: '여행 종료', countryName: '일본' }), false)
  assert.equal(hasTravelPlan({ countryName: '일본' }), true)
})
