import type { ReactNode } from 'react'
import { ThemeProvider } from 'styled-components'
import { OverlayProvider } from '@b1nd/dodam-design-system/components'
import { GoogleOAuthProvider } from '@react-oauth/google'

import { appTheme } from '../theme'

type AppProvidersProps = {
  children: ReactNode
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider theme={appTheme}>
        <OverlayProvider>{children}</OverlayProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  )
}
