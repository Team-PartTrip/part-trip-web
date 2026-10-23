import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ThemeProvider } from 'styled-components'

import { routeTree } from './routeTree.gen'
import { AUTH_EXPIRED_EVENT } from '@/shared/libs/auth-expiration'
import { ACCESS_TOKEN_KEY, AUTH_SESSION_KEY, REFRESH_TOKEN_KEY } from '@/shared/libs/token-storage'
import { clearUserSessionStorage } from '@/shared/libs/session-storage'
import { shouldRetryQuery } from '@/shared/libs/query-retry'
import { GlobalStyle } from '@/shared/ui/global-style'
import { appTheme } from '@/shared/theme'

const router = createRouter({ routeTree })
const queryClient = new QueryClient({ defaultOptions: { queries: { retry: shouldRetryQuery } } })
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ''

window.addEventListener(AUTH_EXPIRED_EVENT, () => {
  queryClient.clear()
  void router.navigate({ replace: true, to: '/login', ignoreBlocker: true })
})

window.addEventListener('storage', (event) => {
  if (event.storageArea === window.localStorage && (
    event.key === AUTH_SESSION_KEY || event.key === null
    || ((event.key === ACCESS_TOKEN_KEY || event.key === REFRESH_TOKEN_KEY) && event.newValue === null)
  )) {
    // 계정이 바뀌면 이전 계정의 캐시와 편집 상태도 함께 폐기한다.
    clearUserSessionStorage()
    queryClient.clear()
    void router.navigate({ replace: true, to: '/login', ignoreBlocker: true })
  }
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <GoogleOAuthProvider clientId={googleClientId} locale="ko">
      <ThemeProvider theme={appTheme}>
        <GlobalStyle />
        <RouterProvider router={router} />
      </ThemeProvider>
    </GoogleOAuthProvider>
  </QueryClientProvider>,
)
