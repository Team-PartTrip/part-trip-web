import { useState, type ChangeEvent } from 'react'
import {
  useForm,
  type FieldErrors,
  type FieldValues,
  type SubmitErrorHandler,
  type SubmitHandler,
  type UseFormRegisterReturn,
} from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import {
  resetPassword,
  sendPasswordResetCode,
  verifyPasswordResetCode,
} from '@shared/api'
import logoUrl from '@shared/assets/logo.svg'
import { paths } from '@shared/config'
import {
  authValidationRules,
  getErrorMessage,
  getPasswordValidationError,
  sanitizePassword,
} from '@shared/lib'
import { AuthForm as S } from '@shared/ui'

type ChangePasswordStep = 'email' | 'verification' | 'password'

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

const trimFormValue = (value: unknown) =>
  typeof value === 'string' ? value.trim() : ''

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const getFirstErrorMessage = <TFormValues extends FieldValues>(
  errors: FieldErrors<TFormValues>,
) => {
  const firstError = Object.values(errors)[0]

  if (
    firstError &&
    typeof firstError === 'object' &&
    'message' in firstError &&
    typeof firstError.message === 'string'
  ) {
    return firstError.message
  }

  return '입력값을 확인해주세요.'
}

const createSanitizedChangeHandler =
  (
    registration: UseFormRegisterReturn,
    sanitize: (value: string) => string,
  ) =>
  (event: ChangeEvent<HTMLInputElement>) => {
    event.currentTarget.value = sanitize(event.currentTarget.value)
    void registration.onChange(event)
  }

export function ChangePasswordForm() {
  const navigate = useNavigate()
  const [step, setStep] = useState<ChangePasswordStep>('email')
  const [resetContext, setResetContext] =
    useState<ResetPasswordContext | null>(null)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [message, setMessage] = useState<FormMessage | null>(null)

  const verificationForm = useForm<VerificationFormValues>({
    defaultValues: {
      email: '',
      verificationCode: '',
    },
  })
  const passwordForm = useForm<PasswordFormValues>({
    defaultValues: {
      newPassword: '',
      newPasswordConfirm: '',
    },
  })

  const emailField = verificationForm.register('email', {
    required: '이메일을 입력해주세요.',
    setValueAs: trimFormValue,
    validate: (value) =>
      emailPattern.test(value) || '올바른 이메일을 입력해주세요.',
  })
  const verificationCodeField = verificationForm.register('verificationCode', {
    required: '인증코드를 입력해주세요.',
    minLength: {
      value: 6,
      message: '인증코드는 6자리로 입력해주세요.',
    },
    pattern: {
      value: /^\d{6}$/,
      message: '인증코드는 숫자 6자리로 입력해주세요.',
    },
    setValueAs: trimFormValue,
  })
  const newPasswordField = passwordForm.register('newPassword', {
    required: '새 비밀번호를 입력해주세요.',
    setValueAs: (value) => sanitizePassword(trimFormValue(value)),
    validate: (value) => getPasswordValidationError(value) ?? true,
  })
  const newPasswordConfirmField = passwordForm.register('newPasswordConfirm', {
    required: '새 비밀번호 확인을 입력해주세요.',
    setValueAs: (value) => sanitizePassword(trimFormValue(value)),
    validate: (value, values) =>
      value === values.newPassword || '새 비밀번호가 일치하지 않습니다.',
  })

  const handleSendVerificationCode = async () => {
    const isEmailValid = await verificationForm.trigger('email')
    const email = trimFormValue(verificationForm.getValues('email'))

    if (!isEmailValid || !email) {
      setMessage({
        text:
          verificationForm.getFieldState('email').error?.message ??
          '이메일을 입력해주세요.',
        tone: 'error',
      })
      return
    }

    try {
      setIsSendingCode(true)
      await sendPasswordResetCode({
        email,
      })
      verificationForm.resetField('verificationCode')
      setMessage(null)
      setStep('verification')
    } catch (error) {
      setMessage({
        text: getErrorMessage(error),
        tone: 'error',
      })
    } finally {
      setIsSendingCode(false)
    }
  }

  const handleVerificationSubmit: SubmitHandler<VerificationFormValues> = async ({
    email,
    verificationCode,
  }) => {
    try {
      await verifyPasswordResetCode({
        email,
        code: verificationCode,
      })
      setResetContext({
        email,
      })
      setMessage(null)
      setStep('password')
    } catch (error) {
      setMessage({
        text: getErrorMessage(error),
        tone: 'error',
      })
    }
  }

  const handleVerificationInvalid: SubmitErrorHandler<VerificationFormValues> = (
    errors,
  ) => {
    setMessage({
      text: getFirstErrorMessage(errors),
      tone: 'error',
    })
  }

  const handlePasswordSubmit: SubmitHandler<PasswordFormValues> = async ({
    newPassword,
    newPasswordConfirm,
  }) => {
    if (!resetContext) {
      setMessage({
        text: '인증을 다시 진행해주세요.',
        tone: 'error',
      })
      setStep('email')
      return
    }

    if (newPassword !== newPasswordConfirm) {
      setMessage({
        text: '새 비밀번호가 일치하지 않습니다.',
        tone: 'error',
      })
      return
    }

    try {
      await resetPassword({
        ...resetContext,
        confirmPassword: newPasswordConfirm,
        newPassword,
      })
      navigate(paths.login, { replace: true })
    } catch (error) {
      setMessage({
        text: getErrorMessage(error),
        tone: 'error',
      })
    }
  }

  const handlePasswordInvalid: SubmitErrorHandler<PasswordFormValues> = (
    errors,
  ) => {
    setMessage({
      text: getFirstErrorMessage(errors),
      tone: 'error',
    })
  }

  const isVerificationSubmitting = verificationForm.formState.isSubmitting
  const isPasswordSubmitting = passwordForm.formState.isSubmitting
  const email = verificationForm.getValues('email')

  return (
    <S.Container>
      <S.Header>
        <S.Logo src={logoUrl} alt="PartTrip" />
        <S.Title>비밀번호 찾기</S.Title>
      </S.Header>

      <S.Body>
        {step === 'email' ? (
          <S.Form
            key="change-password-email"
            aria-label="비밀번호 찾기 이메일 인증 요청"
            method="post"
            noValidate
            onSubmit={(event) => {
              event.preventDefault()
              void handleSendVerificationCode()
            }}
          >
            <S.VerificationField>
              <S.Input
                {...emailField}
                $compact
                aria-label="이메일"
                type="email"
                autoComplete="email"
                placeholder="이메일을 입력하세요."
                disabled={isVerificationSubmitting || isSendingCode}
                required
              />
              <S.CodeSendButton
                type="button"
                disabled={isVerificationSubmitting || isSendingCode}
                onClick={handleSendVerificationCode}
              >
                {isSendingCode ? '발송 중' : '인증코드 보내기'}
              </S.CodeSendButton>
            </S.VerificationField>

            {message ? (
              <S.Message $tone={message.tone} aria-live="polite">
                {message.text}
              </S.Message>
            ) : null}

            <S.Actions>
              <S.SecondaryButton to={paths.login}>로그인 하기</S.SecondaryButton>
            </S.Actions>
          </S.Form>
        ) : step === 'verification' ? (
          <S.VerificationPanel>
            <S.VerificationIllustration aria-hidden>
              <S.EnvelopeIcon>
                <span>•••••</span>
                <strong>✓</strong>
              </S.EnvelopeIcon>
            </S.VerificationIllustration>

            <S.VerificationContent>
              <S.VerificationTitle>Verify email</S.VerificationTitle>
              <S.VerificationDescription>
                A verification code has been sent to
                <br />
                <strong>{email}</strong>.
                <br />
                Please enter the code to continue.
              </S.VerificationDescription>

              <S.Form
                key="change-password-verification"
                aria-label="비밀번호 찾기 인증"
                method="post"
                noValidate
                onSubmit={verificationForm.handleSubmit(
                  handleVerificationSubmit,
                  handleVerificationInvalid,
                )}
              >
                <S.CodeInput
                  {...verificationCodeField}
                  aria-label="인증코드"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="000000"
                  disabled={isVerificationSubmitting}
                  required
                />

                {message ? (
                  <S.Message $tone={message.tone} aria-live="polite">
                    {message.text}
                  </S.Message>
                ) : null}

                <S.VerificationActions>
                  <S.BackButton
                    type="button"
                    onClick={() => {
                      setMessage(null)
                      setStep('email')
                    }}
                  >
                    BACK
                  </S.BackButton>
                  <S.PrimaryButton
                    type="submit"
                    disabled={isVerificationSubmitting}
                  >
                    {isVerificationSubmitting ? '확인 중' : 'SUBMIT'}
                  </S.PrimaryButton>
                </S.VerificationActions>
              </S.Form>
            </S.VerificationContent>
          </S.VerificationPanel>
        ) : (
          <S.Form
            key="change-password-password"
            aria-label="비밀번호 변경"
            method="post"
            noValidate
            onSubmit={passwordForm.handleSubmit(
              handlePasswordSubmit,
              handlePasswordInvalid,
            )}
          >
            <S.Input
              {...newPasswordField}
              aria-label="새 비밀번호"
              type="password"
              autoComplete="new-password"
              placeholder="새 비밀번호를 입력하세요"
              minLength={authValidationRules.password.minLength}
              maxLength={authValidationRules.password.maxLength}
              pattern={authValidationRules.password.pattern}
              title={`비밀번호는 영문, 숫자, 특수문자(${authValidationRules.password.allowedSpecialCharacters})만 입력해주세요.`}
              onChange={createSanitizedChangeHandler(
                newPasswordField,
                sanitizePassword,
              )}
              disabled={isPasswordSubmitting}
              required
            />

            <S.Input
              {...newPasswordConfirmField}
              aria-label="새 비밀번호 확인"
              type="password"
              autoComplete="new-password"
              placeholder="새 비밀번호를 다시 입력하세요"
              minLength={authValidationRules.password.minLength}
              maxLength={authValidationRules.password.maxLength}
              pattern={authValidationRules.password.pattern}
              title={`비밀번호는 영문, 숫자, 특수문자(${authValidationRules.password.allowedSpecialCharacters})만 입력해주세요.`}
              onChange={createSanitizedChangeHandler(
                newPasswordConfirmField,
                sanitizePassword,
              )}
              disabled={isPasswordSubmitting}
              required
            />

            {message ? (
              <S.Message $tone={message.tone} aria-live="polite">
                {message.text}
              </S.Message>
            ) : null}

            <S.Actions>
              <S.PrimaryButton type="submit" disabled={isPasswordSubmitting}>
                {isPasswordSubmitting ? '변경 중' : '비밀번호 변경'}
              </S.PrimaryButton>
            </S.Actions>
          </S.Form>
        )}
      </S.Body>
    </S.Container>
  )
}
