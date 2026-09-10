import { NewPasswordView, PasswordVerificationView } from './ChangePasswordStepViews'
import { useChangePasswordFlow } from '../model/useChangePasswordFlow'

export function ChangePasswordForm() {
  const flow = useChangePasswordFlow()

  if (flow.step === 'verification') {
    return <PasswordVerificationView emailField={flow.emailField} isSendingCode={flow.isSendingCode} isSubmitting={flow.isVerificationSubmitting} message={flow.message} onSendCode={flow.onSendCode} onSubmit={flow.onVerificationSubmit} verificationCodeField={flow.verificationCodeField} />
  }

  return <NewPasswordView isSubmitting={flow.isPasswordSubmitting} message={flow.message} newPasswordConfirmField={flow.newPasswordConfirmField} newPasswordField={flow.newPasswordField} onBack={flow.onBack} onSubmit={flow.onPasswordSubmit} />
}
