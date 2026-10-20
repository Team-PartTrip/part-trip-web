import { createFileRoute, redirect } from '@tanstack/react-router'
import { paths } from '@/shared/config'

export const Route = createFileRoute('/(app)/_authenticated/settings/notifications/')({
  beforeLoad: () => { throw redirect({ to: paths.notifications, replace: true }) },
})
