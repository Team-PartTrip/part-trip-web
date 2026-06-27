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
import { useGoogleLogin } from '@react-oauth/google'
import { ACCESS_TOKEN_KEY, googleLogin, login } from '@shared/api'
import logoUrl from '@shared/assets/logo.svg'
import { paths } from '@shared/config'
import {
  authValidationRules,
  getErrorMessage,
  getIdValidationError,
  getPasswordValidationError,
  sanitizeId,
  sanitizePassword,
} from '@shared/lib'
import { AuthForm as S } from '@shared/ui'

type FormMessage = {
  text: string
  tone: 'error' | 'success'
}

type LoginFormValues = {
  userId: string
  userPwd: string
}

const trimFormValue = (value: unknown) =>
  typeof value === 'string' ? value.trim() : ''

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

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  )
}

export function LoginForm() {
  const navigate = useNavigate()
  const [message, setMessage] = useState<FormMessage | null>(null)

  const loginForm = useForm<LoginFormValues>({
    defaultValues: {
      userId: '',
      userPwd: '',
    },
  })

  const userIdField = loginForm.register('userId', {
    required: '아이디를 입력해주세요.',
    setValueAs: (value) => sanitizeId(trimFormValue(value)),
    validate: (value) => getIdValidationError(value) ?? true,
  })
  const userPwdField = loginForm.register('userPwd', {
    required: '비밀번호를 입력해주세요.',
    setValueAs: (value) => sanitizePassword(trimFormValue(value)),
    validate: (value) => getPasswordValidationError(value) ?? true,
  })

  const handleSubmit: SubmitHandler<LoginFormValues> = async ({
    userId,
    userPwd,
  }) => {
    try {
      const { accessToken } = await login({
        userId,
        userPwd,
      })
      localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
      navigate(paths.home, { replace: true })
    } catch (error) {
      setMessage({
        text: getErrorMessage(error),
        tone: 'error',
      })
    }
  }

  const handleInvalid: SubmitErrorHandler<LoginFormValues> = (errors) => {
    setMessage({
      text: getFirstErrorMessage(errors),
      tone: 'error',
    })
  }

  const requestGoogleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async ({ code }) => {
      try {
        const { accessToken } = await googleLogin({ code })
        localStorage.setItem(ACCESS_TOKEN_KEY, accessToken)
        navigate(paths.home, { replace: true })
      } catch (error) {
        setMessage({ text: getErrorMessage(error), tone: 'error' })
      }
    },
    onError: () =>
      setMessage({ text: 'Google 로그인에 실패했습니다.', tone: 'error' }),
  })

  const isSubmitting = loginForm.formState.isSubmitting

  return (
    <S.Container>
      <S.Header>
        <S.Logo src={logoUrl} alt="PartTrip" />
        <S.Title>로그인</S.Title>
      </S.Header>

      <S.Body>
        <S.Form
          aria-label="로그인"
          method="post"
          noValidate
          onSubmit={loginForm.handleSubmit(handleSubmit, handleInvalid)}
        >
          <S.Input
            {...userIdField}
            aria-label="아이디"
            type="text"
            autoComplete="username"
            placeholder="아이디를 입력하세요."
            minLength={authValidationRules.id.minLength}
            maxLength={authValidationRules.id.maxLength}
            pattern={authValidationRules.id.pattern}
            title="아이디는 영문과 숫자만 입력해주세요."
            onChange={createSanitizedChangeHandler(userIdField, sanitizeId)}
            disabled={isSubmitting}
            required
          />

          <S.Input
            {...userPwdField}
            aria-label="비밀번호"
            type="password"
            autoComplete="current-password"
            placeholder="비밀번호를 입력하세요."
            minLength={authValidationRules.password.minLength}
            maxLength={authValidationRules.password.maxLength}
            pattern={authValidationRules.password.pattern}
            title={`비밀번호는 영문, 숫자, 특수문자(${authValidationRules.password.allowedSpecialCharacters})만 입력해주세요.`}
            onChange={createSanitizedChangeHandler(
              userPwdField,
              sanitizePassword,
            )}
            disabled={isSubmitting}
            required
          />

          <S.HintRow>
            <span>비밀 번호를 잊으셨나요? </span>
            <S.InlineLink to={paths.changePassword}>비밀번호 찾기</S.InlineLink>
          </S.HintRow>

          {message ? (
            <S.Message $tone={message.tone} aria-live="polite">
              {message.text}
            </S.Message>
          ) : null}

          <S.Actions>
            <S.PrimaryButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? '로그인 중' : '로그인 하기'}
            </S.PrimaryButton>
            <S.Divider>또는</S.Divider>
            <S.GoogleButton
              type="button"
              onClick={() => requestGoogleLogin()}
              disabled={isSubmitting}
            >
              <GoogleGlyph />
              Google로 계속하기
            </S.GoogleButton>
            <S.SecondaryButton to={paths.signUp}>회원가입 하기</S.SecondaryButton>
          </S.Actions>
        </S.Form>
      </S.Body>
    </S.Container>
  )
}
