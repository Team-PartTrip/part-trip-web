import type {
  PlannerScheduleDayDto,
  PlannerScheduleRouteDto,
  PlannerSchedulePlaceDto,
  PlannerScheduleSlotDto,
  SavePlannerScheduleRequestDto,
} from '@/entities/planner'

export type EditableScheduleSlot = PlannerScheduleSlotDto
export type EditableScheduleDay = { date: string; slots: EditableScheduleSlot[] }

export function copyScheduleDays(days: PlannerScheduleDayDto[] = []): EditableScheduleDay[] {
  return days.map((day) => ({
    date: day.date ?? '',
    slots: (day.slots ?? []).map((slot) => ({ ...slot })),
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

export type RoutePoint = { name?: string | null; latitude?: number | null; longitude?: number | null }

export function hasCoordinates(point?: RoutePoint) {
  return Boolean(point?.name?.trim()) && typeof point?.latitude === 'number' && Number.isFinite(point.latitude)
    && typeof point.longitude === 'number' && Number.isFinite(point.longitude)
}

export function getKakaoMapUrl(transportMode: PlannerScheduleRouteDto['transportMode'], name?: string, latitude?: number, longitude?: number, origin?: RoutePoint) {
  if (!name?.trim() || typeof latitude !== 'number' || !Number.isFinite(latitude)
    || typeof longitude !== 'number' || !Number.isFinite(longitude)) return undefined

  if (origin && hasCoordinates(origin)) {
    const mode = transportMode === 'PUBLIC_TRANSIT' ? 'traffic' : transportMode === 'WALKING' ? 'walk' : 'car'
    return `https://map.kakao.com/link/by/${mode}/${encodeURIComponent(origin.name!.trim())},${origin.latitude},${origin.longitude}/${encodeURIComponent(name.trim())},${latitude},${longitude}`
  }
  return `https://map.kakao.com/link/to/${encodeURIComponent(name.trim())},${latitude},${longitude}`
}

export function getDayOrigin(days: EditableScheduleDay[], dayIndex: number, departure: RoutePoint | null | undefined, resolveSlotPlace: (slot: EditableScheduleSlot) => (RoutePoint & { category?: string }) | undefined) {
  const previousSlots = days[dayIndex - 1]?.slots ?? []
  const lastPlaceSlot = [...previousSlots].reverse().find((slot) => slot.place || slot.tourPlaceId)
  const previousPlace = lastPlaceSlot ? resolveSlotPlace(lastPlaceSlot) : undefined
  const category = previousPlace?.category?.toUpperCase()
  if (previousPlace && (category === 'ACCOMMODATION' || category === '숙소')) return { point: previousPlace, isLodging: true }
  return departure ? { point: departure, isLodging: false } : undefined
}
