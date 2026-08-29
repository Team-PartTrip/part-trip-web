import assert from 'node:assert/strict'
import test from 'node:test'

import { plannerStatusKey, plannerStatusLabel } from '../src/widgets/planner/model/status.ts'

test('백엔드 플래너 상태를 화면 상태로 정확히 분류한다', () => {
  assert.equal(plannerStatusKey('PLANNING'), 'active')
  assert.equal(plannerStatusKey('VOTING'), 'active')
  assert.equal(plannerStatusKey('TRAVELING'), 'active')
  assert.equal(plannerStatusKey('CONFIRMED'), 'planned')
  assert.equal(plannerStatusKey('DONE'), 'completed')
  assert.equal(plannerStatusLabel('VOTING'), '투표 진행 중')
  assert.equal(plannerStatusLabel('TRAVELING'), '여행 중')
})
