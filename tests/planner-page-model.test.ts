import assert from 'node:assert/strict'
import test from 'node:test'

import { getPlannerPageModel } from '../src/widgets/planner/model/planner-page-model.ts'

test('planner page model은 멤버·초대·확정 장소·투표 파생 상태를 유지한다', () => {
  const model = getPlannerPageModel({
    currentUserName: '사용자',
    invitations: [{ status: 'ACCEPTED' }, { status: 'PENDING' }],
    members: [
      { nickName: '사용자', userId: 'me' },
      { nickName: '동행자', userId: 'friend' },
    ],
    profileId: 'me',
    votes: [
      { options: [], status: 'OPEN', voteId: 1 },
      { confirmedOptionId: 2, options: [], status: 'CLOSED', voteId: 2 },
      { options: [], status: 'OPEN' },
    ],
  })

  assert.deepEqual(model.otherMembers, [{ nickName: '동행자', userId: 'friend' }])
  assert.deepEqual(model.pendingInvitations, [{ status: 'PENDING' }])
  assert.equal(model.hasOpenVote, true)
  assert.equal(model.confirmedCount, 1)
  assert.equal(model.votingCount, 2)
})

test('동점으로 확정된 장소는 각각 확정 수로 집계한다', () => {
  const model = getPlannerPageModel({
    currentUserName: '사용자',
    invitations: [],
    members: [],
    votes: [{
      options: [
        { optionId: 1, confirmed: true },
        { optionId: 2, confirmed: true },
      ],
      status: 'CONFIRMED',
    }],
  })

  assert.equal(model.confirmedCount, 2)
})

test('확정 옵션 ID가 없는 응답은 미확정 장소를 확정 수로 세지 않는다', () => {
  const model = getPlannerPageModel({
    currentUserName: '사용자',
    invitations: [],
    members: [],
    votes: [{ options: [{ selectedByMe: false }], status: 'CLOSED' }],
  })

  assert.equal(model.confirmedCount, 0)
})

test('profile id가 없으면 nickname fallback과 투표 상태별 집계를 유지한다', () => {
  const model = getPlannerPageModel({
    currentUserName: '사용자',
    invitations: [],
    members: [
      { nickName: '사용자', userId: 'legacy-me' },
      { nickName: '동행자', userId: 'friend' },
    ],
    votes: [
      { options: [], status: 'CONFIRMED' },
      { options: [], status: 'OPEN' },
    ],
  })

  assert.deepEqual(model.otherMembers, [{ nickName: '동행자', userId: 'friend' }])
  assert.equal(model.hasOpenVote, false)
  assert.equal(model.confirmedCount, 1)
  assert.equal(model.votingCount, 1)
})
