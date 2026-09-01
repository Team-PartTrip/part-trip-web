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
import { partTripLogoUrl } from '@/shared/assets'
import { paths } from '@/shared/config'
import {
  authValidationRules,
  createSanitizedChangeHandler,
  emailPattern,
  getErrorMessage,
  getFirstErrorMessage,
  getPasswordValidationError,
  sanitizePassword,
  trimFormValue,
  verificationCodeRules,
} from '@/shared/utils'
import { AuthForm as S } from '@/shared/ui'

type ChangePasswordStep = 'verification' | 'password'

type ResetPasswordContext = {
  email: string
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
      await verifyPasswordResetCode({ email, code: verificationCode })
      setResetContext({ email })
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
      await resetPassword({ ...resetContext, confirmPassword: newPasswordConfirm, newPassword })
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
    return (
      <S.Container>
        <S.Header>
          <S.Brand><img src={partTripLogoUrl} alt="PartTrip" /></S.Brand>
          <S.Title>비밀번호 찾기</S.Title>
        </S.Header>
        <S.Body>
          <S.Form aria-label="비밀번호 찾기 본인 인증" method="post" noValidate onSubmit={verificationForm.handleSubmit(handleVerificationSubmit, handleVerificationInvalid)}>
            <S.Field>
              <S.InlineVerificationRow>
                <S.Input {...emailField} aria-label="가입한 이메일" type="email" autoComplete="email" placeholder="이메일을 입력하세요" disabled={isVerificationSubmitting || isSendingCode} required />
                <S.CodeSendButton type="button" disabled={isVerificationSubmitting || isSendingCode} onClick={() => void handleSendVerificationCode()}>{isSendingCode ? '발송 중' : '인증 요청'}</S.CodeSendButton>
              </S.InlineVerificationRow>
            </S.Field>
            <S.Field>
              <S.Input {...verificationCodeField} aria-label="인증번호" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="인증번호를 입력하세요" disabled={isVerificationSubmitting} required />
              <S.FieldHint>인증번호 6자리</S.FieldHint>
            </S.Field>
            {message ? <S.Message $tone={message.tone} aria-live="polite">{message.text}</S.Message> : null}
            <S.Actions>
              <S.PrimaryButton type="submit" disabled={isVerificationSubmitting}>{isVerificationSubmitting ? '확인 중' : '다음'}</S.PrimaryButton>
            </S.Actions>
          </S.Form>
        </S.Body>
      </S.Container>
    )
  }

  return (
    <S.Container>
      <S.Header>
        <S.Brand><img src={partTripLogoUrl} alt="PartTrip" /></S.Brand>
        <S.Title>비밀번호 찾기</S.Title>
        <S.Subtitle>이메일 인증이 완료되었습니다. 새 비밀번호를 입력하세요.</S.Subtitle>
      </S.Header>
      <S.Body>
        <S.Form aria-label="새 비밀번호 설정" method="post" noValidate onSubmit={passwordForm.handleSubmit(handlePasswordSubmit, handlePasswordInvalid)}>
          <S.Field>
            <S.Input {...newPasswordField} aria-label="새 비밀번호" type="password" autoComplete="new-password" placeholder="새 비밀번호" minLength={authValidationRules.password.minLength} maxLength={authValidationRules.password.maxLength} pattern={authValidationRules.password.pattern} title="비밀번호는 영문, 숫자, 특수문자 중 2종 이상을 포함해주세요." onChange={createSanitizedChangeHandler(newPasswordField, sanitizePassword)} disabled={isPasswordSubmitting} required />
            <S.FieldHint>8~64자 · 영문 / 숫자 / 특수문자 중 2종 이상</S.FieldHint>
          </S.Field>
          <S.Field>
            <S.Input {...newPasswordConfirmField} aria-label="새 비밀번호 확인" type="password" autoComplete="new-password" placeholder="새 비밀번호 확인" minLength={authValidationRules.password.minLength} maxLength={authValidationRules.password.maxLength} pattern={authValidationRules.password.pattern} title="비밀번호는 영문, 숫자, 특수문자 중 2종 이상을 포함해주세요." onChange={createSanitizedChangeHandler(newPasswordConfirmField, sanitizePassword)} disabled={isPasswordSubmitting} required />
          </S.Field>
          {message ? <S.Message $tone={message.tone} aria-live="polite">{message.text}</S.Message> : null}
          <S.Actions>
            <S.PrimaryButton type="submit" disabled={isPasswordSubmitting}>{isPasswordSubmitting ? '변경 중' : '비밀번호 변경'}</S.PrimaryButton>
            <S.OutlineButton type="button" onClick={() => navigate({ to: paths.login })}>로그인으로 돌아가기</S.OutlineButton>
          </S.Actions>
        </S.Form>
      </S.Body>
    </S.Container>
  )
}
