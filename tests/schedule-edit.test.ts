import assert from 'node:assert/strict'
import test from 'node:test'

import {
  addEmptyScheduleSlot,
  copyScheduleDays,
  moveScheduleSlot,
  setScheduleSlotPlace,
  swapScheduleSlots,
  toSaveScheduleRequest, getRouteFailureMessage } from '../src/widgets/planner/model/schedule-edit.ts'

test('schedule 저장 요청은 화면 카드 순서를 그대로 전달하고 표현 가능한 필드만 보낸다', () => {
  const days = copyScheduleDays([{ date: '2026-10-01', slots: [
    { slotId: 11, tourPlaceId: 22 },
    { slotId: 10, tourPlaceId: 21 },
  ] }])
  const ordered = moveScheduleSlot(days, 0, 0, 1)
  assert.deepEqual(toSaveScheduleRequest(ordered), {
    days: [{ date: '2026-10-01', slots: [{ slotId: 10, tourPlaceId: 21 }, { slotId: 11, tourPlaceId: 22 }] }],
  })
})

test('empty slot can be populated and exchanged between dates without inventing a place ID', () => {
  const days = copyScheduleDays([
    { date: '2026-10-01', slots: [{ slotId: 1, tourPlaceId: 10 }] },
    { date: '2026-10-02', slots: [] },
  ])
  const withEmpty = addEmptyScheduleSlot(days, 1)
  const filled = setScheduleSlotPlace(withEmpty, 1, 0, { tourPlaceId: 20, name: '부산 박물관' })
  const swapped = swapScheduleSlots(filled, 0, 0, 1, 0)
  assert.deepEqual(toSaveScheduleRequest(swapped).days.map((day) => day.slots), [
    [{ tourPlaceId: 20 }],
    [{ slotId: 1, tourPlaceId: 10 }],
  ])
})

test('경로 실패 상태는 사용자 문구로 바꾸고 성공·계산 중은 문구가 없다', () => {
  for (const status of ['API_ERROR', 'NO_ROUTE', 'MISSING_COORDINATES', 'DAILY_QUOTA_REACHED', 'WAITING_FOR_API_KEY'] as const) {
    const message = getRouteFailureMessage(status)
    assert.ok(message && !message.includes(status))
  }
  assert.equal(getRouteFailureMessage('READY'), undefined)
  assert.equal(getRouteFailureMessage('CALCULATING'), undefined)
  assert.equal(getRouteFailureMessage(null), undefined)
})
