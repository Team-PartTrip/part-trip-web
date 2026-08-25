import { createFileRoute } from '@tanstack/react-router'
import { AuthForm } from '@/shared/ui'
import { LoginForm } from '@/features/login'

export const Route = createFileRoute('/(public)/login/')({ component: LoginRoute })

function LoginRoute() {
  return <AuthForm.AuthPage className="page"><LoginForm /></AuthForm.AuthPage>
}
