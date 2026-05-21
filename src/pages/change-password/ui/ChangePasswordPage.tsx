import { AuthForm } from '@shared/ui'
import { ChangePasswordForm } from '@widgets/change-password-form'

export function ChangePasswordPage() {
  return (
    <AuthForm.AuthPage className="page">
      <ChangePasswordForm />
    </AuthForm.AuthPage>
  )
}
