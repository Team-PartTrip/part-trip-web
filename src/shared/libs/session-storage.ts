import { isPositiveSafeInteger } from '@/shared/utils/number'

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
