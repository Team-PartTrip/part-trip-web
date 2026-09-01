import assert from 'node:assert/strict'
import test from 'node:test'

import { createUnsupportedApiError, UNSUPPORTED_API_ERROR_CODE, UnsupportedApiError } from '../src/shared/libs/unsupported-api-error.ts'

test('미지원 API 오류는 공통 타입과 코드를 사용한다', () => {
  const error = createUnsupportedApiError('세계지도')

  assert.ok(error instanceof UnsupportedApiError)
  assert.equal(error.code, UNSUPPORTED_API_ERROR_CODE)
  assert.equal(error.message, '최신 API 명세서에 세계지도 API가 없습니다.')
})
