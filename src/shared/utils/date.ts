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
