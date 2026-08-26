import assert from 'node:assert/strict'
import test from 'node:test'

import {
  getIdValidationError,
  getPasswordValidationError,
  sanitizeId,
} from '../src/shared/utils/authValidation.ts'

test('회원가입 아이디는 Swagger 규칙인 소문자 영문과 숫자만 허용한다', () => {
  assert.equal(sanitizeId('ABC123'), 'abc123')
  assert.equal(getIdValidationError('abc123'), null)
  assert.notEqual(getIdValidationError('abc-123'), null)
})

test('회원가입 비밀번호는 Swagger 규칙인 2종 이상 조합을 요구한다', () => {
  assert.equal(getPasswordValidationError('password1'), null)
  assert.equal(getPasswordValidationError('password!'), null)
  assert.equal(getPasswordValidationError('1234567!'), null)
  assert.notEqual(getPasswordValidationError('password'), null)
  assert.notEqual(getPasswordValidationError('12345678'), null)
  assert.notEqual(getPasswordValidationError('!!!!!!!!'), null)
})
