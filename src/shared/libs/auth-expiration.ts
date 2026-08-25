export const AUTH_EXPIRED_EVENT = 'parttrip:auth-expired'

export function notifyAuthExpired() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event(AUTH_EXPIRED_EVENT))
}
