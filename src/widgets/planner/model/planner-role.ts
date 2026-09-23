export function canManagePlanner(role?: string) {
  return role?.trim().toUpperCase() === 'OWNER'
}
