import assert from 'node:assert/strict'
import test from 'node:test'

import { getPlannerMemberDisplayName } from '../src/widgets/planner/model/member.ts'

test('planner member display name은 nickname·userId·기본값 순서를 유지한다', () => {
  assert.equal(getPlannerMemberDisplayName({ nickName: '여행자', userId: 'traveler' }), '여행자')
  assert.equal(getPlannerMemberDisplayName({ nickName: '', userId: 'traveler' }), 'traveler')
  assert.equal(getPlannerMemberDisplayName({}), '멤버')
})
