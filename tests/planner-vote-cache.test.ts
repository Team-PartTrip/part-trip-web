import assert from 'node:assert/strict'
import test from 'node:test'
import { QueryClient } from '@tanstack/react-query'

import { plannerQueryKeys } from '../src/entities/planner/query-keys.ts'

test('투표 목록 무효화는 해당 플래너의 상세 투표 캐시도 무효화한다', async () => {
  const queryClient = new QueryClient()
  const currentVote = plannerQueryKeys.vote(12, 34)
  const otherPlannerVote = plannerQueryKeys.vote(13, 34)
  queryClient.setQueryData(currentVote, { voteId: 34 })
  queryClient.setQueryData(otherPlannerVote, { voteId: 34 })

  await queryClient.invalidateQueries({ queryKey: plannerQueryKeys.votes(12) })

  assert.equal(queryClient.getQueryState(currentVote)?.isInvalidated, true)
  assert.equal(queryClient.getQueryState(otherPlannerVote)?.isInvalidated, false)
  queryClient.clear()
})
