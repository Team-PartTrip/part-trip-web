const MILLISECONDS_PER_DAY = 86_400_000

export function formatDate(value?: string) {
  return value?.replaceAll('-', '.') ?? '-'
}

export function getDateRangeDays(
  startDate?: string,
  endDate?: string,
): number | undefined {
  if (!startDate || !endDate) return undefined

  const start = Date.parse(startDate)
  const end = Date.parse(endDate)
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) {
    return undefined
  }

  return Math.round((end - start) / MILLISECONDS_PER_DAY) + 1
}

export function isInCurrentCalendarWeek(value?: string, today = new Date()) {
  if (!value) return false
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return false

  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const weekStart = new Date(todayStart)
  weekStart.setDate(todayStart.getDate() - ((todayStart.getDay() + 6) % 7))
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 7)
  const dateStart = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  return dateStart >= weekStart && dateStart < weekEnd
}
