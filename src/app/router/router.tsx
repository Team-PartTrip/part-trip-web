import { createBrowserRouter } from 'react-router-dom'
import { ChangePasswordPage } from '@pages/change-password'
import { DiagnosisPage } from '@pages/diagnosis'
import { DiagnosisResultPage } from '@pages/diagnosis-result'
import { DemoSectionPage } from '@pages/demo-section'
import { LoginPage } from '@pages/login'
import { SignUpPage } from '@pages/sign-up'
import { MainPage } from '@pages/main'
import { ProfilePage } from '@pages/profile'
import { ProfileEditPage } from '@pages/profile-edit'
import { TravelSelectPage } from '@pages/travel-select'
import { NotFoundPage } from '@pages/not-found'

import { paths } from './paths'

export const router = createBrowserRouter([
  {
    path: paths.home,
    element: <MainPage />,
  },
  {
    path: paths.signUp,
    element: <SignUpPage />,
  },
  {
    path: paths.login,
    element: <LoginPage />,
  },
  {
    path: paths.changePassword,
    element: <ChangePasswordPage />,
  },
  {
    path: paths.diagnosis,
    element: <DiagnosisPage />,
  },
  {
    path: paths.diagnosisResult,
    element: <DiagnosisResultPage />,
  },
  {
    path: paths.main,
    element: <MainPage />,
  },
  {
    path: paths.profile,
    element: <ProfilePage />,
  },
  {
    path: paths.profileEdit,
    element: <ProfileEditPage />,
  },
  {
    path: paths.travelSelect,
    element: <TravelSelectPage />,
  },
  {
    path: paths.community,
    element: <DemoSectionPage title="커뮤니티" description="여행자들과 현지 정보와 경험을 나누는 공간입니다." items={['싱가포르 첫 여행 체크리스트', '호커 센터 추천 메뉴', '야경 명소 후기']} />,
  },
  {
    path: paths.record,
    element: <DemoSectionPage title="여행 기록" description="여행 중 남긴 순간과 일정을 한곳에서 확인합니다." items={['마리나 베이 산책', 'Day 1 사진 기록', '오늘의 여행 메모']} />,
  },
  {
    path: paths.mission,
    element: <DemoSectionPage title="여행 미션" description="현지 문화를 경험하며 완료할 수 있는 미션입니다." items={['현지 인사말 사용하기', '로컬 음식 맛보기', '오늘의 풍경 기록하기']} />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
