import assert from 'node:assert/strict'
import test from 'node:test'

import { isPositiveSafeInteger } from '../src/shared/utils/number.ts'

test('ID로 사용할 수 있는 값만 양의 안전한 정수로 판별한다', () => {
  assert.equal(isPositiveSafeInteger(1), true)
  assert.equal(isPositiveSafeInteger(0), false)
  assert.equal(isPositiveSafeInteger(-1), false)
  assert.equal(isPositiveSafeInteger(Number.MAX_SAFE_INTEGER + 1), false)
  assert.equal(isPositiveSafeInteger(undefined), false)
})
