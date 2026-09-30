const MILLISECONDS_PER_DAY = 86_400_000
type DateValue = string | null | undefined

export type DateOnlyRange = {
  startDate: string
  endDate: string
}

export function getMonthCalendarDays(year: number, monthIndex: number): Array<number | null> {
  const leadingDays = new Date(year, monthIndex, 1).getDay()
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  return [
    ...Array<null>(leadingDays).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ]
}

export function formatCalendarDate(year: number, monthIndex: number, day: number) {
  return `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function parseDateOnly(value: DateValue) {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return undefined

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(0)
  date.setUTCHours(0, 0, 0, 0)
  date.setUTCFullYear(year, month - 1, day)
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? date : undefined
}

export function isValidDateOnly(value?: string | null): value is string {
  return Boolean(parseDateOnly(value))
}

function formatDateOnly(date: Date) {
  return formatCalendarDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
}

export function getDateRangeWithPadding(startDate: DateValue, endDate: DateValue, paddingDays = 7): DateOnlyRange | undefined {
  const start = parseDateOnly(startDate)
  const end = parseDateOnly(endDate)
  if (!start || !end || end < start || !Number.isInteger(paddingDays) || paddingDays < 0) return undefined

  start.setUTCDate(start.getUTCDate() - paddingDays)
  end.setUTCDate(end.getUTCDate() + paddingDays)
  return { startDate: formatDateOnly(start), endDate: formatDateOnly(end) }
}

export function formatDate(value: DateValue) {
  return value?.replaceAll('-', '.') ?? '-'
}

export function formatDateRange(startDate: DateValue, endDate: DateValue) {
  const start = formatDate(startDate)
  const end = formatDate(endDate)
  return start.length >= 7 && end.length >= 7 && start.slice(0, 7) === end.slice(0, 7)
    ? `${start} – ${end.slice(5)}`
    : `${start} – ${end}`
}

export function formatTravelDateTime(value: DateValue) {
  if (!value) return '-'
  const normalized = value.trim()
  const date = new Date(/(?:Z|[+-]\d{2}:?\d{2})$/i.test(normalized) ? normalized : `${normalized}Z`)
  if (Number.isNaN(date.getTime())) return normalized.replace('T', ' ')

  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeZone: 'Asia/Seoul',
    timeStyle: 'short',
  }).format(date)
}

export function getDateRangeDays(
  startDate: DateValue,
  endDate: DateValue,
): number | undefined {
  if (!startDate || !endDate) return undefined

  const start = Date.parse(startDate)
  const end = Date.parse(endDate)
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) {
    return undefined
  }

  return Math.round((end - start) / MILLISECONDS_PER_DAY) + 1
}

export function formatTripDuration(startDate: DateValue, endDate: DateValue) {
  const days = getDateRangeDays(startDate, endDate)
  return days == null ? '' : `${Math.max(0, days - 1)}박 ${days}일`
}

export function isInCurrentCalendarWeek(value: DateValue, today = new Date()) {
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
