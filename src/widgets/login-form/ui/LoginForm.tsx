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
import { login } from '@shared/api'
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
      await login({
        userId,
        userPwd,
      })
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
            <S.SecondaryButton to={paths.signUp}>회원가입 하기</S.SecondaryButton>
          </S.Actions>
        </S.Form>
      </S.Body>
    </S.Container>
  )
}
