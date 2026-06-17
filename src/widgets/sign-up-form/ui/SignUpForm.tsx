import { useState, type ChangeEvent } from 'react'
import {
  useForm,
  type FieldErrors,
  type FieldValues,
  type SubmitErrorHandler,
  type SubmitHandler,
  type UseFormRegisterReturn,
} from 'react-hook-form'
import { sendVerificationCode, verifyCode } from '@shared/api'
import logoUrl from '@shared/assets/logo.svg'
import { paths } from '@shared/config'
import {
  authValidationRules,
  getIdValidationError,
  getPasswordValidationError,
  sanitizeId,
  sanitizePassword,
} from '@shared/lib'
import { AuthForm as S } from '@shared/ui'

type SignUpStep = 'credentials' | 'verification'

type CredentialsFormValues = {
  id: string
  password: string
  passwordConfirm: string
  phoneNumber: string
}

type VerificationFormValues = {
  email: string
  verificationCode: string
}

type FormMessage = {
  text: string
  tone: 'error' | 'success'
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message
  }

  return '요청 처리 중 오류가 발생했습니다.'
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

export function SignUpForm() {
  const [step, setStep] = useState<SignUpStep>('credentials')
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [message, setMessage] = useState<FormMessage | null>(null)

  const credentialsForm = useForm<CredentialsFormValues>({
    defaultValues: {
      id: '',
      password: '',
      passwordConfirm: '',
      phoneNumber: '',
    },
  })
  const verificationForm = useForm<VerificationFormValues>({
    defaultValues: {
      email: '',
      verificationCode: '',
    },
  })

  const idField = credentialsForm.register('id', {
    required: '아이디를 입력해주세요.',
    setValueAs: (value) => sanitizeId(trimFormValue(value)),
    validate: (value) => getIdValidationError(value) ?? true,
  })
  const passwordField = credentialsForm.register('password', {
    required: '비밀번호를 입력해주세요.',
    setValueAs: (value) => sanitizePassword(trimFormValue(value)),
    validate: (value) => getPasswordValidationError(value) ?? true,
  })
  const passwordConfirmField = credentialsForm.register('passwordConfirm', {
    required: '비밀번호 확인을 입력해주세요.',
    setValueAs: (value) => sanitizePassword(trimFormValue(value)),
    validate: (value, values) =>
      value === values.password || '비밀번호가 일치하지 않습니다.',
  })
  const phoneNumberField = credentialsForm.register('phoneNumber', {
    required: '전화번호를 입력해주세요.',
    setValueAs: trimFormValue,
  })
  const emailField = verificationForm.register('email', {
    required: '이메일을 입력해주세요.',
    setValueAs: trimFormValue,
    validate: (value) =>
      emailPattern.test(value) || '올바른 이메일을 입력해주세요.',
  })
  const verificationCodeField = verificationForm.register('verificationCode', {
    required: '인증코드를 입력해주세요.',
    setValueAs: trimFormValue,
  })

  const handleCredentialsSubmit: SubmitHandler<CredentialsFormValues> = ({
    password,
    passwordConfirm,
  }) => {
    if (password !== passwordConfirm) {
      setMessage({
        text: '비밀번호가 일치하지 않습니다.',
        tone: 'error',
      })
      return
    }

    setMessage(null)
    setStep('verification')
  }

  const handleCredentialsInvalid: SubmitErrorHandler<CredentialsFormValues> = (
    errors,
  ) => {
    setMessage({
      text: getFirstErrorMessage(errors),
      tone: 'error',
    })
  }

  const handleSendVerificationCode = async () => {
    const isEmailValid = await verificationForm.trigger('email')
    const email = verificationForm.getValues('email')

    if (!isEmailValid || !email) {
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

  const handleVerificationSubmit: SubmitHandler<VerificationFormValues> = async ({
    email,
    verificationCode,
  }) => {
    try {
      await verifyCode({
        code: verificationCode,
        email,
      })
      setMessage({
        text: '인증코드가 확인되었습니다.',
        tone: 'success',
      })
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

  const isCredentialsSubmitting = credentialsForm.formState.isSubmitting
  const isVerificationSubmitting = verificationForm.formState.isSubmitting

  if (step === 'verification') {
    return (
      <S.Container key="sign-up-verification">
        <S.Header>
          <S.Logo src={logoUrl} alt="PartTrip" />
          <S.Title>회원가입</S.Title>
        </S.Header>

        <S.Body>
          <S.Form
            aria-label="회원가입 인증"
            method="post"
            noValidate
            onSubmit={verificationForm.handleSubmit(
              handleVerificationSubmit,
              handleVerificationInvalid,
            )}
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

            <S.Input
              {...verificationCodeField}
              $compact
              aria-label="인증코드"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="인증코드를 입력하세요."
              disabled={isVerificationSubmitting}
              required
            />

            {message ? (
              <S.Message $tone={message.tone} aria-live="polite">
                {message.text}
              </S.Message>
            ) : null}

            <S.Actions>
              <S.PrimaryButton type="submit" disabled={isVerificationSubmitting}>
                {isVerificationSubmitting ? '확인 중' : '인증코드 확인'}
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
        <S.Form
          aria-label="회원가입"
          method="post"
          noValidate
          onSubmit={credentialsForm.handleSubmit(
            handleCredentialsSubmit,
            handleCredentialsInvalid,
          )}
        >
          <S.Input
            {...idField}
            aria-label="아이디"
            type="text"
            autoComplete="username"
            placeholder="아이디를 입력하세요."
            minLength={authValidationRules.id.minLength}
            maxLength={authValidationRules.id.maxLength}
            pattern={authValidationRules.id.pattern}
            title="아이디는 영문과 숫자만 입력해주세요."
            onChange={createSanitizedChangeHandler(idField, sanitizeId)}
            disabled={isCredentialsSubmitting}
            required
          />

          <S.Input
            {...passwordField}
            aria-label="비밀번호"
            type="password"
            autoComplete="new-password"
            placeholder="비밀번호를 입력하세요."
            minLength={authValidationRules.password.minLength}
            maxLength={authValidationRules.password.maxLength}
            pattern={authValidationRules.password.pattern}
            title={`비밀번호는 영문, 숫자, 특수문자(${authValidationRules.password.allowedSpecialCharacters})만 입력해주세요.`}
            onChange={createSanitizedChangeHandler(
              passwordField,
              sanitizePassword,
            )}
            disabled={isCredentialsSubmitting}
            required
          />

          <S.Input
            {...passwordConfirmField}
            aria-label="비밀번호 확인"
            type="password"
            autoComplete="new-password"
            placeholder="비밀번호를 다시 입력하세요."
            minLength={authValidationRules.password.minLength}
            maxLength={authValidationRules.password.maxLength}
            pattern={authValidationRules.password.pattern}
            title={`비밀번호는 영문, 숫자, 특수문자(${authValidationRules.password.allowedSpecialCharacters})만 입력해주세요.`}
            onChange={createSanitizedChangeHandler(
              passwordConfirmField,
              sanitizePassword,
            )}
            disabled={isCredentialsSubmitting}
            required
          />

          <S.PhoneField>
            <S.CountryButton type="button" aria-label="국가 선택">
              <S.FlagText>🇰🇷</S.FlagText>
              <S.Chevron aria-hidden />
            </S.CountryButton>
            <S.PhoneInput
              {...phoneNumberField}
              aria-label="국번 전화번호"
              type="tel"
              autoComplete="tel"
              placeholder="국번 전화번호를 입력하세요."
              disabled={isCredentialsSubmitting}
              required
            />
          </S.PhoneField>

          {message ? (
            <S.Message $tone={message.tone} aria-live="polite">
              {message.text}
            </S.Message>
          ) : null}

          <S.Actions>
            <S.PrimaryButton type="submit" disabled={isCredentialsSubmitting}>
              다음
            </S.PrimaryButton>
            <S.SecondaryButton to={paths.login}>로그인 하기</S.SecondaryButton>
          </S.Actions>
        </S.Form>
      </S.Body>
    </S.Container>
  )
}
