export function parsePlannerInviteCode(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (/^https?:\/\//i.test(trimmed)) {
    try { return new URL(trimmed).searchParams.get('inviteCode')?.trim() ?? '' } catch { return '' }
  }
  return /^[a-zA-Z0-9_-]+$/.test(trimmed) ? trimmed : ''
}
