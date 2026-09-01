import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const read = (path: string) => readFileSync(`${projectRoot}${path}`, 'utf8')

test('최신 명세의 경로·method·request body를 사용한다', () => {
  const planner = read('/src/entities/planner/api.ts')
  const plannerFlow = read('/src/widgets/planner/model/usePlannerFlow.ts')
  const session = read('/src/entities/session/api.ts')
  const tripCard = read('/src/entities/trip-card/api.ts')

  assert.match(planner, /update: \(plannerId: number\) => `\/planners\/\$\{plannerId\}\/travel-plan`/)
  assert.match(planner, /apiClient\.put<PlannerTravelPlanResponseDto>/)
  assert.match(planner, /placeId\?: number\s+deadline\?: string/)
  assert.match(planner, /options: \(plannerId: number, voteId: number\) => `\/planners\/\$\{plannerId\}\/votes\/\$\{voteId\}\/options`/)
  assert.match(plannerFlow, /const addedOptionIds: number\[\] = \[\]/)
  assert.match(plannerFlow, /deleteVoteOptionMutation\.mutateAsync\(\{ optionId, plannerId, voteId \}\)/)
  assert.match(plannerFlow, /const minimumMemberCount = isSolo \? 1 : 2/)
  assert.match(session, /resetToken: string\s+newPassword: string/)
  assert.match(session, /apiClient\.post<string>\(AUTH_API_PATHS\.session\.logout\)/)
  assert.match(tripCard, /comment\?: string\s+imageFile: File/)
})
