import assert from 'node:assert/strict'
import test from 'node:test'

import { isValidPlannerMemberCount } from '../src/widgets/planner/model/member-count.ts'

test('planner member count는 solo/group 경계와 최대 인원을 유지한다', () => {
  assert.equal(isValidPlannerMemberCount(1, true), true)
  assert.equal(isValidPlannerMemberCount(1, false), false)
  assert.equal(isValidPlannerMemberCount(2, false), true)
  assert.equal(isValidPlannerMemberCount(30, false), true)
  assert.equal(isValidPlannerMemberCount(31, false), false)
  assert.equal(isValidPlannerMemberCount(2.5, false), false)
})
