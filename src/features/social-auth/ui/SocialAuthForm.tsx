import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { googleLogin, saveAuthTokens } from '@/entities/session/api'
import { partTripLogoUrl } from '@/shared/assets'
import { paths } from '@/shared/config'
import { getErrorMessage, getSafeRedirect } from '@/shared/utils'
import { AuthForm as S, GoogleLoginControl, KakaoLoginControl } from '@/shared/ui'

type SocialAuthMode = 'login' | 'sign-up'

type Props = {
  mode: SocialAuthMode
  redirect?: string
}

export function SocialAuthForm({ mode, redirect }: Props) {
  const navigate = useNavigate()
  const isSignUp = mode === 'sign-up'
  const safeRedirect = getSafeRedirect(redirect)
  const [message, setMessage] = useState('')
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)

  const handleGoogleLogin = async (idToken: string) => {
    try {
      setIsGoogleSubmitting(true)
      saveAuthTokens(await googleLogin({ idToken }))
      void navigate({ href: safeRedirect ?? paths.main, replace: true })
    } catch (error) {
      setMessage(getErrorMessage(error))
    } finally {
      setIsGoogleSubmitting(false)
    }
  }

  return (
    <S.Container>
      <S.Header>
        <S.Brand><img src={partTripLogoUrl} alt="PartTrip" /></S.Brand>
        <S.Title>{isSignUp ? '회원가입' : 'PartTrip 시작하기'}</S.Title>
        <S.Subtitle>{isSignUp
          ? '카카오톡 또는 Google 계정으로 바로 가입하세요.'
          : '카카오톡 또는 Google 계정으로 바로 시작하세요.'}</S.Subtitle>
      </S.Header>
      <S.Body>
        <S.Form aria-label={isSignUp ? '회원가입' : '로그인'} onSubmit={(event) => event.preventDefault()}>
          {message ? <S.Message $tone="error" aria-live="polite">{message}</S.Message> : null}
          <S.Actions>
            <KakaoLoginControl
              disabled={isGoogleSubmitting}
              label={isSignUp ? '카카오로 가입하기' : undefined}
              redirect={safeRedirect}
              onError={(error) => setMessage(getErrorMessage(error))}
            />
            <S.Divider>또는</S.Divider>
            <GoogleLoginControl
              disabled={isGoogleSubmitting}
              isSubmitting={isGoogleSubmitting}
              label={isSignUp ? 'Google로 가입하기' : undefined}
              onError={() => setMessage(`Google ${isSignUp ? '회원가입' : '로그인'}에 실패했습니다.`)}
              onLogin={handleGoogleLogin}
            />
            <S.AuthSwitch
              search={safeRedirect ? { redirect: safeRedirect } : undefined}
              to={isSignUp ? paths.login : paths.signUp}
            >
              {isSignUp ? '이미 계정이 있나요? 로그인' : '계정이 없으신가요? 회원가입'}
            </S.AuthSwitch>
            <S.AuthSwitch to="/privacy">개인정보처리방침</S.AuthSwitch>
          </S.Actions>
        </S.Form>
      </S.Body>
    </S.Container>
  )
}
