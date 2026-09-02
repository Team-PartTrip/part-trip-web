import { createFileRoute } from '@tanstack/react-router'
import { AuthForm } from '@/shared/ui'
import { LoginForm } from '@/features/login'
import { validateAuthSearch } from '@/shared/utils'

export const Route = createFileRoute('/(public)/login/')({
  validateSearch: validateAuthSearch,
  component: LoginRoute,
})

function LoginRoute() {
  const { redirect } = Route.useSearch()
  return <AuthForm.AuthPage className="page"><LoginForm redirect={redirect} /></AuthForm.AuthPage>
}
