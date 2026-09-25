import assert from 'node:assert/strict'
import test from 'node:test'
import { createTestJiti } from './helpers.ts'

const jiti = createTestJiti()
const { shouldRetryQuery } = await jiti.import('./src/shared/libs/query-retry.ts').catch(() => ({})) as {
  shouldRetryQuery?: (failureCount: number, error: { response?: { status?: number } }) => boolean
}

test('권한이나 요청 오류는 재시도하지 않는다', () => {
  assert.equal(shouldRetryQuery?.(0, { response: { status: 403 } }), false)
  assert.equal(shouldRetryQuery?.(0, { response: { status: 404 } }), false)
})

test('일시 오류는 한 번만 재시도한다', () => {
  assert.equal(shouldRetryQuery?.(0, { response: { status: 503 } }), true)
  assert.equal(shouldRetryQuery?.(1, { response: { status: 503 } }), false)
  assert.equal(shouldRetryQuery?.(0, {}), true)
})
