import { createBrowserRouter } from 'react-router-dom'
import { ChangePasswordPage } from '@pages/change-password'
import { HomePage } from '@pages/home'
import { LoginPage } from '@pages/login'
import { SignUpPage } from '@pages/sign-up'

import { paths } from './paths'

export const router = createBrowserRouter([
  {
    path: paths.home,
    element: <HomePage />,
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
])
