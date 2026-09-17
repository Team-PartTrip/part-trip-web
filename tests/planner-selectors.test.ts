import assert from 'node:assert/strict'
import test from 'node:test'

import { getActiveVote, getPlannerConfirmationSelections } from '../src/widgets/planner/model/selectors.ts'

test('planner selector는 active vote의 category·id 우선순위를 유지한다', () => {
  const categoryVote = { voteId: 1, category: '명소', status: 'OPEN', options: [] }
  const detailVote = { voteId: 2, category: '명소', status: 'OPEN', options: [] }

  assert.equal(getActiveVote([categoryVote], detailVote, '명소', 2), detailVote)
  assert.equal(getActiveVote([categoryVote], undefined, '명소', 1), categoryVote)
})

test('confirmedOptionId와 optionId가 없으면 최다 득표 옵션 fallback을 유지한다', () => {
  assert.deepEqual(getPlannerConfirmationSelections([{
    options: [
      { selectedByMe: false, voteCount: 0 },
      { optionId: 12, selectedByMe: false, voteCount: 2 },
    ],
    status: 'CLOSED',
    voteId: 7,
  }]), [{ voteId: 7, optionId: 12 }])
})
