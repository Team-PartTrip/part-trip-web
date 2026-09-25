import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import test from 'node:test'
import { projectRoot, readSource as read, readSources } from './helpers.ts'

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
  const plannerAiFlow = read('/src/widgets/planner/ui/PlannerAiFlow.tsx')
  const plannerMutations = read('/src/widgets/planner/model/usePlannerMutations.ts')
  const scheduleEditor = readSources([
    '/src/widgets/planner/ui/PlannerScheduleEditor.tsx',
    '/src/widgets/planner/ui/PlannerPlacePicker.tsx',
  ])
  const plannerPage = readSources([
    '/src/widgets/planner/ui/PlannerPage.tsx',
    '/src/widgets/planner/ui/PlannerAiFlow.tsx',
    '/src/widgets/planner/ui/PlannerListStep.tsx',
    '/src/widgets/planner/ui/PlannerGroupStep.tsx',
  ])
  const session = read('/src/entities/session/api.ts')
  const googleControl = read('/src/shared/ui/auth-form/GoogleLoginControl.tsx')
  const kakaoControl = read('/src/shared/ui/auth-form/KakaoLoginControl.tsx')
  const kakaoAuth = read('/src/shared/libs/kakao-auth.ts')
  const kakaoCallback = read('/src/routes/(public)/auth/kakao/callback/index.tsx')
  const loginRoute = read('/src/routes/(public)/login/index.tsx')
  const signUpRoute = read('/src/routes/(public)/sign-up/index.tsx')
  const socialAuthForm = read('/src/features/social-auth/ui/SocialAuthForm.tsx')
  const paths = read('/src/shared/config/paths.ts')
  const travel = read('/src/entities/travel/api.ts')
  const travelQueries = read('/src/entities/travel/queries.ts')
  const locationApi = read('/src/entities/guardian/api.ts')
  const locationReporter = read('/src/widgets/location-reporter/ui/LocationReporter.tsx')
  const locationReporting = read('/src/widgets/location-reporter/model.ts')
  const calendar = read('/src/widgets/record-calendar/ui/RecordCalendarPage.tsx')
  const tripCard = read('/src/entities/trip-card/api.ts')

  assert.match(planner, /export async function generatePlanner\(/)
  assert.match(planner, /export async function getPlannerBlocks\(/)
  assert.match(planner, /export async function getPlannerSchedule\(/)
  assert.match(planner, /scheduleCandidates: \(plannerId: number\) => `\/planners\/\$\{plannerId\}\/schedule\/candidates`/)
  assert.match(planner, /apiClient\.get<PlannerScheduleCandidateDto\[]>\(PLANNER_API_PATHS\.scheduleCandidates\(plannerId\)/)
  assert.match(planner, /params: \{ date, q: query \|\| undefined \}/)
  assert.match(planner, /apiClient\.put<PlannerScheduleResponseDto>\(PLANNER_API_PATHS\.schedule\(plannerId\), payload\)/)
  assert.match(planner, /export async function confirmPlanner\(/)
  assert.match(planner, /export type GeneratePlannerRequestDto = \{[\s\S]*?cityName: string[\s\S]*?startDate: string[\s\S]*?endDate: string[\s\S]*?blocks: PlannerBlockDto\[\]/)
  assert.match(plannerFlow, /hasPlannerManagementRole\(data\.plannerDetail\?\.role\)/)
  assert.match(plannerAiFlow, /if \(!canManageCurrentPlanner \|\| !isPositiveSafeInteger\(plannerId\) \|\| !scheduleQuery\.data\) return/)
  assert.match(plannerAiFlow, /!isConfirmed && canManageCurrentPlanner/)
  assert.match(plannerAiFlow, /!isConfirmed && !canManageCurrentPlanner/)
  assert.match(plannerPage, /PlannerAiFlow step="destination"/)
  assert.match(plannerPage, /PlannerAiFlow step="criteria"/)
  assert.match(plannerPage, /PlannerAiFlow step="schedule"/)
  assert.match(plannerPage, /PlannerAiFlow step="invite"/)
  assert.doesNotMatch(planner, /\/votes|\/ballot|travel-plan/i)
  assert.doesNotMatch(plannerMutations, /Vote|Ballot|Candidate/)
  assert.match(scheduleEditor, /usePlannerScheduleCandidatesQuery/)
  assert.match(scheduleEditor, /useMoreTourPlacesQuery/)
  assert.match(scheduleEditor, /useSavePlannerScheduleMutation/)
  assert.match(locationApi, /currentLocation: '\/location'/)
  assert.match(locationApi, /apiClient\.put\(paths\.currentLocation, payload\)/)
  assert.match(locationReporting, /const geolocation = navigator\.geolocation/)
  assert.match(locationReporting, /geolocation\.getCurrentPosition/)
  assert.match(locationReporter, /trip\.data\?\.status !== 'DURING'/)
  assert.match(calendar, /useFestivalMonthQuery\(plan\?\.countryName, viewYear, viewMonthIndex \+ 1\)/)
  assert.match(travelQueries, /getNextPageParam: \(lastPage\) => lastPage\.cursor \|\| undefined/)
  assert.doesNotMatch(travel, /mock-data|requestWithMockFallback|mockTourPlaces|mockCountries/)
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
  assert.match(loginRoute, /SocialAuthForm mode="login"/)
  assert.match(signUpRoute, /SocialAuthForm mode="sign-up"/)
  assert.match(socialAuthForm, /KakaoLoginControl/)
  assert.match(socialAuthForm, /googleLogin\(\{ idToken \}\)/)
  assert.doesNotMatch(
    socialAuthForm,
    /userId|userPwd|changePassword|verification|checkUserId|signUp\(|phoneNumber|myCountry|비밀번호|전화번호|거주 국가/,
  )
  assert.match(tripCard, /updateTravelCardEntryComment/)
  assert.match(tripCard, /comment\?: string\s+imageFile: File/)
})
