import assert from 'node:assert/strict'
import test from 'node:test'

import { formatDate, formatTravelDateTime, getDateRangeDays, isInCurrentCalendarWeek } from '../src/shared/utils/date.ts'

test('날짜 포맷과 양끝 포함 기간을 공통 규칙으로 계산한다', () => {
  assert.equal(formatDate('2026-07-01'), '2026.07.01')
  assert.equal(getDateRangeDays('2026-07-01', '2026-07-03'), 3)
  assert.equal(getDateRangeDays('잘못된 날짜', '2026-07-03'), undefined)
  assert.equal(getDateRangeDays('2026-07-03', '2026-07-01'), undefined)
})

test('현재 달력 주는 월요일부터 일요일까지 계산한다', () => {
  const monday = new Date(2026, 7, 31, 12)
  assert.equal(isInCurrentCalendarWeek('2026-08-30T12:00:00', monday), false)
  assert.equal(isInCurrentCalendarWeek('2026-08-31T12:00:00', monday), true)
  assert.equal(isInCurrentCalendarWeek('2026-09-06T12:00:00', monday), true)
  assert.equal(isInCurrentCalendarWeek('2026-09-07T12:00:00', monday), false)
})

test('촬영 시각을 여행 국가 시간대로 표시한다', () => {
  assert.equal(formatTravelDateTime('2026-08-31T15:00:00', 'JP'), '2026. 9. 1. 오전 12:00')
  assert.equal(formatTravelDateTime('2026-08-31T15:00:00', 'US', undefined, 'Los Angeles'), '2026. 8. 31. 오전 8:00')
  assert.equal(formatTravelDateTime('2026-08-31T15:00:00', 'US', '미국'), '2026. 8. 31. 오후 3:00')
  assert.equal(formatTravelDateTime('2026-08-31T15:00:00', 'XX'), '2026. 8. 31. 오후 3:00')
  assert.equal(formatTravelDateTime('2026-08-31T15:00:00', 'NZ', '뉴질랜드', 'Auckland'), '2026. 9. 1. 오전 3:00')
})
