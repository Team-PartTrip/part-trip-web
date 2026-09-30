import { GoogleLogin } from '@react-oauth/google'
import { useLayoutEffect, useRef, useState } from 'react'

import * as S from './AuthForm.styles'

type GoogleLoginControlProps = {
  disabled: boolean
  isSubmitting: boolean
  label?: string
  onError: () => void
  onLogin: (idToken: string) => Promise<void>
}

export function GoogleLoginControl({ disabled, isSubmitting, label = 'Google로 계속하기', onError, onLogin }: GoogleLoginControlProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [width, setWidth] = useState(400)

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new ResizeObserver(([entry]) => {
      setWidth(Math.max(1, Math.min(400, Math.floor(entry.contentRect.width))))
    })
    observer.observe(container)
    return () => observer.disconnect()
  }, [disabled])

  if (disabled) {
    return <S.GoogleButton type="button" disabled>{isSubmitting ? 'Google 처리 중' : label}</S.GoogleButton>
  }

  return (
    <S.GoogleLoginContainer aria-label={label} ref={containerRef}>
      <GoogleLogin
        key={width}
        onSuccess={({ credential }) => {
          if (credential) void onLogin(credential).catch(() => onError())
          else onError()
        }}
        onError={onError}
        text={label.includes('가입') ? 'signup_with' : 'continue_with'}
        theme="outline"
        size="large"
        shape="rectangular"
        width={width}
      />
    </S.GoogleLoginContainer>
  )
}
