import assert from 'node:assert/strict'
import test from 'node:test'

import {
  canClosePlannerVotes,
  getPlannerConfirmationSelections,
  getTopVoteOptions,
} from '../src/widgets/planner/model/selectors.ts'

test('manual vote close requires every eligible member to have voted', () => {
  assert.equal(canClosePlannerVotes([{ eligibleMemberCount: 3, options: [{ selectedByMe: true }], status: 'OPEN', voteId: 1, votedMemberCount: 1 }]), false)
  assert.equal(canClosePlannerVotes([{ eligibleMemberCount: 3, options: [], status: 'OPEN', voteId: 1, votedMemberCount: 3 }]), true)
  assert.equal(canClosePlannerVotes([{ eligibleMemberCount: 3, options: [], status: 'OPEN', voteId: 1, votedMemberCount: 3 }, { eligibleMemberCount: 2, options: [], status: 'OPEN', voteId: 2, votedMemberCount: 1 }]), false)
  assert.equal(canClosePlannerVotes([{ eligibleMemberCount: 2, options: [], status: 'OPEN', votedMemberCount: 2 }]), false)
  assert.equal(canClosePlannerVotes([{ eligibleMemberCount: 2, options: [], status: 'CLOSED', voteId: 1, votedMemberCount: 2 }]), false)
})

test('tied top options are all included in planner confirmation selections', () => {
  const vote = {
    options: [
      { optionId: 10, voteCount: 4, selectedByMe: false },
      { optionId: 11, voteCount: 4, selectedByMe: false },
      { optionId: 12, voteCount: 2, selectedByMe: false },
    ],
    status: 'CLOSED',
    voteId: 7,
  }

  assert.deepEqual(getTopVoteOptions(vote).map(({ optionId }) => optionId), [10, 11])
  assert.deepEqual(getPlannerConfirmationSelections([vote]), [
    { voteId: 7, optionId: 10 },
    { voteId: 7, optionId: 11 },
  ])
})
