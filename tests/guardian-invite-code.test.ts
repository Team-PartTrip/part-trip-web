import assert from 'node:assert/strict'
import test from 'node:test'

import { sanitizeGuardianInviteCode } from '../src/entities/guardian/invite-code.ts'

test('보호자 코드는 대문자 6자리로 정리하고 혼동 문자를 제거한다', () => {
  assert.equal(sanitizeGuardianInviteCode('ab0oi1l-z23456'), 'ABZ234')
  assert.equal(sanitizeGuardianInviteCode('abc'), 'ABC')
})
