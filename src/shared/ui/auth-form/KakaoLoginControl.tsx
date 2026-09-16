import { useState } from 'react'

import { beginKakaoLogin } from '@/shared/libs/kakao-auth'

import * as S from './AuthForm.styles'

type KakaoLoginControlProps = {
  disabled: boolean
  label?: string
  redirect?: string
  onError: (error: unknown) => void
}

export function KakaoLoginControl({
  disabled,
  label = '카카오로 계속하기',
  redirect,
  onError,
}: KakaoLoginControlProps) {
  const [isStarting, setIsStarting] = useState(false)
  const isBusy = disabled || isStarting

  const handleClick = () => {
    try {
      setIsStarting(true)
      beginKakaoLogin(redirect)
    } catch (error) {
      setIsStarting(false)
      onError(error)
    }
  }

  return (
    <S.KakaoButton
      type="button"
      disabled={isBusy}
      aria-busy={isStarting}
      onClick={handleClick}
    >
      {isStarting ? '카카오 연결 중' : label}
    </S.KakaoButton>
  )
}
