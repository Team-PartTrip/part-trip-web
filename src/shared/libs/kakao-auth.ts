import { paths } from '@/shared/config'

const PENDING_REDIRECT_KEY = 'parttrip.kakao.pending-redirect'

export function getKakaoRedirectUri() {
  const configuredRedirectUri = import.meta.env?.VITE_KAKAO_REDIRECT_URI?.trim()
  if (configuredRedirectUri) return configuredRedirectUri
  if (typeof window === 'undefined') return paths.kakaoCallback
  return `${window.location.origin}${paths.kakaoCallback}`
}

export function beginKakaoLogin(redirect?: string) {
  if (typeof window === 'undefined') {
    throw new Error('카카오 로그인은 브라우저에서만 사용할 수 있습니다.')
  }

  const appKey = import.meta.env?.VITE_KAKAO_JAVASCRIPT_KEY?.trim()
  if (!appKey) throw new Error('카카오 로그인 설정이 없습니다.')

  const kakao = window.Kakao
  if (!kakao) throw new Error('카카오 로그인 SDK를 불러오지 못했습니다.')
  if (!kakao.isInitialized()) kakao.init(appKey)

  window.sessionStorage.setItem(PENDING_REDIRECT_KEY, redirect ?? '')
  kakao.Auth.authorize({ redirectUri: getKakaoRedirectUri() })
}

export function consumeKakaoRedirect() {
  if (typeof window === 'undefined') return undefined

  const redirect = window.sessionStorage.getItem(PENDING_REDIRECT_KEY) ?? undefined
  window.sessionStorage.removeItem(PENDING_REDIRECT_KEY)
  return redirect
}
