import { normalizeStatus } from '../../../shared/utils/status.ts'
import { isValidDateOnly } from '../../../shared/utils/date.ts'

export type PlannerStatusKey = 'active' | 'planned' | 'completed'

export { normalizeStatus }

function koreaToday() {
  const parts = new Intl.DateTimeFormat('en', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? ''
  return `${part('year')}-${part('month')}-${part('day')}`
}

function isCompletedStatus(status?: string) {
  const value = normalizeStatus(status)
  return value === 'DONE' || value === 'COMPLETED' || value.includes('완료')
}

export function plannerStatusKey(status?: string, endDate?: string, today = koreaToday()): PlannerStatusKey {
  const value = normalizeStatus(status)

  if (isCompletedStatus(status) || (isValidDateOnly(endDate) && endDate < today)) return 'completed'
  if (value === 'PLANNING' || value === 'VOTING' || value === 'TRAVELING' || value === 'ACTIVE' || value === 'IN_PROGRESS' || value.includes('진행')) return 'active'
  return 'planned'
}

export function plannerMatchesTab(
  status: string | undefined,
  startDate: string | undefined,
  endDate: string | undefined,
  tab: PlannerStatusKey,
  today = koreaToday(),
) {
  const completed = isCompletedStatus(status) || (isValidDateOnly(endDate) && endDate < today)
  if (tab === 'completed') return completed
  if (completed) return false
  const traveling = normalizeStatus(status) === 'TRAVELING' || (isValidDateOnly(startDate) && startDate <= today)
  return tab === 'active' ? traveling : !traveling
}

export function plannerStatusLabel(status?: string, endDate?: string, today = koreaToday(), startDate?: string) {
  const value = normalizeStatus(status)

  if (isCompletedStatus(status) || (isValidDateOnly(endDate) && endDate < today)) return '여행 완료'
  if (isValidDateOnly(startDate) && startDate <= today) return '여행 중'
  if (value === 'VOTING' || value.includes('투표')) return '일정 만드는 중'
  if (value === 'TRAVELING' || value.includes('여행 중')) return '여행 중'
  if (value === 'CONFIRMED' || value.includes('확정')) return '계획 확정'
  return '그룹 모집 중'
}
