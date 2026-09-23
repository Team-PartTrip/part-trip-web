import assert from 'node:assert/strict'
import test from 'node:test'

import { getPlannerTravelParty, isValidPlannerMemberCount } from '../src/widgets/planner/model/member-count.ts'

test('planner member count는 solo/group 경계와 최대 인원을 유지한다', () => {
  assert.equal(isValidPlannerMemberCount(1, true), true)
  assert.equal(isValidPlannerMemberCount(1, false), false)
  assert.equal(isValidPlannerMemberCount(2, false), true)
  assert.equal(isValidPlannerMemberCount(30, false), true)
  assert.equal(isValidPlannerMemberCount(31, false), false)
  assert.equal(isValidPlannerMemberCount(2.5, false), false)
})

test('여행 동행 기준 미선택은 혼자 여행으로 취급하지 않는다', () => {
  assert.equal(getPlannerTravelParty([]), undefined)
})

test('혼자와 동행 선택을 서로 다른 생성 payload로 변환한다', () => {
  assert.deepEqual(getPlannerTravelParty([{ type: 'COMPANION', value: '혼자 여행' }]), { isSolo: true, memberCount: 1 })
  assert.deepEqual(getPlannerTravelParty([
    { type: 'COMPANION', value: '가족과 함께' },
    { type: 'PARTY_SIZE', value: '4명' },
  ]), { isSolo: false, memberCount: 4 })
})
