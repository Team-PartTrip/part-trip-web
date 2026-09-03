import type { TourPlaceResponseDto } from '@/entities/travel'

export type PlannerGroupSettings = {
  isSolo: boolean
  memberCount: number
}

export const ACTIVE_VOTE_ID_KEY = 'parttrip:active-vote-id'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function parsePlannerGroupSettings(value: string | null): PlannerGroupSettings {
  try {
    const parsed: unknown = JSON.parse(value ?? '{}')
    const stored = isRecord(parsed) ? parsed : {}
    const isSolo = stored.isSolo === true
    const memberCount = stored.memberCount

    return {
      isSolo,
      memberCount:
        typeof memberCount === 'number' &&
        Number.isSafeInteger(memberCount) &&
        memberCount >= 1 &&
        memberCount <= 30
          ? isSolo ? memberCount : Math.max(2, memberCount)
          : isSolo ? 1 : 2,
    }
  } catch {
    return { isSolo: false, memberCount: 2 }
  }
}

export function parsePlannerSelectedIndexes(value: string | null) {
  try {
    const parsed: unknown = JSON.parse(value ?? '[]')
    return isSelectedIndexes(parsed)
      ? parsed
      : []
  } catch {
    return []
  }
}

function isSelectedIndexes(value: unknown): value is number[] {
  return Array.isArray(value) &&
    value.every((item): item is number => Number.isSafeInteger(item) && item >= 0)
}

function isSelectedPlace(value: unknown): value is TourPlaceResponseDto {
  if (!isRecord(value)) return false
  const stringFields = ['category', 'address', 'placeName', 'description', 'imageUrl']
  const numberFields = ['latitude', 'longitude', 'rating']
  return (value.tourPlaceId == null || (typeof value.tourPlaceId === 'number' && Number.isSafeInteger(value.tourPlaceId) && value.tourPlaceId > 0)) &&
    stringFields.every((field) => value[field] == null || typeof value[field] === 'string') &&
    numberFields.every((field) => value[field] == null || (typeof value[field] === 'number' && Number.isFinite(value[field])))
}

export function parsePlannerSelectedPlacesByCategory(value: string | null) {
  try {
    const parsed: unknown = JSON.parse(value ?? '{}')
    if (!isRecord(parsed)) return {}

    return Object.fromEntries(
      Object.entries(parsed).filter(([, places]) => Array.isArray(places) && places.every(isSelectedPlace)),
    ) as Record<string, TourPlaceResponseDto[]>
  } catch {
    return {}
  }
}
