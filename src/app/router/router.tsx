import { createBrowserRouter } from 'react-router-dom'
import { ChangePasswordPage } from '@pages/change-password'
import { DiagnosisPage } from '@pages/diagnosis'
import { LoginPage } from '@pages/login'
import { SignUpPage } from '@pages/sign-up'
import { MainPage } from '@pages/main'

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
    path: paths.main,
    element: <MainPage />,
  },
])
