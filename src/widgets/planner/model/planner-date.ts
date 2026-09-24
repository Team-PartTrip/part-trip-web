import { getDateRangeDays, isValidDateOnly, normalizeStatus } from '@/shared/utils'

export function isValidPlannerDateRange(startDate: string, endDate: string) {
  if (!isValidDateOnly(startDate) || !isValidDateOnly(endDate)) return false
  const days = getDateRangeDays(startDate, endDate)
  return days != null && days <= 14
}

export function overlapsExistingTrip(
  planners: Array<{ startDate?: string; endDate?: string; status?: string }>,
  startDate: string,
  endDate: string,
) {
  return planners.some((planner) => {
    if (!planner.startDate || !planner.endDate || ['ENDED', 'COMPLETED'].includes(normalizeStatus(planner.status))) return false
    return planner.startDate <= endDate && planner.endDate >= startDate
  })
}
