import assert from 'node:assert/strict'
import test from 'node:test'

import { canManagePlanner } from '../src/widgets/planner/model/planner-role.ts'

test('플래너 편집 권한은 OWNER에게만 준다', () => {
  assert.equal(canManagePlanner('OWNER'), true)
  assert.equal(canManagePlanner(' owner '), true)
  assert.equal(canManagePlanner('MEMBER'), false)
  assert.equal(canManagePlanner(undefined), false)
})
