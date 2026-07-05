import { Suspense, type ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { paths } from './paths'
import { RouteFallback } from './RouteFallback'
import {
  ChangePasswordPage,
  CommunityDetailPage,
  CommunityPage,
  CommunityWritePage,
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
  { path: paths.community, element: withFallback(<CommunityPage />) },
  { path: paths.communityWrite, element: withFallback(<CommunityWritePage />) },
  { path: paths.communityDetail, element: withFallback(<CommunityDetailPage />) },
  { path: paths.record, element: withFallback(<RecordPage />) },
  { path: paths.mission, element: withFallback(<MissionPage />) },
  { path: '*', element: withFallback(<NotFoundPage />) },
])
