import type {
  PlannerScheduleDayDto,
  PlannerSchedulePlaceDto,
  PlannerScheduleSlotDto,
  SavePlannerScheduleRequestDto,
} from '@/entities/planner'

export type EditableScheduleDay = { date: string; slots: PlannerScheduleSlotDto[] }

export function copyScheduleDays(days: PlannerScheduleDayDto[] = []): EditableScheduleDay[] {
  return days.map((day) => ({
    date: day.date ?? '',
    slots: [...(day.slots ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
  }))
}

export function moveScheduleSlot(days: EditableScheduleDay[], dayIndex: number, slotIndex: number, direction: -1 | 1) {
  const slots = days[dayIndex]?.slots
  const target = slotIndex + direction
  if (!slots || target < 0 || target >= slots.length) return days
  const next = days.map((day) => ({ ...day, slots: [...day.slots] }))
  ;[next[dayIndex].slots[slotIndex], next[dayIndex].slots[target]] = [next[dayIndex].slots[target], next[dayIndex].slots[slotIndex]]
  return next
}

export function swapScheduleSlots(days: EditableScheduleDay[], fromDay: number, fromSlot: number, toDay: number, toSlot: number) {
  if (!days[fromDay]?.slots[fromSlot] || !days[toDay]?.slots[toSlot]) return days
  const next = days.map((day) => ({ ...day, slots: [...day.slots] }))
  ;[next[fromDay].slots[fromSlot], next[toDay].slots[toSlot]] = [next[toDay].slots[toSlot], next[fromDay].slots[fromSlot]]
  return next
}

export function addEmptyScheduleSlot(days: EditableScheduleDay[], dayIndex: number) {
  if (!days[dayIndex] || days[dayIndex].slots.length >= 50) return days
  return days.map((day, index) => index === dayIndex ? { ...day, slots: [...day.slots, {}] } : day)
}

export function removeScheduleSlot(days: EditableScheduleDay[], dayIndex: number, slotIndex: number) {
  return days.map((day, index) => index === dayIndex
    ? { ...day, slots: day.slots.filter((_, currentIndex) => currentIndex !== slotIndex) }
    : day)
}

export function setScheduleSlotPlace(
  days: EditableScheduleDay[],
  dayIndex: number,
  slotIndex: number,
  place: PlannerSchedulePlaceDto,
) {
  const slots = days[dayIndex]?.slots
  if (!slots || !Number.isSafeInteger(place.tourPlaceId) || !place.name) return days
  return days.map((day, index) => index === dayIndex
    ? { ...day, slots: day.slots.map((slot, currentIndex) => currentIndex === slotIndex
      ? { ...slot, tourPlaceId: place.tourPlaceId, place }
      : slot) }
    : day)
}

export function toSaveScheduleRequest(days: EditableScheduleDay[]): SavePlannerScheduleRequestDto {
  return {
    days: days.map((day) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(day.date)) throw new Error('일정 날짜를 확인해주세요.')
      return {
        date: day.date,
        slots: day.slots.map((slot) => {
          const tourPlaceId = slot.tourPlaceId ?? slot.place?.tourPlaceId
          return {
            ...(Number.isSafeInteger(slot.slotId) ? { slotId: slot.slotId } : {}),
            ...(Number.isSafeInteger(tourPlaceId) && Number(tourPlaceId) > 0 ? { tourPlaceId } : {}),
          }
        }),
      }
    }),
  }
}
