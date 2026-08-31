const MILLISECONDS_PER_DAY = 86_400_000

const travelTimeZoneByCountryCode: Record<string, string> = {
  AU: 'Australia/Sydney',
  CA: 'America/Toronto',
  CN: 'Asia/Shanghai',
  DE: 'Europe/Berlin',
  ES: 'Europe/Madrid',
  FR: 'Europe/Paris',
  GB: 'Europe/London',
  ID: 'Asia/Jakarta',
  IN: 'Asia/Kolkata',
  IT: 'Europe/Rome',
  JP: 'Asia/Tokyo',
  KR: 'Asia/Seoul',
  MY: 'Asia/Kuala_Lumpur',
  NZ: 'Pacific/Auckland',
  PH: 'Asia/Manila',
  SG: 'Asia/Singapore',
  TH: 'Asia/Bangkok',
  TW: 'Asia/Taipei',
  US: 'America/New_York',
  VN: 'Asia/Ho_Chi_Minh',
}

const travelTimeZoneByCountryName: Record<string, string> = {
  대만: 'Asia/Taipei',
  독일: 'Europe/Berlin',
  미국: 'America/New_York',
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

function travelTimeZone(countryCode?: string, countryName?: string) {
  return travelTimeZoneByCountryCode[countryCode?.trim().toUpperCase() ?? '']
    ?? travelTimeZoneByCountryName[countryName?.trim() ?? '']
}

export function formatDate(value?: string) {
  return value?.replaceAll('-', '.') ?? '-'
}

export function formatTravelDateTime(value?: string, countryCode?: string, countryName?: string) {
  if (!value) return '-'
  const normalized = value.trim()
  const date = new Date(/(?:Z|[+-]\d{2}:?\d{2})$/i.test(normalized) ? normalized : `${normalized}Z`)
  if (Number.isNaN(date.getTime())) return normalized.replace('T', ' ')

  const timeZone = travelTimeZone(countryCode, countryName)
  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    ...(timeZone ? { timeZone } : {}),
    timeStyle: 'short',
  }).format(date)
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
