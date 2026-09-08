import { useState } from 'react'
import {
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'
import {
  resetPassword,
  sendPasswordResetCode,
  verifyPasswordResetCode,
} from '@/entities/session/api'
import { paths } from '@/shared/config'
import {
  emailPattern,
  getErrorMessage,
  getFirstErrorMessage,
  getPasswordValidationError,
  sanitizePassword,
  trimFormValue,
  verificationCodeRules,
} from '@/shared/utils'
import { NewPasswordView, PasswordVerificationView } from './ChangePasswordStepViews'

type ChangePasswordStep = 'verification' | 'password'

type ResetPasswordContext = {
  resetToken: string
}

type FormMessage = {
  text: string
  tone: 'error' | 'success'
}

type VerificationFormValues = {
  email: string
  verificationCode: string
}

type PasswordFormValues = {
  newPassword: string
  newPasswordConfirm: string
}

export function ChangePasswordForm() {
  const navigate = useNavigate()
  const [step, setStep] = useState<ChangePasswordStep>('verification')
  const [resetContext, setResetContext] = useState<ResetPasswordContext | null>(null)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [message, setMessage] = useState<FormMessage | null>(null)

  const verificationForm = useForm<VerificationFormValues>({
    defaultValues: { email: '', verificationCode: '' },
  })
  const passwordForm = useForm<PasswordFormValues>({
    defaultValues: { newPassword: '', newPasswordConfirm: '' },
  })

  const emailField = verificationForm.register('email', {
    required: '가입한 이메일을 입력해주세요.',
    setValueAs: trimFormValue,
    validate: (value) => emailPattern.test(value) || '가입한 이메일을 입력해주세요.',
  })
  const verificationCodeField = verificationForm.register('verificationCode', verificationCodeRules)
  const newPasswordField = passwordForm.register('newPassword', {
    required: '새 비밀번호를 입력해주세요.',
    setValueAs: (value) => sanitizePassword(trimFormValue(value)),
    validate: (value) => getPasswordValidationError(value) ?? true,
  })
  const newPasswordConfirmField = passwordForm.register('newPasswordConfirm', {
    required: '새 비밀번호 확인을 입력해주세요.',
    setValueAs: (value) => sanitizePassword(trimFormValue(value)),
    validate: (value, values) => value === values.newPassword || '새 비밀번호가 일치하지 않습니다.',
  })

  const handleSendVerificationCode = async () => {
    const valid = await verificationForm.trigger('email')
    const email = trimFormValue(verificationForm.getValues('email'))
    if (!valid || !email) {
      setMessage({ text: verificationForm.getFieldState('email').error?.message ?? '가입한 이메일을 입력해주세요.', tone: 'error' })
      return
    }

    try {
      setIsSendingCode(true)
      await sendPasswordResetCode({ email })
      setMessage({ text: '인증번호를 발송했습니다.', tone: 'success' })
    } catch (error) {
      setMessage({ text: getErrorMessage(error), tone: 'error' })
    } finally {
      setIsSendingCode(false)
    }
  }

  const handleVerificationSubmit: SubmitHandler<VerificationFormValues> = async ({ email, verificationCode }) => {
    try {
      const { resetToken } = await verifyPasswordResetCode({ email, code: verificationCode })
      if (!resetToken.trim()) throw new Error('비밀번호 재설정 토큰을 받지 못했습니다.')
      setResetContext({ resetToken })
      setMessage(null)
      setStep('password')
    } catch (error) {
      setMessage({ text: getErrorMessage(error), tone: 'error' })
    }
  }

  const handleVerificationInvalid: SubmitErrorHandler<VerificationFormValues> = (errors) => {
    setMessage({ text: getFirstErrorMessage(errors), tone: 'error' })
  }

  const handlePasswordSubmit: SubmitHandler<PasswordFormValues> = async ({ newPassword, newPasswordConfirm }) => {
    if (!resetContext) {
      setMessage({ text: '본인 인증을 다시 진행해주세요.', tone: 'error' })
      setStep('verification')
      return
    }
    if (newPassword !== newPasswordConfirm) {
      setMessage({ text: '새 비밀번호가 일치하지 않습니다.', tone: 'error' })
      return
    }

    try {
      await resetPassword({ ...resetContext, newPassword })
      navigate({ to: paths.login, replace: true })
    } catch (error) {
      setMessage({ text: getErrorMessage(error), tone: 'error' })
    }
  }

  const handlePasswordInvalid: SubmitErrorHandler<PasswordFormValues> = (errors) => {
    setMessage({ text: getFirstErrorMessage(errors), tone: 'error' })
  }

  const isVerificationSubmitting = verificationForm.formState.isSubmitting
  const isPasswordSubmitting = passwordForm.formState.isSubmitting

  if (step === 'verification') {
    return <PasswordVerificationView emailField={emailField} isSendingCode={isSendingCode} isSubmitting={isVerificationSubmitting} message={message} onSendCode={() => void handleSendVerificationCode()} onSubmit={verificationForm.handleSubmit(handleVerificationSubmit, handleVerificationInvalid)} verificationCodeField={verificationCodeField} />
  }

  return <NewPasswordView isSubmitting={isPasswordSubmitting} message={message} newPasswordConfirmField={newPasswordConfirmField} newPasswordField={newPasswordField} onBack={() => navigate({ to: paths.login })} onSubmit={passwordForm.handleSubmit(handlePasswordSubmit, handlePasswordInvalid)} />
}
