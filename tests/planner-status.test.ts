import assert from 'node:assert/strict'
import test from 'node:test'

import { plannerMatchesTab, plannerStatusKey, plannerStatusLabel } from '../src/widgets/planner/model/status.ts'

test('백엔드 플래너 상태를 화면 상태로 정확히 분류한다', () => {
  assert.equal(plannerStatusKey('PLANNING'), 'active')
  assert.equal(plannerStatusKey('VOTING'), 'active')
  assert.equal(plannerStatusKey('TRAVELING'), 'active')
  assert.equal(plannerStatusKey('CONFIRMED'), 'planned')
  assert.equal(plannerStatusKey('DONE'), 'completed')
  assert.equal(plannerStatusLabel('VOTING'), '일정 만드는 중')
  assert.equal(plannerStatusLabel('TRAVELING'), '여행 중')
})

test('확정 상태 판정은 앞뒤 공백을 정규화한다', () => {
  assert.equal(plannerStatusKey('  DONE  '), 'completed')
  assert.equal(plannerStatusLabel('  VOTING  '), '일정 만드는 중')
})

test('탭은 한국 날짜와 여행 일정을 기준으로 겹치지 않게 분류한다', () => {
  const today = '2026-09-30'
  assert.equal(plannerMatchesTab('PLANNING', '2026-10-01', '2026-10-03', 'active', today), false)
  assert.equal(plannerMatchesTab('PLANNING', '2026-10-01', '2026-10-03', 'planned', today), true)
  assert.equal(plannerMatchesTab('TRAVELING', '2026-09-30', '2026-10-02', 'planned', today), false)
  assert.equal(plannerMatchesTab('TRAVELING', '2026-09-30', '2026-10-02', 'active', today), true)
  assert.equal(plannerMatchesTab('CONFIRMED', today, today, 'planned', today), false)
  assert.equal(plannerMatchesTab('CONFIRMED', today, today, 'active', today), true)
  assert.equal(plannerMatchesTab('PLANNING', '2026-09-28', '2026-09-29', 'completed', today), true)
  assert.equal(plannerMatchesTab('DONE', '2026-10-01', '2026-10-03', 'active', today), false)
  assert.equal(plannerStatusKey('PLANNING', '2026-09-29', today), 'completed')
  assert.equal(plannerStatusLabel('PLANNING', '2026-09-29', today), '완료')
})

test('날짜 미설정 및 모르는 상태를 포함해 각 플래너는 탭 하나에만 표시한다', () => {
  for (const status of ['PLANNING', 'VOTING', 'TRAVELING', 'CONFIRMED', 'DONE', 'COMPLETED', undefined]) {
    for (const start of [undefined, 'invalid', '2026-09-29', '2026-09-30', '2026-10-01']) {
      for (const end of [undefined, '2026-09-29', '2026-10-01']) {
        assert.equal((['planned', 'active', 'completed'] as const).filter(tab => plannerMatchesTab(status, start, end, tab, '2026-09-30')).length, 1)
      }
    }
  }
  assert.equal(plannerStatusLabel('CONFIRMED'), '계획 확정')
})
