import assert from 'node:assert/strict'
import test from 'node:test'

import {
  addEmptyScheduleSlot,
  copyScheduleDays,
  moveScheduleSlot,
  setScheduleSlotPlace,
  swapScheduleSlots,
  toSaveScheduleRequest,
} from '../src/widgets/planner/model/schedule-edit.ts'

test('schedule 저장 요청은 화면 카드 순서를 그대로 전달하고 표현 가능한 필드만 보낸다', () => {
  const days = copyScheduleDays([{ date: '2026-10-01', slots: [
    { slotId: 11, order: 2, tourPlaceId: 22, place: { name: '둘째' } },
    { slotId: 10, order: 1, tourPlaceId: 21, place: { name: '첫째' } },
  ] }])
  const ordered = moveScheduleSlot(days, 0, 0, 1)
  assert.deepEqual(toSaveScheduleRequest(ordered), {
    days: [{ date: '2026-10-01', slots: [{ slotId: 11, tourPlaceId: 22 }, { slotId: 10, tourPlaceId: 21 }] }],
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
