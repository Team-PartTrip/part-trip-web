import assert from 'node:assert/strict'
import test from 'node:test'

import { getSafeRedirect, validateAuthSearch } from '../src/shared/utils/redirect.ts'

test('인증 리다이렉트는 내부 경로와 쿼리만 허용한다', () => {
  assert.equal(
    getSafeRedirect('/planner/group?inviteCode=OSK-4821'),
    '/planner/group?inviteCode=OSK-4821',
  )
  assert.equal(getSafeRedirect('https://evil.example'), undefined)
  assert.equal(getSafeRedirect('//evil.example/path'), undefined)
  assert.equal(getSafeRedirect('/\\evil.example'), undefined)
})

test('인증 search는 문자열 redirect만 보존한다', () => {
  assert.deepEqual(validateAuthSearch({ redirect: '/main', ignored: true }), {
    redirect: '/main',
  })
  assert.deepEqual(validateAuthSearch({ redirect: 42 }), {})
})
