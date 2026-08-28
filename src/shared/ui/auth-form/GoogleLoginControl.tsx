import { GoogleLogin } from '@react-oauth/google'

import * as S from './AuthForm.styles'

type GoogleLoginControlProps = {
  disabled: boolean
  isSubmitting: boolean
  label?: string
  onError: () => void
  onLogin: (idToken: string) => Promise<void>
}

export function GoogleLoginControl({ disabled, isSubmitting, label = 'Google로 계속하기', onError, onLogin }: GoogleLoginControlProps) {
  if (disabled) {
    return <S.GoogleButton type="button" disabled>{isSubmitting ? 'Google 처리 중' : label}</S.GoogleButton>
  }

  return (
    <S.GoogleLoginContainer aria-label={label}>
      <GoogleLogin
        onSuccess={({ credential }) => {
          if (credential) void onLogin(credential)
          else onError()
        }}
        onError={onError}
        text={label.includes('가입') ? 'signup_with' : 'continue_with'}
        theme="outline"
        size="large"
        shape="rectangular"
        width="100%"
      />
    </S.GoogleLoginContainer>
  )
}
