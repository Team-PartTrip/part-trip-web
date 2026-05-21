import { useState, type FormEvent, type MouseEvent } from 'react'
import { resetPassword, sendVerificationCode, verifyCode } from '@shared/api'
import logoUrl from '@shared/assets/logo.svg'
import { paths } from '@shared/config'
import { AuthForm as S } from '@shared/ui'

type ChangePasswordStep = 'verification' | 'password'

type ResetPasswordContext = {
  code: string
  email: string
}

type FormMessage = {
  text: string
  tone: 'error' | 'success'
}

const getFormValue = (formData: FormData, key: string) => {
  const value = formData.get(key)
  return typeof value === 'string' ? value.trim() : ''
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message
  }

  return '요청 처리 중 오류가 발생했습니다.'
}

export function ChangePasswordForm() {
  const [step, setStep] = useState<ChangePasswordStep>('verification')
  const [resetContext, setResetContext] =
    useState<ResetPasswordContext | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [message, setMessage] = useState<FormMessage | null>(null)

  const handleSendVerificationCode = async (
    event: MouseEvent<HTMLButtonElement>,
  ) => {
    const form = event.currentTarget.form

    if (!form) {
      return
    }

    const email = getFormValue(new FormData(form), 'email')

    if (!email) {
      setMessage({
        text: '이메일을 입력해주세요.',
        tone: 'error',
      })
      return
    }

    try {
      setIsSendingCode(true)
      await sendVerificationCode({
        email,
        purpose: 'change-password',
      })
      setMessage({
        text: '인증코드를 발송했습니다.',
        tone: 'success',
      })
    } catch (error) {
      setMessage({
        text: getErrorMessage(error),
        tone: 'error',
      })
    } finally {
      setIsSendingCode(false)
    }
  }

  const handleVerificationSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const email = getFormValue(formData, 'email')
    const code = getFormValue(formData, 'verificationCode')

    try {
      setIsSubmitting(true)
      await verifyCode({
        code,
        email,
        purpose: 'change-password',
      })
      setResetContext({
        code,
        email,
      })
      setMessage(null)
      setStep('password')
    } catch (error) {
      setMessage({
        text: getErrorMessage(error),
        tone: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!resetContext) {
      setMessage({
        text: '인증을 다시 진행해주세요.',
        tone: 'error',
      })
      setStep('verification')
      return
    }

    const formData = new FormData(event.currentTarget)
    const newPassword = getFormValue(formData, 'newPassword')
    const newPasswordConfirm = getFormValue(formData, 'newPasswordConfirm')

    if (newPassword !== newPasswordConfirm) {
      setMessage({
        text: '새 비밀번호가 일치하지 않습니다.',
        tone: 'error',
      })
      return
    }

    try {
      setIsSubmitting(true)
      await resetPassword({
        ...resetContext,
        newPassword,
      })
      setMessage({
        text: '비밀번호 변경 요청이 완료되었습니다.',
        tone: 'success',
      })
    } catch (error) {
      setMessage({
        text: getErrorMessage(error),
        tone: 'error',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <S.Container>
      <S.Header>
        <S.Logo src={logoUrl} alt="PartTrip" />
        <S.Title>비밀번호 찾기</S.Title>
      </S.Header>

      <S.Body>
        {step === 'verification' ? (
          <S.Form
            key="change-password-verification"
            aria-label="비밀번호 찾기 인증"
            onSubmit={handleVerificationSubmit}
          >
            <S.VerificationField>
              <S.Input
                $compact
                aria-label="이메일"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="이메일을 입력하세요."
                disabled={isSubmitting || isSendingCode}
                required
              />
              <S.CodeSendButton
                type="button"
                disabled={isSubmitting || isSendingCode}
                onClick={handleSendVerificationCode}
              >
                {isSendingCode ? '발송 중' : '인증코드 보내기'}
              </S.CodeSendButton>
            </S.VerificationField>

            <S.Input
              $compact
              aria-label="인증코드"
              name="verificationCode"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="인증코드를 입력하세요."
              disabled={isSubmitting}
              required
            />

            {message ? (
              <S.Message $tone={message.tone} aria-live="polite">
                {message.text}
              </S.Message>
            ) : null}

            <S.Actions>
              <S.PrimaryButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? '확인 중' : '다음'}
              </S.PrimaryButton>
              <S.SecondaryButton to={paths.login}>로그인 하기</S.SecondaryButton>
            </S.Actions>
          </S.Form>
        ) : (
          <S.Form
            key="change-password-password"
            aria-label="비밀번호 변경"
            onSubmit={handlePasswordSubmit}
          >
            <S.Input
              aria-label="새 비밀번호"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              placeholder="새 비밀번호를 입력하세요"
              disabled={isSubmitting}
              required
            />

            <S.Input
              aria-label="새 비밀번호 확인"
              name="newPasswordConfirm"
              type="password"
              autoComplete="new-password"
              placeholder="새 비밀번호를 다시 입력하세요"
              disabled={isSubmitting}
              required
            />

            {message ? (
              <S.Message $tone={message.tone} aria-live="polite">
                {message.text}
              </S.Message>
            ) : null}

            <S.Actions>
              <S.PrimaryButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? '변경 중' : '비밀번호 변경'}
              </S.PrimaryButton>
            </S.Actions>
          </S.Form>
        )}
      </S.Body>
    </S.Container>
  )
}
