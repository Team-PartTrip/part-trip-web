import { createFileRoute } from '@tanstack/react-router'
import { AuthForm } from '@/shared/ui'
import { ChangePasswordForm } from '@/features/fix-password'

export const Route = createFileRoute('/(public)/change-password/')({ component: ChangePasswordRoute })

function ChangePasswordRoute() {
  return <AuthForm.AuthPage className="page"><ChangePasswordForm /></AuthForm.AuthPage>
}
