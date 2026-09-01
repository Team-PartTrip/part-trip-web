export type DdayPlan = {
  cityName?: string | null
  dday?: string | null
  countryName?: string | null
  endDate?: string | null
  startDate?: string | null
}

export function hasTravelPlan(plan?: DdayPlan) {
  if (!plan || plan.dday?.trim() === '쉬는 중' || plan.dday?.trim() === '여행 종료') return false
  return Boolean(plan.countryName || plan.cityName || plan.startDate || plan.endDate)
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
