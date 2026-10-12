export function readVisitedStops(date: string): number[] {
  try {
    const saved: unknown = JSON.parse(window.localStorage.getItem(`parttrip:visited:${date}`) ?? '[]')
    return Array.isArray(saved) && saved.every((id) => Number.isSafeInteger(id) && id > 0) ? [...new Set(saved)] : []
  } catch {
    return []
  }
}

export function saveVisitedStops(date: string, slotIds: number[]) {
  try {
    window.localStorage.setItem(`parttrip:visited:${date}`, JSON.stringify(slotIds))
    return true
  } catch {
    return false
  }
}
