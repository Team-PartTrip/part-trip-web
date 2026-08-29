export type PlannerStatusKey = 'active' | 'planned' | 'completed'

function normalizeStatus(status?: string) {
  return status?.trim().toLocaleUpperCase() ?? ''
}

export function plannerStatusKey(status?: string): PlannerStatusKey {
  const value = normalizeStatus(status)

  if (value === 'DONE' || value === 'COMPLETED' || value.includes('완료')) return 'completed'
  if (value === 'VOTING' || value === 'TRAVELING' || value === 'ACTIVE' || value === 'IN_PROGRESS' || value.includes('진행')) return 'active'
  return 'planned'
}

export function plannerStatusLabel(status?: string) {
  const value = normalizeStatus(status)

  if (value === 'DONE' || value === 'COMPLETED' || value.includes('완료')) return '완료'
  if (value === 'VOTING' || value.includes('투표')) return '투표 진행 중'
  if (value === 'TRAVELING' || value.includes('여행 중')) return '여행 중'
  if (value === 'CONFIRMED' || value.includes('확정')) return '여행 확정'
  return '그룹 모집 중'
}
