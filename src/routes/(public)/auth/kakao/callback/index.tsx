import { useEffect, useRef, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { kakaoLogin, saveAuthTokens } from '@/entities/session/api'
import { partTripLogoUrl } from '@/shared/assets'
import { paths } from '@/shared/config'
import { clearKakaoAuthRequest, getKakaoAuthRequest, getKakaoRedirectUri } from '@/shared/libs/kakao-auth'
import { getErrorMessage, getSafeRedirect } from '@/shared/utils'
import { AuthForm as S } from '@/shared/ui'

export const Route = createFileRoute('/(public)/auth/kakao/callback/')({
  component: KakaoCallbackRoute,
})

function KakaoCallbackRoute() {
  const navigate = useNavigate()
  const [callback] = useState(() => {
    const params = new URLSearchParams(
      typeof window === 'undefined' ? '' : window.location.search,
    )
    return {
      code: params.get('code') ?? '',
      error: params.get('error'),
      errorDescription: params.get('error_description'),
      state: params.get('state'),
    }
  })
  const [pendingRequest] = useState(() => getKakaoAuthRequest())
  const [redirect] = useState(() => getSafeRedirect(pendingRequest.redirect))
  const hasCallbackError = Boolean(callback.error || !callback.code)
  const hasInvalidState = !hasCallbackError
    && (!callback.state || callback.state !== pendingRequest.state)
  const [message, setMessage] = useState(
    () => callback.errorDescription
      ?? (hasInvalidState
        ? '카카오 로그인 요청이 유효하지 않습니다.'
        : hasCallbackError
          ? '카카오 로그인이 취소되었습니다.'
          : '카카오 로그인 처리 중입니다.'),
  )
  const [hasError, setHasError] = useState(hasCallbackError || hasInvalidState)
  const hasStartedRef = useRef(false)

  useEffect(() => {
    clearKakaoAuthRequest()
    if (hasCallbackError || hasInvalidState || hasStartedRef.current) return
    hasStartedRef.current = true

    let active = true
    void kakaoLogin({
      code: callback.code,
      redirectUri: getKakaoRedirectUri(),
    })
      .then((tokens) => {
        if (!active) return
        saveAuthTokens(tokens)
        void navigate({ href: redirect ?? paths.main, replace: true })
      })
      .catch((error: unknown) => {
        if (!active) return
        setHasError(true)
        setMessage(getErrorMessage(error))
      })

    return () => {
      active = false
    }
  }, [callback, hasCallbackError, hasInvalidState, navigate, redirect])

  return (
    <S.AuthPage className="page">
      <S.Container>
        <S.Header>
          <S.Brand><img src={partTripLogoUrl} alt="PartTrip" /></S.Brand>
          <S.Title>카카오 로그인</S.Title>
        </S.Header>
        <S.Body>
          <S.Form $spacious aria-label="카카오 로그인 처리">
            {hasError ? (
              <S.Message role="alert" $tone="error">{message}</S.Message>
            ) : (
              <S.Subtitle aria-live="polite">{message}</S.Subtitle>
            )}
            {hasError ? (
              <S.Actions>
                <S.SecondaryButton to={paths.login}>
                  로그인으로 돌아가기
                </S.SecondaryButton>
              </S.Actions>
            ) : null}
          </S.Form>
        </S.Body>
      </S.Container>
    </S.AuthPage>
  )
}
