import type {
  PlannerScheduleDayDto,
  PlannerScheduleRouteStatus,
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

const routeFailureMessages: Partial<Record<PlannerScheduleRouteStatus, string>> = {
  API_ERROR: '경로를 불러오지 못했어요. 잠시 후 다시 확인하거나 카카오맵에서 찾아보세요.',
  NO_ROUTE: '대중교통으로 가는 경로가 없어요. 택시나 도보를 이용해 주세요.',
  MISSING_COORDINATES: '장소 위치 정보가 없어 경로를 찾지 못했어요. 다른 장소로 바꿔 보세요.',
  DAILY_QUOTA_REACHED: '오늘 경로 조회 한도를 다 썼어요. 내일 다시 확인해 주세요.',
  WAITING_FOR_API_KEY: '경로 안내를 준비하고 있어요.',
}

export function getRouteFailureMessage(status?: PlannerScheduleRouteStatus | null) {
  return status ? routeFailureMessages[status] : undefined
}
