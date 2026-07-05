import type { ReactNode } from 'react'
import { ThemeProvider } from 'styled-components'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { runtimeConfig } from '@shared/config'

import { appTheme } from '../theme'

type AppProvidersProps = {
  children: ReactNode
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''

export function AppProviders({ children }: AppProvidersProps) {
  const app = <ThemeProvider theme={appTheme}>{children}</ThemeProvider>

  if (runtimeConfig.useMockApi) {
    return app
  }

  return <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>{app}</GoogleOAuthProvider>
}
