import assert from 'node:assert/strict'
import test from 'node:test'

import { formatCalendarDate, formatDate, formatDateRange, formatTravelDateTime, toTravelDateTimeInput, formatTripDuration, getMonthCalendarDays, getDateRangeDays, getDateRangeWithPadding, isInCurrentCalendarWeek } from '../src/shared/utils/date.ts'

test('날짜 포맷과 양끝 포함 기간을 공통 규칙으로 계산한다', () => {
  assert.equal(formatDate('2026-07-01'), '2026.07.01')
  assert.equal(formatCalendarDate(2026, 6, 1), '2026-07-01')
  assert.equal(formatDateRange('2026-07-01', '2026-07-03'), '2026.07.01 – 07.03')
  assert.equal(formatDateRange('2026-07-01', '2026-08-03'), '2026.07.01 – 08.03')
  assert.equal(getDateRangeDays('2026-07-01', '2026-07-03'), 3)
  assert.equal(formatTripDuration('2026-07-01', '2026-07-03'), '2박 3일')
  assert.equal(formatTripDuration('2026-07-01', '2026-07-01'), '당일치기')
  assert.equal(formatDateRange('2026-07-01', '2026-07-01'), '2026.07.01')
  assert.equal(formatTripDuration('잘못된 날짜', '2026-07-03'), '')
  assert.equal(getDateRangeDays('잘못된 날짜', '2026-07-03'), undefined)
  assert.equal(getDateRangeDays('2026-07-03', '2026-07-01'), undefined)
})

test('축제 조회 범위는 여행 기간 앞뒤 7일을 포함하고 월 경계를 넘는다', () => {
  const range = getDateRangeWithPadding('2026-08-30', '2026-09-02')

  assert.deepEqual(range, { startDate: '2026-08-23', endDate: '2026-09-09' })
})

test('현재 달력 주는 월요일부터 일요일까지 계산한다', () => {
  const monday = new Date(2026, 7, 31, 12)
  assert.equal(isInCurrentCalendarWeek('2026-08-30T12:00:00', monday), false)
  assert.equal(isInCurrentCalendarWeek('2026-08-31T12:00:00', monday), true)
  assert.equal(isInCurrentCalendarWeek('2026-09-06T12:00:00', monday), true)
  assert.equal(isInCurrentCalendarWeek('2026-09-07T12:00:00', monday), false)
})

test('촬영 시각은 국내 시간대 Asia/Seoul로 표시한다', () => {
  assert.equal(formatTravelDateTime('2026-08-31T15:00:00'), '2026. 8. 31. 오후 3:00')
  assert.equal(formatTravelDateTime('2026-08-31T06:30:00Z'), '2026. 8. 31. 오후 3:30')
  assert.equal(formatTravelDateTime('잘못된 시각'), '잘못된 시각')
})

test('월 달력은 일요일 기준 빈칸과 해당 월의 날짜만 포함한다', () => {
  assert.deepEqual(getMonthCalendarDays(2026, 1), Array.from({ length: 28 }, (_, index) => index + 1))
  assert.deepEqual(getMonthCalendarDays(2024, 1), [
    null, null, null, null,
    ...Array.from({ length: 29 }, (_, index) => index + 1),
  ])
  assert.deepEqual(getMonthCalendarDays(2026, 7), [
    null, null, null, null, null, null,
    ...Array.from({ length: 31 }, (_, index) => index + 1),
  ])
  assert.deepEqual(getMonthCalendarDays(2026, 12), getMonthCalendarDays(2027, 0))
  assert.deepEqual(getMonthCalendarDays(2026, -1), getMonthCalendarDays(2025, 11))
})

test('ICU가 영문 AM/PM을 돌려줘도 한국어 오전/오후를 유지한다', () => {
  const original = Intl.DateTimeFormat
  try {
    for (const [period, expected] of [['AM', '오전'], ['PM', '오후']]) {
      Intl.DateTimeFormat = (function () { return { format: () => `2026. 9. 1. ${period} 12:00` } }) as unknown as typeof Intl.DateTimeFormat
      assert.equal(formatTravelDateTime('2026-08-31T15:00:00Z'), `2026. 9. 1. ${expected} 12:00`)
    }
  } finally { Intl.DateTimeFormat = original }
})

test('시간대 없는 촬영 시각과 수정 입력은 한국 시각을 그대로 유지한다', () => {
  assert.equal(formatTravelDateTime('2026-10-20T11:21:00'), '2026. 10. 20. 오전 11:21')
  assert.equal(toTravelDateTimeInput('2026-10-20T11:21:00'), '2026-10-20T11:21')
  assert.equal(toTravelDateTimeInput('2026-10-20T02:21:00Z'), '2026-10-20T11:21')
  assert.equal(toTravelDateTimeInput('2026-10-20T11:21:00+09:00'), '2026-10-20T11:21')
  assert.equal(toTravelDateTimeInput(null), '')
})
