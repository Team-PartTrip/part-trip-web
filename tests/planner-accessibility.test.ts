import assert from 'node:assert/strict'
import test from 'node:test'
import { createTestJiti } from './helpers.ts'
import type { AccessibilityResponseDto } from '../src/entities/travel/api.ts'

const { accessibilityMessage } = await createTestJiti().import('./src/widgets/planner/model/accessibility.ts') as {
  accessibilityMessage: (data?: AccessibilityResponseDto, isError?: boolean) => string | undefined
}

test('무장애 정보의 서버 상태를 우선하고 구 응답의 matched를 지원한다', () => {
  assert.equal(accessibilityMessage({ status: 'NOT_FOUND', matched: true }), '무장애 정보 없음')
  assert.equal(accessibilityMessage({ status: 'UNAVAILABLE', matched: false }), '지금은 확인할 수 없어요')
  assert.equal(accessibilityMessage({ status: 'FOUND', matched: false }), undefined)
  assert.equal(accessibilityMessage({ matched: false }), '무장애 정보 없음')
  assert.equal(accessibilityMessage({ matched: true }), undefined)
  assert.equal(accessibilityMessage(undefined), undefined)
  assert.equal(accessibilityMessage(undefined, true), '지금은 확인할 수 없어요')
  assert.equal(accessibilityMessage({ status: 'FOUND' }, true), '지금은 확인할 수 없어요')
})
