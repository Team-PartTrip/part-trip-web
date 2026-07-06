import type { ReactNode } from 'react'
import { ThemeProvider } from 'styled-components'
import { GoogleOAuthProvider } from '@react-oauth/google'

import { appTheme } from '../theme'

type AppProvidersProps = {
  children: ReactNode
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''

export function AppProviders({ children }: AppProvidersProps) {
  const app = <ThemeProvider theme={appTheme}>{children}</ThemeProvider>

  return <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>{app}</GoogleOAuthProvider>
}
