import type { ReactNode } from 'react'
import { ThemeProvider } from 'styled-components'

import { appTheme } from '../theme'

type AppProvidersProps = {
  children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
  return <ThemeProvider theme={appTheme}>{children}</ThemeProvider>
}
