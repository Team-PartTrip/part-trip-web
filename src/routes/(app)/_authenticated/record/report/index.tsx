import { createFileRoute, redirect } from '@tanstack/react-router'
import { paths } from '@/shared/config'

export const Route = createFileRoute('/(app)/_authenticated/record/report/')({
  beforeLoad: () => { throw redirect({ to: paths.record }) },
})
