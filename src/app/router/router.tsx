import { Suspense, type ReactNode } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import { paths } from './paths'
import { RequireAuth } from './RequireAuth'
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
  RecordDetailPage,
  RecordWritePage,
  SignUpPage,
  TravelSelectPage,
} from './lazyPages'

const withFallback = (element: ReactNode) => (
  <Suspense fallback={<RouteFallback />}>{element}</Suspense>
)

const requireAuth = (element: ReactNode) => withFallback(<RequireAuth>{element}</RequireAuth>)

export const router = createBrowserRouter([
  { path: paths.signUp, element: withFallback(<SignUpPage />) },
  { path: paths.login, element: withFallback(<LoginPage />) },
  { path: paths.changePassword, element: withFallback(<ChangePasswordPage />) },
  { path: paths.diagnosis, element: requireAuth(<DiagnosisPage />) },
  { path: paths.diagnosisResult, element: requireAuth(<DiagnosisResultPage />) },
  { path: paths.main, element: requireAuth(<MainPage />) },
  { path: paths.profile, element: requireAuth(<ProfilePage />) },
  { path: paths.profileEdit, element: requireAuth(<ProfileEditPage />) },
  { path: paths.travelSelect, element: requireAuth(<TravelSelectPage />) },
  { path: paths.community, element: requireAuth(<CommunityPage />) },
  { path: paths.communityWrite, element: requireAuth(<CommunityWritePage />) },
  { path: paths.communityDetail, element: requireAuth(<CommunityDetailPage />) },
  { path: paths.record, element: requireAuth(<RecordPage />) },
  { path: paths.recordWrite, element: requireAuth(<RecordWritePage />) },
  { path: paths.recordDetail, element: requireAuth(<RecordDetailPage />) },
  { path: paths.mission, element: requireAuth(<MissionPage />) },
  { path: '*', element: withFallback(<NotFoundPage />) },
])
