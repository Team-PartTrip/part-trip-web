import { getDateRangeDays } from '@/shared/utils'

const isCalendarDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const parsed = new Date(`${value}T00:00:00.000Z`)
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
}

export function isValidPlannerDateRange(startDate: string, endDate: string) {
  if (!isCalendarDate(startDate) || !isCalendarDate(endDate)) return false
  const days = getDateRangeDays(startDate, endDate)
  return days != null && days <= 14
}

export function overlapsExistingTrip(
  planners: Array<{ startDate?: string; endDate?: string; status?: string }>,
  startDate: string,
  endDate: string,
) {
  return planners.some((planner) => {
    if (!planner.startDate || !planner.endDate || ['ENDED', 'COMPLETED'].includes((planner.status ?? '').toUpperCase())) return false
    return planner.startDate <= endDate && planner.endDate >= startDate
  })
}
