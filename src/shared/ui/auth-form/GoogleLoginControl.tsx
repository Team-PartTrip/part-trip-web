import { useGoogleLogin } from '@react-oauth/google'

import * as S from './AuthForm.styles'

type GoogleLoginControlProps = {
  disabled: boolean
  isSubmitting: boolean
  label?: string
  onError: () => void
  onLogin: (code: string) => Promise<void>
}

export function GoogleLoginControl({ disabled, isSubmitting, label = 'Google로 계속하기', onError, onLogin }: GoogleLoginControlProps) {
  const requestGoogleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: ({ code }) => void onLogin(code),
    onError,
  })

  return (
    <S.GoogleButton type="button" onClick={() => requestGoogleLogin()} disabled={disabled}>
      {isSubmitting ? 'Google 처리 중' : label}
    </S.GoogleButton>
  )
}
