import assert from 'node:assert/strict'
import test from 'node:test'
import { relativeLocationTime } from '../src/widgets/guardians/model/location-time.ts'

test('보호자 위치 경과 시간은 1분 경계와 미래·잘못된 시각을 처리한다', () => {
  const now = Date.parse('2026-10-18T00:00:00Z')
  assert.equal(relativeLocationTime(new Date(now).toISOString(), now), '방금 전')
  assert.equal(relativeLocationTime(new Date(now - 59_999).toISOString(), now), '방금 전')
  assert.equal(relativeLocationTime(new Date(now - 60_000).toISOString(), now), '1분 전')
  assert.equal(relativeLocationTime(new Date(now - 11 * 60_000).toISOString(), now), '11분 전')
  assert.equal(relativeLocationTime(new Date(now + 60_000).toISOString(), now), '방금 전')
  assert.equal(relativeLocationTime('invalid', now), '시각 미상')
})
