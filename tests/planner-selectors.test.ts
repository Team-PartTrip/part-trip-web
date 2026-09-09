import assert from 'node:assert/strict'
import test from 'node:test'

import {
  getActiveVote,
  getCandidateManagementState,
  getSelectedPlaceIndexes,
} from '../src/widgets/planner/model/selectors.ts'

test('planner selector는 장소 식별 규칙과 선택 인덱스를 유지한다', () => {
  assert.deepEqual(
    getSelectedPlaceIndexes(
      [{ tourPlaceId: 1 }, { placeName: '오사카성', address: '오사카', imageUrl: 'image' }],
      [{ tourPlaceId: 1 }, { placeName: '오사카성', address: '오사카', imageUrl: 'image' }],
    ),
    [0, 1],
  )
})

test('planner selector는 active vote의 category·id 우선순위를 유지한다', () => {
  const categoryVote = { voteId: 1, category: '명소', status: 'OPEN', options: [] }
  const detailVote = { voteId: 2, category: '명소', status: 'OPEN', options: [] }

  assert.equal(getActiveVote([categoryVote], detailVote, '명소', 2), detailVote)
  assert.equal(getActiveVote([categoryVote], undefined, '명소', 1), categoryVote)
})

test('planner selector는 후보 관리의 loading·error·closed 상태를 유지한다', () => {
  assert.deepEqual(getCandidateManagementState([], false, false), {
    canManageCandidates: true,
    candidateManagementError: '',
  })
  assert.equal(getCandidateManagementState([], true, false).canManageCandidates, false)
  assert.equal(getCandidateManagementState([{ status: 'CLOSED', options: [] }], false, false).canManageCandidates, false)
})
