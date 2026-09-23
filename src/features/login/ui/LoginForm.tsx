import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { googleLogin, saveAuthTokens } from '@/entities/session/api'
import { partTripLogoUrl } from '@/shared/assets'
import { paths } from '@/shared/config'
import { getErrorMessage, getSafeRedirect } from '@/shared/utils'
import { AuthForm as S, GoogleLoginControl, KakaoLoginControl } from '@/shared/ui'

type FormMessage = {
  text: string
  tone: 'error' | 'success'
}

type LoginFormProps = {
  redirect?: string
}

export function LoginForm({ redirect }: LoginFormProps) {
  const navigate = useNavigate()
  const safeRedirect = getSafeRedirect(redirect)
  const navigateAfterAuth = () => {
    void navigate({ href: safeRedirect ?? paths.main, replace: true })
  }
  const [message, setMessage] = useState<FormMessage | null>(null)
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)

  const handleGoogleLogin = async (idToken: string) => {
    try {
      setIsGoogleSubmitting(true)
      const tokens = await googleLogin({ idToken })
      saveAuthTokens(tokens)
      navigateAfterAuth()
    } catch (error) {
      setMessage({ text: getErrorMessage(error), tone: 'error' })
    } finally {
      setIsGoogleSubmitting(false)
    }
  }

  const isSubmitting = isGoogleSubmitting

  return (
    <S.Container>
      <S.Header>
        <S.Brand><img src={partTripLogoUrl} alt="PartTrip" /></S.Brand>
        <S.Title>PartTrip 시작하기</S.Title>
        <S.Subtitle>카카오톡 또는 Google 계정으로 바로 시작하세요.</S.Subtitle>
      </S.Header>

      <S.Body>
        <S.Form
          aria-label="로그인"
          onSubmit={(event) => event.preventDefault()}
        >
          {message ? (
            <S.Message $tone={message.tone} aria-live="polite">
              {message.text}
            </S.Message>
          ) : null}

          <S.Actions>
            <KakaoLoginControl
              disabled={isSubmitting}
              redirect={safeRedirect}
              onError={(error) => setMessage({ text: getErrorMessage(error), tone: 'error' })}
            />
            <S.Divider>또는</S.Divider>
            <GoogleLoginControl
              disabled={isSubmitting}
              isSubmitting={isGoogleSubmitting}
              onError={() => setMessage({ text: 'Google 로그인에 실패했습니다.', tone: 'error' })}
              onLogin={handleGoogleLogin}
            />
          </S.Actions>
        </S.Form>
      </S.Body>
    </S.Container>
  )
}
