import assert from 'node:assert/strict'
import test from 'node:test'

import { AUTH_EXPIRED_EVENT, notifyAuthExpired } from '../src/shared/libs/auth-expiration.ts'

test('인증 만료 이벤트를 브라우저에 전달한다', () => {
  const previousWindow = globalThis.window
  const events: string[] = []

  globalThis.window = {
    dispatchEvent: (event: Event) => {
      events.push(event.type)
      return true
    },
  } as unknown as Window & typeof globalThis

  notifyAuthExpired()

  assert.deepEqual(events, [AUTH_EXPIRED_EVENT])
  globalThis.window = previousWindow
})
