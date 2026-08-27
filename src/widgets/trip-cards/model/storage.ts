export function parseHiddenTripIds(value: string | null) {
  try {
    const stored: unknown = JSON.parse(value ?? '[]')
    return Array.isArray(stored) && stored.every((id): id is number => typeof id === 'number')
      ? stored
      : []
  } catch {
    return []
  }
}

export function addHiddenTripIds(hiddenTripIds: readonly number[], selectedIds: readonly number[]) {
  const validSelectedIds = selectedIds.filter((id) => id >= 0)
  return [...new Set([...hiddenTripIds, ...validSelectedIds])]
}
