import { Suspense, type ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { paths } from './paths'
import { RouteFallback } from './RouteFallback'
import {
  ChangePasswordPage,
  DemoSectionPage,
  DiagnosisPage,
  DiagnosisResultPage,
  LoginPage,
  MainPage,
  NotFoundPage,
  ProfileEditPage,
  ProfilePage,
  SignUpPage,
  TravelSelectPage,
} from './lazyPages'

const withFallback = (element: ReactNode) => (
  <Suspense fallback={<RouteFallback />}>{element}</Suspense>
)

export const router = createBrowserRouter([
  { path: paths.home, element: withFallback(<MainPage />) },
  { path: paths.signUp, element: withFallback(<SignUpPage />) },
  { path: paths.login, element: withFallback(<LoginPage />) },
  { path: paths.changePassword, element: withFallback(<ChangePasswordPage />) },
  { path: paths.diagnosis, element: withFallback(<DiagnosisPage />) },
  { path: paths.diagnosisResult, element: withFallback(<DiagnosisResultPage />) },
  { path: paths.main, element: withFallback(<MainPage />) },
  { path: paths.profile, element: withFallback(<ProfilePage />) },
  { path: paths.profileEdit, element: withFallback(<ProfileEditPage />) },
  { path: paths.travelSelect, element: withFallback(<TravelSelectPage />) },
  {
    path: paths.community,
    element: withFallback(<DemoSectionPage title="커뮤니티" description="여행자들과 현지 정보와 경험을 나누는 공간입니다." items={['싱가포르 첫 여행 체크리스트', '호커 센터 추천 메뉴', '야경 명소 후기']} />),
  },
  {
    path: paths.record,
    element: withFallback(<DemoSectionPage title="여행 기록" description="여행 중 남긴 순간과 일정을 한곳에서 확인합니다." items={['마리나 베이 산책', 'Day 1 사진 기록', '오늘의 여행 메모']} />),
  },
  {
    path: paths.mission,
    element: withFallback(<DemoSectionPage title="여행 미션" description="현지 문화를 경험하며 완료할 수 있는 미션입니다." items={['현지 인사말 사용하기', '로컬 음식 맛보기', '오늘의 풍경 기록하기']} />),
  },
  { path: '*', element: withFallback(<NotFoundPage />) },
])
