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

type SignUpFormProps = {
  redirect?: string
}

export function SignUpForm({ redirect }: SignUpFormProps) {
  const navigate = useNavigate()
  const safeRedirect = getSafeRedirect(redirect)
  const [message, setMessage] = useState<FormMessage | null>(null)
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)

  const navigateAfterAuth = () => {
    void navigate({ href: safeRedirect ?? paths.main, replace: true })
  }

  const handleGoogleSignup = async (idToken: string) => {
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

  return (
    <S.Container>
      <S.Header>
        <S.Brand><img src={partTripLogoUrl} alt="PartTrip" /></S.Brand>
        <S.Title>회원가입</S.Title>
        <S.Subtitle>카카오 또는 Google 계정으로 가입하세요.</S.Subtitle>
      </S.Header>
      <S.Body>
        <S.Form aria-label="회원가입" onSubmit={(event) => event.preventDefault()}>
          {message ? <S.Message $tone={message.tone} aria-live="polite">{message.text}</S.Message> : null}
          <S.Actions>
            <KakaoLoginControl
              disabled={isGoogleSubmitting}
              label="카카오로 가입하기"
              redirect={safeRedirect}
              onError={(error) => setMessage({ text: getErrorMessage(error), tone: 'error' })}
            />
            <S.Divider>또는</S.Divider>
            <GoogleLoginControl
              disabled={isGoogleSubmitting}
              isSubmitting={isGoogleSubmitting}
              label="Google로 가입하기"
              onError={() => setMessage({ text: 'Google 회원가입에 실패했습니다.', tone: 'error' })}
              onLogin={handleGoogleSignup}
            />
            <S.SecondaryButton
              search={safeRedirect ? { redirect: safeRedirect } : undefined}
              to={paths.login}
            >
              로그인
            </S.SecondaryButton>
          </S.Actions>
        </S.Form>
      </S.Body>
    </S.Container>
  )
}
