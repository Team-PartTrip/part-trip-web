import { type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { getAccessToken } from '@shared/api'

import { paths } from './paths'

export function RequireAuth({ children }: { children: ReactNode }) {
  const location = useLocation()

  if (!getAccessToken()) {
    return <Navigate to={paths.login} replace state={{ from: location }} />
  }

  return children
}
