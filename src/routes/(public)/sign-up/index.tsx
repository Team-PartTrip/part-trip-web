import { createFileRoute } from '@tanstack/react-router'
import { AuthForm } from '@/shared/ui'
import { SignUpForm } from '@/features/register'
import { validateAuthSearch } from '@/shared/utils'

export const Route = createFileRoute('/(public)/sign-up/')({
  validateSearch: validateAuthSearch,
  component: SignUpRoute,
})

function SignUpRoute() {
  const { redirect } = Route.useSearch()
  return <AuthForm.AuthPage className="page"><SignUpForm redirect={redirect} /></AuthForm.AuthPage>
}
