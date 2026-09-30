import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { googleLogin, saveAuthTokens } from '@/entities/session/api'
import { dandiAppLogoUrl } from '@/shared/assets'
import { paths } from '@/shared/config'
import { getErrorMessage, getSafeRedirect } from '@/shared/utils'
import { AuthForm as S, GoogleLoginControl, KakaoLoginControl } from '@/shared/ui'

type Props = {
  redirect?: string
}

export function SocialAuthForm({ redirect }: Props) {
  const navigate = useNavigate()
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
        <S.BrandIcon src={dandiAppLogoUrl} alt="단디 로고" width={480} height={480} />
        <S.Title>단디 시작하기</S.Title>
        <S.Subtitle>부모님 여행을 가족이 함께 챙기는 앱</S.Subtitle>
        <S.Subtitle>카카오톡 또는 Google로 로그인하세요.<br />첫 로그인 시 자동 가입돼요.</S.Subtitle>
      </S.Header>
      <S.Body>
        <S.Form aria-label="로그인" onSubmit={(event) => event.preventDefault()}>
          {message ? <S.Message $tone="error" aria-live="polite">{message}</S.Message> : null}
          <S.Actions>
            <KakaoLoginControl
              disabled={isGoogleSubmitting}
              redirect={safeRedirect}
              onError={(error) => setMessage(getErrorMessage(error))}
            />
            <S.Divider>또는</S.Divider>
            <GoogleLoginControl
              disabled={isGoogleSubmitting}
              isSubmitting={isGoogleSubmitting}
              onError={() => setMessage('Google 로그인에 실패했습니다.')}
              onLogin={handleGoogleLogin}
            />
            <S.AuthSwitch to={paths.privacy}>개인정보처리방침</S.AuthSwitch>
          </S.Actions>
        </S.Form>
      </S.Body>
    </S.Container>
  )
}
