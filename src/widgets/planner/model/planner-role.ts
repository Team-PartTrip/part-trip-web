export function canManagePlanner(role?: string) {
  return role?.trim().toUpperCase() === 'OWNER'
}

export function isPlannerFinished(status?: string) {
  return ['DONE', 'COMPLETED'].includes(status?.trim().toUpperCase() ?? '')
}

export function shouldPollPlannerMembers(detail?: { status?: string; memberCount?: number }) {
  return detail != null && (detail.memberCount ?? 0) > 1 && !isPlannerFinished(detail.status)
}
