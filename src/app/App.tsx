import { RouterProvider } from 'react-router-dom'

import { AppProviders } from './providers'
import { router } from './router'
import { GlobalStyle } from './styles'

export function App() {
  return (
    <AppProviders>
      <GlobalStyle />
      <RouterProvider router={router} />
    </AppProviders>
  )
}
