import type { ReactNode } from 'react'
import { ThemeProvider } from 'styled-components'
import { OverlayProvider } from '@b1nd/dodam-design-system/components'

import { appTheme } from '../theme'

type AppProvidersProps = {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider theme={appTheme}>
      <OverlayProvider>
        {children}
      </OverlayProvider>
    </ThemeProvider>
  )
}