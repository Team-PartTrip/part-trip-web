import type { TripPhase } from '../../../entities/travel/api.ts'

export type DdayPlan = {
  cityName?: string | null
  dday?: string | null
  countryName?: string | null
  endDate?: string | null
  startDate?: string | null
  status?: TripPhase
}

export function hasTravelPlan(plan?: DdayPlan) {
  return Boolean(plan?.status && plan.status !== 'NO_TRIP')
}

export function getTravelStatusCopy(status?: TripPhase) {
  switch (status) {
    case 'NO_TRIP': return '다음 여행이 아직 없어요'
    case 'BEFORE': return '다가오는 여행'
    case 'DURING': return '여행 중'
    case 'ENDED': return '여행 종료'
    default: return '여행 상태를 확인할 수 없습니다.'
  }
}

export function formatDday(value?: string | null) {
  const normalized = value?.trim()
  if (!normalized) return '-'
  if (/^d\s*-\s*day$/i.test(normalized) || normalized === 'D-Day') return 'D-Day'
  if (normalized === '여행 중' || normalized === '쉬는 중') return normalized

  const matched = normalized.match(/d\s*([+-]?)\s*(\d+)/i)
  if (!matched) return normalized

  return `D${matched[1] === '+' ? '+' : '-'}${matched[2]}`
}
