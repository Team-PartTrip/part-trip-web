import assert from 'node:assert/strict'
import test from 'node:test'
import { shouldPollPlannerMembers } from '../src/widgets/planner/model/planner-role.ts'

test('멤버 갱신은 여러 명이고 여행이 끝나지 않은 경우에만 실행', () => {
  assert.equal(shouldPollPlannerMembers(undefined), false)
  assert.equal(shouldPollPlannerMembers({ memberCount: 1, status: 'DRAFT' }), false)
  for (const status of ['DRAFT', 'CONFIRMED', 'TRAVELING']) assert.equal(shouldPollPlannerMembers({ memberCount: 2, status }), true)
  for (const status of ['DONE', 'COMPLETED']) assert.equal(shouldPollPlannerMembers({ memberCount: 2, status }), false)
})
