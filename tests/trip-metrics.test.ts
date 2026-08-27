import assert from 'node:assert/strict'
import test from 'node:test'

import { getTripDurationDays } from '../src/entities/trip-plan/metrics.ts'

test('여행 기간을 양끝 날짜를 포함해 합산한다', () => {
  assert.equal(
    getTripDurationDays([
      { endDate: '2026-07-03', startDate: '2026-07-01' },
      { endDate: '2026-08-10' },
    ]),
    3,
  )
})

test('잘못된 여행 날짜는 통계에 포함하지 않는다', () => {
  assert.equal(
    getTripDurationDays([
      { endDate: '잘못된 날짜', startDate: '2026-07-01' },
      { endDate: '2026-07-01', startDate: '2026-07-03' },
    ]),
    0,
  )
})
