export function sanitizeGuardianInviteCode(value: string) {
  return value.toUpperCase().replace(/[^A-HJ-KM-NP-Z2-9]/g, '').slice(0, 6)
}
