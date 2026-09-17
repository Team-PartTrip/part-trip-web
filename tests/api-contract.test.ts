import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const read = (path: string) => readFileSync(`${projectRoot}${path}`, 'utf8')
const readSources = (paths: string[]) =>
  paths
    .filter((path) => existsSync(`${projectRoot}${path}`))
    .map(read)
    .join('\n')

test('최신 명세의 경로·method·request body를 사용한다', () => {
  const planner = readSources([
    '/src/entities/planner/api.ts',
    '/src/entities/planner/types.ts',
  ])
  const plannerFlow = readSources([
    '/src/widgets/planner/model/usePlannerFlow.ts',
    '/src/widgets/planner/model/usePlannerCandidateFlow.ts',
    '/src/widgets/planner/model/usePlannerDestinationFlow.ts',
    '/src/widgets/planner/model/usePlannerGroupFlow.ts',
    '/src/widgets/planner/model/usePlannerLifecycleFlow.ts',
    '/src/widgets/planner/model/usePlannerVoteFlow.ts',
  ])
  const candidateFlow = read('/src/widgets/planner/model/usePlannerCandidateFlow.ts')
  const plannerMutations = read('/src/widgets/planner/model/usePlannerMutations.ts')
  const plannerPage = readSources([
    '/src/widgets/planner/ui/PlannerPage.tsx',
    '/src/widgets/planner/ui/PlannerListStep.tsx',
    '/src/widgets/planner/ui/PlannerGroupStep.tsx',
    '/src/widgets/planner/ui/PlannerStepViews.tsx',
    '/src/widgets/planner/ui/PlannerDestinationStep.tsx',
    '/src/widgets/planner/ui/PlannerExploreStep.tsx',
    '/src/widgets/planner/ui/PlannerLineupStep.tsx',
    '/src/widgets/planner/ui/PlannerProgressStep.tsx',
    '/src/widgets/planner/ui/PlannerVoteStep.tsx',
  ])
  const profile = read('/src/widgets/profile/ui/ProfilePage.tsx')
  const session = read('/src/entities/session/api.ts')
  const googleControl = read('/src/shared/ui/auth-form/GoogleLoginControl.tsx')
  const kakaoControl = read('/src/shared/ui/auth-form/KakaoLoginControl.tsx')
  const kakaoAuth = read('/src/shared/libs/kakao-auth.ts')
  const kakaoCallback = read('/src/routes/(public)/auth/kakao/callback/index.tsx')
  const loginForm = read('/src/features/login/ui/LoginForm.tsx')
  const signUp = read('/src/features/register/ui/SignUpForm.tsx')
  const paths = read('/src/shared/config/paths.ts')
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
  assert.match(plannerFlow, /plannerInviteLink: data\.plannerDetail\?\.inviteLink \?\? ''/)
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
  assert.match(plannerMutations, /useAddPlannerPlacesMutation/)
  assert.match(plannerFlow, /addPlannerPlacesMutation\.mutateAsync\(\{ plannerId, payload: \{ placeIds \} \}\)/)
  assert.equal((plannerFlow.match(/if \(candidateManagementError\)/g) ?? []).length, 3)
  const randomLineupStart = candidateFlow.indexOf('const handleRandomLineup = async () => {')
  const randomLineupEnd = candidateFlow.indexOf('\n  return {', randomLineupStart)
  const randomLineup = candidateFlow.slice(randomLineupStart, randomLineupEnd)
  const addCandidateIndex = randomLineup.indexOf('addPlannerPlacesMutation.mutateAsync')
  assert.ok(addCandidateIndex >= 0)
  for (const guard of ['if (!canManagePlanner)', 'if (candidateManagementError)']) {
    const guardIndex = randomLineup.indexOf(guard)
    assert.ok(guardIndex >= 0 && guardIndex < addCandidateIndex)
  }
  assert.match(plannerPage, /disabled=\{!canManageCandidates\}/)
  assert.match(plannerPage, /votesError \? candidateManagementError/)
  assert.match(plannerPage, /onClick=\{\(\) => void handleCopyInviteLink\(\)\}/)
  assert.match(plannerFlow, /const placeIds = \[\.\.\.new Set\(selectedPlaces/)
  assert.match(plannerFlow, /placeIds\.length !== selectedPlaces\.length/)
  assert.match(plannerMutations, /useDeletePlannerMutation/)
  assert.match(plannerPage, /삭제할까요\?/)
  assert.match(travel, /tourPlaceId\?: number/)
  assert.match(session, /export type KakaoLoginRequestDto/)
  assert.match(session, /accessToken\?: string\s+code\?: string\s+redirectUri\?: string/)
  assert.match(session, /AUTH_API_PATHS\.session\.kakao/)
  assert.match(session, /apiClient\.post<string>\(AUTH_API_PATHS\.session\.logout, payload\)/)
  assert.match(session, /export type LogoutRequestDto/)
  assert.doesNotMatch(session, /password|signup|check-id|email|userPwd|SignUpRequest/)
  assert.match(paths, /kakaoCallback: '\/auth\/kakao\/callback'/)
  assert.doesNotMatch(paths, /changePassword/)
  assert.match(googleControl, /onSuccess=\{\(\{ credential \}\)/)
  assert.match(googleControl, /onLogin\(credential\)/)
  assert.match(kakaoControl, /beginKakaoLogin\(redirect\)/)
  assert.match(kakaoAuth, /window\.Kakao/)
  assert.match(kakaoAuth, /getRandomValues/)
  assert.match(kakaoAuth, /state/)
  assert.match(kakaoAuth, /getKakaoAuthRequest/)
  assert.match(kakaoAuth, /clearKakaoAuthRequest/)
  assert.match(kakaoCallback, /getKakaoAuthRequest/)
  assert.match(kakaoCallback, /callback\.state/)
  assert.match(kakaoCallback, /pendingRequest\.state/)
  assert.match(loginForm, /KakaoLoginControl/)
  assert.match(loginForm, /googleLogin\(\{ idToken \}\)/)
  assert.doesNotMatch(loginForm, /userId|userPwd|changePassword|비밀번호/)
  assert.match(signUp, /KakaoLoginControl/)
  assert.match(signUp, /googleLogin\(\{ idToken \}\)/)
  assert.doesNotMatch(signUp, /userId|userPwd|verification|checkUserId|signUp\(/)
  assert.doesNotMatch(signUp, /phoneNumber|myCountry|전화번호|거주 국가/)
  assert.match(profile, /isError: hasWorldMapError/)
  assert.match(profile, /isLoading: isWorldMapLoading/)
  assert.match(tripCard, /updateTravelCardEntryComment/)
  assert.match(tripCard, /comment\?: string\s+imageFile: File/)
})
