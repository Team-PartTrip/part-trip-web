import { createFileRoute, redirect } from '@tanstack/react-router'
import { paths } from '@/shared/config'

export const Route = createFileRoute('/(app)/_authenticated/profile/claim/')({
  beforeLoad: () => { throw redirect({ to: paths.profileMap }) },
})
