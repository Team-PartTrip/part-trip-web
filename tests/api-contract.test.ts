import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const read = (path: string) => readFileSync(`${projectRoot}${path}`, 'utf8')

test('최신 명세의 경로·method·request body를 사용한다', () => {
  const planner = read('/src/entities/planner/api.ts')
  const plannerFlow = read('/src/widgets/planner/model/usePlannerFlow.ts')
  const plannerPage = read('/src/widgets/planner/ui/PlannerPage.tsx')
  const session = read('/src/entities/session/api.ts')
  const googleControl = read('/src/shared/ui/auth-form/GoogleLoginControl.tsx')
  const loginForm = read('/src/features/login/ui/LoginForm.tsx')
  const signUp = read('/src/features/register/ui/SignUpForm.tsx')
  const travel = read('/src/entities/travel/api.ts')
  const tripCard = read('/src/entities/trip-card/api.ts')

  const plannerCreateResponse = planner.slice(
    planner.indexOf('export type PlannerCreateResponseDto'),
    planner.indexOf('export type PlannerListResponseDto'),
  )
  const plannerDetailResponse = planner.slice(
    planner.indexOf('export type PlannerDetailResponseDto'),
    planner.indexOf('export type PlannerMemberResponseDto'),
  )
  const joinPlannerRequest = planner.slice(
    planner.indexOf('export type JoinPlannerRequestDto'),
    planner.indexOf('export type PlannerJoinResponseDto'),
  )
  assert.match(plannerCreateResponse, /inviteLink\?: string/)
  assert.doesNotMatch(plannerCreateResponse, /inviteCode/)
  assert.match(plannerDetailResponse, /inviteLink\?: string/)
  assert.doesNotMatch(plannerDetailResponse, /inviteCode/)
  assert.match(joinPlannerRequest, /inviteCode: string/)
  assert.match(plannerFlow, /const visiblePlannerInviteLink = plannerDetail\?\.inviteLink \?\? ''/)
  assert.match(plannerFlow, /autoJoinInviteCodeRef/)
  assert.match(plannerFlow, /void handleJoinPlanner\(\)/)
  assert.doesNotMatch(
    plannerFlow,
    /PLANNER_INVITE_(?:LINK|CODE)_KEY|plannerInviteCode|const\s*\[\s*plannerInviteLink\s*,|window\.location\.origin/,
  )
  assert.doesNotMatch(plannerFlow, /plannerInviteCode/)
  assert.doesNotMatch(plannerFlow, /window\.location\.origin\/planner\/group/)
  assert.match(planner, /update: \(plannerId: number\) => `\/planners\/\$\{plannerId\}\/travel-plan`/)
  assert.match(planner, /apiClient\.put<PlannerTravelPlanResponseDto>/)
  assert.match(planner, /export async function deletePlanner\(plannerId: number\)/)
  assert.match(planner, /apiClient\.post<string>\(PLANNER_API_PATHS\.cart\(plannerId\), payload\)/)
  assert.match(planner, /placeId\?: number\s+deadline\?: string/)
  assert.match(planner, /options: \(plannerId: number, voteId: number\) => `\/planners\/\$\{plannerId\}\/votes\/\$\{voteId\}\/options`/)
  assert.match(plannerFlow, /useAddPlannerPlacesMutation/)
  assert.match(plannerFlow, /addPlannerPlacesMutation\.mutateAsync\(\{ plannerId, payload: \{ placeIds \} \}\)/)
  assert.match(plannerFlow, /const placeIds = \[\.\.\.new Set\(selectedPlaces/)
  assert.match(plannerFlow, /placeIds\.length !== selectedPlaces\.length/)
  assert.match(plannerFlow, /useDeletePlannerMutation/)
  assert.match(plannerFlow, /const minimumMemberCount = isSolo \? 1 : 2/)
  assert.match(plannerPage, /삭제할까요\?/)
  assert.match(travel, /tourPlaceId\?: number/)
  assert.match(session, /resetToken: string\s+newPassword: string/)
  assert.match(session, /apiClient\.post<string>\(AUTH_API_PATHS\.session\.logout, payload\)/)
  assert.match(session, /export type LogoutRequestDto/)
  assert.doesNotMatch(session.slice(session.indexOf('export type SignUpRequestDto'), session.indexOf('export type RefreshRequestDto')), /phoneNumber|myCountry/)
  assert.match(googleControl, /flow: 'auth-code'/)
  assert.match(loginForm, /googleLogin\(\{ code \}\)/)
  assert.match(signUp, /await signUp\(\{/)
  assert.match(signUp, /await verifyCode\(\{ code: verificationCode, email \}\)/)
  assert.doesNotMatch(signUp, /phoneNumber|myCountry|전화번호|거주 국가/)
  assert.ok(signUp.indexOf('await signUp({') < signUp.indexOf('await verifyCode({ code: verificationCode, email })'))
  assert.match(tripCard, /updateTravelCardEntryComment/)
  assert.match(tripCard, /comment\?: string\s+imageFile: File/)
})
