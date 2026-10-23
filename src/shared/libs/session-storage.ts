import { isPositiveSafeInteger } from '../utils/number.ts'

export function clearUserSessionStorage() {
  if (typeof window === 'undefined') return
  try {
    const storage = window.sessionStorage
    for (let index = storage.length - 1; index >= 0; index -= 1) {
      const key = storage.key(index)
      if (key?.startsWith('parttrip:')) storage.removeItem(key)
    }
  } catch {
    // Restricted browsers may deny sessionStorage access.
  }
}

export function readSessionValue(key: string) {
  if (typeof window === 'undefined') return null
  try {
    return window.sessionStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeSessionValue(key: string, value: string) {
  try {
    if (typeof window !== 'undefined') window.sessionStorage.setItem(key, value)
  } catch {
    // sessionStorage can be unavailable in private or restricted browser contexts.
  }
}

export function removeSessionValue(key: string) {
  try {
    if (typeof window !== 'undefined') window.sessionStorage.removeItem(key)
  } catch {
    // sessionStorage can be unavailable in private or restricted browser contexts.
  }
}

export function readSessionId(key: string) {
  const value = Number(readSessionValue(key))
  return isPositiveSafeInteger(value) ? value : 0
}
