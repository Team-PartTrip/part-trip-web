import { createFileRoute, redirect } from '@tanstack/react-router'
import { getAccessToken } from '@/entities/session/api'
import { LandingPage } from '@/widgets/landing'

export const Route = createFileRoute('/(home)/')({
  beforeLoad: () => {
    if (getAccessToken()) {
      throw redirect({ to: '/main' })
    }
  },
  component: LandingPage,
})
