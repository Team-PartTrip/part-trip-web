import assert from 'node:assert/strict'
import test from 'node:test'

import { getTripDurationDays, sortTripHistoryNewestFirst, sortTripTimelineChronologically } from '../src/entities/trip-plan/metrics.ts'

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

test('여행 기록 목록은 최신 여행부터 보여주고 날짜가 없는 카드는 뒤에 둔다', () => {
  const cards = [
    { cardId: 1, startDate: '2025-06-01' },
    { cardId: 2, startDate: '2026-09-01' },
    { cardId: 3 },
    { cardId: 4, startDate: 'invalid' },
  ]

  assert.deepEqual(sortTripHistoryNewestFirst(cards).map(({ cardId }) => cardId), [2, 1, 3, 4])
})

test('기록 타임라인은 촬영 시각 또는 날짜 순으로 정렬하고 시각 없는 항목은 안정적으로 뒤에 둔다', () => {
  const timeline = [
    { entryId: 3, takenAt: '2026-09-03T10:00:00+09:00' },
    { entryId: 1, date: '2026-09-01' },
    { entryId: 2, takenAt: '2026-09-02T10:00:00+09:00' },
    { entryId: 4 },
    { entryId: 5 },
  ]

  assert.deepEqual(sortTripTimelineChronologically(timeline).map(({ entryId }) => entryId), [1, 2, 3, 4, 5])
})
