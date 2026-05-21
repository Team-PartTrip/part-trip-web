import { AuthForm } from '@shared/ui'
import { SignUpForm } from '@widgets/sign-up-form'

export function SignUpPage() {
  return (
    <AuthForm.AuthPage className="page">
      <SignUpForm />
    </AuthForm.AuthPage>
  )
}
