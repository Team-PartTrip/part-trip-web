import { createRootRoute, Outlet } from '@tanstack/react-router'

import { RouteFallback } from '@/shared/ui/route-fallback'
import { NotFoundPage } from '@/shared/ui/not-found'

export const Route = createRootRoute({
  component: RootLayout,
  pendingComponent: RouteFallback,
  notFoundComponent: NotFoundPage,
  errorComponent: RouteError,
})

function RootLayout() {
  return <Outlet />
}

function RouteError({ error }: { error: unknown }) {
  return (
    <main role="alert">
      {error instanceof Error ? error.message : '화면을 불러오지 못했습니다.'}
    </main>
  )
}
