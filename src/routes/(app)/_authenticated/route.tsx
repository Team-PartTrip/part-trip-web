import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { getAccessToken } from '@/entities/session/api'

export const Route = createFileRoute('/(app)/_authenticated')({
  beforeLoad: ({ location }) => {
    if (!getAccessToken()) {
      throw redirect({ search: { redirect: location.href }, to: '/login' })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return <Outlet />
}
