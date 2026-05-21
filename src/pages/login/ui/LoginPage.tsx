import { AuthForm } from '@shared/ui'
import { LoginForm } from '@widgets/login-form'

export function LoginPage() {
  return (
    <AuthForm.AuthPage className="page">
      <LoginForm />
    </AuthForm.AuthPage>
  )
}
