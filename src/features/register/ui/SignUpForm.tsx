import { useSignUpFlow } from '../model/useSignUpFlow'
import { SignUpCredentialsView, SignUpVerificationView } from './SignUpStepViews'

type SignUpFormProps = {
  redirect?: string
}

export function SignUpForm({ redirect }: SignUpFormProps) {
  const flow = useSignUpFlow(redirect)

  if (flow.step === 'verification') {
    return <SignUpVerificationView emailField={flow.emailField} isSendingCode={flow.isSendingCode} isSubmitting={flow.isSubmitting} message={flow.message} onSendCode={flow.onSendCode} onSubmit={flow.onVerificationSubmit} verificationCodeField={flow.verificationCodeField} />
  }

  return <SignUpCredentialsView checkedId={flow.checkedId} idField={flow.idField} isBusy={flow.isBusy} isCheckingId={flow.isCheckingId} isUserIdAvailable={flow.isUserIdAvailable} message={flow.message} onCheckId={flow.onCheckId} onIdChange={flow.onIdChange} onSubmit={flow.onSubmit} passwordConfirmField={flow.passwordConfirmField} passwordField={flow.passwordField} />
}
