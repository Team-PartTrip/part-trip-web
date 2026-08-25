import { useGoogleLogin } from '@react-oauth/google'
import { AuthForm as S } from '@/shared/ui'

type GoogleLoginControlProps = {
  disabled: boolean
  isSubmitting: boolean
  onError: () => void
  onLogin: (code: string) => Promise<void>
}

export function GoogleLoginControl({ disabled, isSubmitting, onError, onLogin }: GoogleLoginControlProps) {
  const requestGoogleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: ({ code }) => void onLogin(code),
    onError,
  })

  return (
    <S.GoogleButton type="button" onClick={() => requestGoogleLogin()} disabled={disabled}>
      {isSubmitting ? 'Google 로그인 중' : 'Google로 계속하기'}
    </S.GoogleButton>
  )
}
