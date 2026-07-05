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
  MissionPage,
  NotFoundPage,
  ProfileEditPage,
  ProfilePage,
  RecordPage,
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
  { path: paths.record, element: withFallback(<RecordPage />) },
  { path: paths.mission, element: withFallback(<MissionPage />) },
  { path: '*', element: withFallback(<NotFoundPage />) },
])
