import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ThemeProvider } from 'styled-components'

import { routeTree } from './routeTree.gen'
import { GlobalStyle } from '@/shared/ui/global-style'
import { appTheme } from '@/shared/theme'

const router = createRouter({ routeTree })
const queryClient = new QueryClient()
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <GoogleOAuthProvider clientId={googleClientId}>
      <ThemeProvider theme={appTheme}>
        <GlobalStyle />
        <RouterProvider router={router} />
      </ThemeProvider>
    </GoogleOAuthProvider>
  </QueryClientProvider>,
)
