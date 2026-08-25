import { createFileRoute } from '@tanstack/react-router'
import { AuthForm } from '@/shared/ui'
import { SignUpForm } from '@/features/register'

export const Route = createFileRoute('/(public)/sign-up/')({ component: SignUpRoute })

function SignUpRoute() {
  return <AuthForm.AuthPage className="page"><SignUpForm /></AuthForm.AuthPage>
}
