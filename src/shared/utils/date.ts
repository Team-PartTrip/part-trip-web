const MILLISECONDS_PER_DAY = 86_400_000
type DateValue = string | null | undefined

export type DateOnlyRange = {
  startDate: string
  endDate: string
}

type CalendarMonth = {
  year: number
  month: number
}

function parseDateOnly(value: DateValue) {
  const match = value?.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return undefined

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? date : undefined
}

function formatDateOnly(date: Date) {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`
}

export function getDateRangeWithPadding(startDate: DateValue, endDate: DateValue, paddingDays = 7): DateOnlyRange | undefined {
  const start = parseDateOnly(startDate)
  const end = parseDateOnly(endDate)
  if (!start || !end || end < start || !Number.isInteger(paddingDays) || paddingDays < 0) return undefined

  start.setUTCDate(start.getUTCDate() - paddingDays)
  end.setUTCDate(end.getUTCDate() + paddingDays)
  return { startDate: formatDateOnly(start), endDate: formatDateOnly(end) }
}

export function getCalendarMonthsInRange(startDate: DateValue, endDate: DateValue): CalendarMonth[] {
  const start = parseDateOnly(startDate)
  const end = parseDateOnly(endDate)
  if (!start || !end || end < start) return []

  const current = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), 1))
  const lastMonth = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 1))
  const months: CalendarMonth[] = []
  while (current <= lastMonth) {
    months.push({ year: current.getUTCFullYear(), month: current.getUTCMonth() + 1 })
    current.setUTCMonth(current.getUTCMonth() + 1)
  }
  return months
}

export function isDateInRange(value: DateValue, startDate: DateValue, endDate: DateValue) {
  const date = parseDateOnly(value)
  const start = parseDateOnly(startDate)
  const end = parseDateOnly(endDate)
  return Boolean(date && start && end && date >= start && date <= end)
}

const travelTimeZoneByCountryCode: Record<string, string> = {
  CN: 'Asia/Shanghai',
  DE: 'Europe/Berlin',
  ES: 'Europe/Madrid',
  FR: 'Europe/Paris',
  GB: 'Europe/London',
  IN: 'Asia/Kolkata',
  IT: 'Europe/Rome',
  JP: 'Asia/Tokyo',
  KR: 'Asia/Seoul',
  MY: 'Asia/Kuala_Lumpur',
  PH: 'Asia/Manila',
  SG: 'Asia/Singapore',
  TH: 'Asia/Bangkok',
  TW: 'Asia/Taipei',
  VN: 'Asia/Ho_Chi_Minh',
}

// ponytail: common multi-timezone cities only; use backend IANA metadata for exhaustive coverage.
const travelTimeZoneByCityName: Record<string, string> = {
  'Los Angeles': 'America/Los_Angeles',
  'New York': 'America/New_York',
  'San Francisco': 'America/Los_Angeles',
  '시드니': 'Australia/Sydney',
  'Auckland': 'Pacific/Auckland',
  'Christchurch': 'Pacific/Auckland',
  'Wellington': 'Pacific/Auckland',
  '뉴욕': 'America/New_York',
  '로스앤젤레스': 'America/Los_Angeles',
  '샌프란시스코': 'America/Los_Angeles',
  '밴쿠버': 'America/Vancouver',
  '시카고': 'America/Chicago',
  '토론토': 'America/Toronto',
  '자카르타': 'Asia/Jakarta',
  '멜버른': 'Australia/Melbourne',
  '퍼스': 'Australia/Perth',
  '오클랜드': 'Pacific/Auckland',
  '웰링턴': 'Pacific/Auckland',
  '크라이스트처치': 'Pacific/Auckland',
}

const travelTimeZoneByCountryName: Record<string, string> = {
  대만: 'Asia/Taipei',
  독일: 'Europe/Berlin',
  베트남: 'Asia/Ho_Chi_Minh',
  싱가포르: 'Asia/Singapore',
  영국: 'Europe/London',
  이탈리아: 'Europe/Rome',
  일본: 'Asia/Tokyo',
  중국: 'Asia/Shanghai',
  태국: 'Asia/Bangkok',
  프랑스: 'Europe/Paris',
  한국: 'Asia/Seoul',
}

function travelTimeZone(countryCode?: string, countryName?: string, cityName?: string) {
  return travelTimeZoneByCityName[cityName?.trim() ?? '']
    ?? travelTimeZoneByCountryCode[countryCode?.trim().toUpperCase() ?? '']
    ?? travelTimeZoneByCountryName[countryName?.trim() ?? '']
}

export function formatDate(value: DateValue) {
  return value?.replaceAll('-', '.') ?? '-'
}

export function formatTravelDateTime(value: DateValue, countryCode?: string, countryName?: string, cityName?: string) {
  if (!value) return '-'
  const normalized = value.trim()
  const date = new Date(/(?:Z|[+-]\d{2}:?\d{2})$/i.test(normalized) ? normalized : `${normalized}Z`)
  if (Number.isNaN(date.getTime())) return normalized.replace('T', ' ')

  const timeZone = travelTimeZone(countryCode, countryName, cityName)
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeZone: timeZone ?? 'UTC',
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
