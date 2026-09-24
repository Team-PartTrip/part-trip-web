export function normalizeStatus(status?: string) {
  return status?.trim().toUpperCase() ?? ''
}
