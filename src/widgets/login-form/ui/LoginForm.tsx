import { useState, type FormEvent } from 'react'
import { login } from '@shared/api'
import logoUrl from '@shared/assets/logo.svg'
import { paths } from '@shared/config'
import { AuthForm as S } from '@shared/ui'

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

export function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<FormMessage | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    try {
      setIsSubmitting(true)
      await login({
        id: getFormValue(formData, 'id'),
        password: getFormValue(formData, 'password'),
      })
      setMessage({
        text: '로그인 요청이 완료되었습니다.',
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
        <S.Title>로그인</S.Title>
      </S.Header>

      <S.Body>
        <S.Form aria-label="로그인" onSubmit={handleSubmit}>
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
            autoComplete="current-password"
            placeholder="비밀번호를 입력하세요."
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
