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
    '/src/widgets/planner/model/usePlannerGroupFlow.ts',
    '/src/widgets/planner/model/usePlannerLifecycleFlow.ts',
  ])
  const plannerMutations = read('/src/widgets/planner/model/usePlannerMutations.ts')
  const plannerPage = readSources([
    '/src/widgets/planner/ui/PlannerPage.tsx',
    '/src/widgets/planner/ui/PlannerAiFlow.tsx',
    '/src/widgets/planner/ui/PlannerListStep.tsx',
    '/src/widgets/planner/ui/PlannerGroupStep.tsx',
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

  assert.match(planner, /export async function generatePlanner\(/)
  assert.match(planner, /export async function getPlannerBlocks\(/)
  assert.match(planner, /export async function getPlannerSchedule\(/)
  assert.match(planner, /export async function confirmPlanner\(/)
  assert.match(planner, /export type GeneratePlannerRequestDto = \{[\s\S]*?cityName: string[\s\S]*?startDate: string[\s\S]*?endDate: string[\s\S]*?blocks: PlannerBlockDto\[\]/)
  assert.match(plannerFlow, /data\.plannerDetail\?\.role\?\.trim\(\)\.toUpperCase\(\) === 'OWNER'/)
  assert.match(plannerPage, /PlannerAiFlow step="destination"/)
  assert.match(plannerPage, /PlannerAiFlow step="criteria"/)
  assert.match(plannerPage, /PlannerAiFlow step="schedule"/)
  assert.match(plannerPage, /PlannerAiFlow step="invite"/)
  assert.doesNotMatch(planner, /\/votes|\/ballot|travel-plan/i)
  assert.doesNotMatch(plannerMutations, /Vote|Ballot|Candidate/)
  assert.equal(existsSync(`${projectRoot}/src/routes/(app)/_authenticated/planner/vote/index.tsx`), false)
  assert.equal(existsSync(`${projectRoot}/src/routes/(app)/_authenticated/planner/place/$placeId/index.tsx`), false)
  assert.match(travel, /export async function getTourPlace\(/)
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
