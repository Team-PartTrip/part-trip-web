import assert from 'node:assert/strict'
import test from 'node:test'

import { requestWithMockFallback } from '../src/shared/libs/api-fallback.ts'

function axiosError(status: number) {
  return Object.assign(new Error(`HTTP ${status}`), {
    isAxiosError: true,
    response: { status },
  })
}

test('실제 API의 404 오류를 mock으로 숨기지 않는다', async () => {
  await assert.rejects(
    requestWithMockFallback(
      async () => { throw axiosError(404) },
      () => 'mock result',
    ),
    /HTTP 404/,
  )
})

test('서버 오류는 mock으로 숨기지 않는다', async () => {
  await assert.rejects(
    requestWithMockFallback(
      async () => { throw axiosError(500) },
      () => 'mock result',
    ),
    /HTTP 500/,
  )
})

test('기본 모드에서는 실제 API 응답을 사용한다', async () => {
  const result = await requestWithMockFallback(
    async () => 'server result',
    () => 'mock result',
  )

  assert.equal(result, 'server result')
})
