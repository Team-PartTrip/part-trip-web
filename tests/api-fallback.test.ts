import assert from 'node:assert/strict'
import test from 'node:test'

import { requestWithMockFallback } from '../src/shared/libs/api-fallback.ts'

function axiosError(status: number) {
  return Object.assign(new Error(`HTTP ${status}`), {
    isAxiosError: true,
    response: { status },
  })
}

test('명세 endpoint가 서버에 없으면 mock fallback을 사용한다', async () => {
  const result = await requestWithMockFallback(
    async () => { throw axiosError(404) },
    () => 'mock result',
  )

  assert.equal(result, 'mock result')
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

test('Swagger에 없는 API는 서버 요청 없이 mock을 사용한다', async () => {
  let requested = false
  const result = await requestWithMockFallback(
    async () => {
      requested = true
      return 'server result'
    },
    () => 'mock result',
    { mockFirst: true },
  )

  assert.equal(result, 'mock result')
  assert.equal(requested, false)
})
