import { useState, type FormEvent, type MouseEvent } from 'react'
import { sendVerificationCode, signUp, verifyCode } from '@shared/api'
import logoUrl from '@shared/assets/logo.svg'
import { paths } from '@shared/config'
import { AuthForm as S } from '@shared/ui'

type SignUpStep = 'credentials' | 'verification'

type SignUpCredentials = {
  id: string
  password: string
  phoneNumber: string
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

export function SignUpForm() {
  const [step, setStep] = useState<SignUpStep>('credentials')
  const [credentials, setCredentials] = useState<SignUpCredentials | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [message, setMessage] = useState<FormMessage | null>(null)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const password = getFormValue(formData, 'password')
    const passwordConfirm = getFormValue(formData, 'passwordConfirm')

    if (password !== passwordConfirm) {
      setMessage({
        text: '비밀번호가 일치하지 않습니다.',
        tone: 'error',
      })
      return
    }

    setCredentials({
      id: getFormValue(formData, 'id'),
      password,
      phoneNumber: getFormValue(formData, 'phoneNumber'),
    })
    setMessage(null)
    setStep('verification')
  }

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
        purpose: 'sign-up',
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

    if (!credentials) {
      setMessage({
        text: '회원가입 정보를 다시 입력해주세요.',
        tone: 'error',
      })
      setStep('credentials')
      return
    }

    const formData = new FormData(event.currentTarget)
    const email = getFormValue(formData, 'email')
    const code = getFormValue(formData, 'verificationCode')

    try {
      setIsSubmitting(true)
      await verifyCode({
        code,
        email,
        purpose: 'sign-up',
      })
      await signUp({
        ...credentials,
        code,
        email,
      })
      setMessage({
        text: '회원가입이 완료되었습니다.',
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

  if (step === 'verification') {
    return (
      <S.Container key="sign-up-verification">
        <S.Header>
          <S.Logo src={logoUrl} alt="PartTrip" />
          <S.Title>회원가입</S.Title>
        </S.Header>

        <S.Body>
          <S.Form aria-label="회원가입 인증" onSubmit={handleVerificationSubmit}>
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
                {isSubmitting ? '처리 중' : '회원가입'}
              </S.PrimaryButton>
              <S.SecondaryButton to={paths.login}>로그인 하기</S.SecondaryButton>
            </S.Actions>
          </S.Form>
        </S.Body>
      </S.Container>
    )
  }

  return (
    <S.Container key="sign-up-credentials">
      <S.Header>
        <S.Logo src={logoUrl} alt="PartTrip" />
        <S.Title>회원가입</S.Title>
      </S.Header>

      <S.Body>
        <S.Form aria-label="회원가입" onSubmit={handleSubmit}>
          <S.Input
            aria-label="아이디"
            name="id"
            type="text"
            autoComplete="username"
            placeholder="아이디를 입력하세요."
            disabled={isSubmitting}
            required
          />

          <S.Input
            aria-label="비밀번호"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="비밀번호를 입력하세요."
            disabled={isSubmitting}
            required
          />

          <S.Input
            aria-label="비밀번호 확인"
            name="passwordConfirm"
            type="password"
            autoComplete="new-password"
            placeholder="비밀번호를 다시 입력하세요."
            disabled={isSubmitting}
            required
          />

          <S.PhoneField>
            <S.CountryButton type="button" aria-label="국가 선택">
              <S.FlagText>🇰🇷</S.FlagText>
              <S.Chevron aria-hidden />
            </S.CountryButton>
            <S.PhoneInput
              aria-label="국번 전화번호"
              name="phoneNumber"
              type="tel"
              autoComplete="tel"
              placeholder="국번 전화번호를 입력하세요."
              disabled={isSubmitting}
              required
            />
          </S.PhoneField>

          {message ? (
            <S.Message $tone={message.tone} aria-live="polite">
              {message.text}
            </S.Message>
          ) : null}

          <S.Actions>
            <S.PrimaryButton type="submit" disabled={isSubmitting}>
              다음
            </S.PrimaryButton>
            <S.SecondaryButton to={paths.login}>로그인 하기</S.SecondaryButton>
          </S.Actions>
        </S.Form>
      </S.Body>
    </S.Container>
  )
}
