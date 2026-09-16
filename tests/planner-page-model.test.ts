import assert from 'node:assert/strict'
import test from 'node:test'

import { getPlannerPageModel } from '../src/widgets/planner/model/planner-page-model.ts'

test('planner page model은 멤버·초대·확정 장소·투표 파생 상태를 유지한다', () => {
  const model = getPlannerPageModel({
    confirmedPlaces: [],
    currentUserName: '사용자',
    invitations: [{ status: 'ACCEPTED' }, { status: 'PENDING' }],
    members: [
      { nickName: '사용자', userId: 'me' },
      { nickName: '동행자', userId: 'friend' },
    ],
    profileId: 'me',
    selectedPlaces: [{ item: { placeName: '오사카성' } }],
    voteCategory: '명소',
    votes: [
      { options: [], status: 'OPEN', voteId: 1 },
      { confirmedOptionId: 2, options: [], status: 'CLOSED', voteId: 2 },
      { options: [], status: 'OPEN' },
    ],
  })

  assert.deepEqual(model.otherMembers, [{ nickName: '동행자', userId: 'friend' }])
  assert.deepEqual(model.pendingInvitations, [{ status: 'PENDING' }])
  assert.deepEqual(model.finalPlaces, [{ category: '명소', categoryLabel: '명소', placeName: '오사카성', voteCount: undefined }])
  assert.equal(model.hasOpenVote, true)
  assert.equal(model.confirmedCount, 1)
  assert.equal(model.votingCount, 2)
})

test('확정 장소가 있으면 selected place fallback을 사용하지 않는다', () => {
  const confirmedPlaces = [{ placeName: '확정 장소' }]
  const model = getPlannerPageModel({
    confirmedPlaces,
    currentUserName: '사용자',
    invitations: [],
    members: [],
    selectedPlaces: [{ item: { placeName: '임시 장소' } }],
    voteCategory: '명소',
    votes: [],
  })

  assert.equal(model.finalPlaces, confirmedPlaces)
})

test('profile id가 없으면 nickname fallback과 투표 상태별 집계를 유지한다', () => {
  const model = getPlannerPageModel({
    confirmedPlaces: [],
    currentUserName: '사용자',
    invitations: [],
    members: [
      { nickName: '사용자', userId: 'legacy-me' },
      { nickName: '동행자', userId: 'friend' },
    ],
    selectedPlaces: [],
    voteCategory: '명소',
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
