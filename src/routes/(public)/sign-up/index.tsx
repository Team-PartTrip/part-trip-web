import { createFileRoute } from '@tanstack/react-router'
import { AuthForm } from '@/shared/ui'
import { SocialAuthForm } from '@/features/social-auth'
import { validateAuthSearch } from '@/shared/utils'

export const Route = createFileRoute('/(public)/sign-up/')({
  validateSearch: validateAuthSearch,
  component: SignUpRoute,
})

function SignUpRoute() {
  const { redirect } = Route.useSearch()
  return <AuthForm.AuthPage className="page"><SocialAuthForm mode="sign-up" redirect={redirect} /></AuthForm.AuthPage>
}
