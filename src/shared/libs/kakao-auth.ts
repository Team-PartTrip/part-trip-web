import { paths } from '@/shared/config'

const PENDING_REDIRECT_KEY = 'parttrip.kakao.pending-redirect'
const PENDING_STATE_KEY = 'parttrip.kakao.pending-state'

export type KakaoAuthRequest = {
  redirect?: string
  state?: string
}

function createKakaoState() {
  if (!window.crypto?.getRandomValues) {
    throw new Error('안전한 카카오 로그인 상태값을 생성할 수 없습니다.')
  }

  const values = new Uint8Array(32)
  window.crypto.getRandomValues(values)
  return Array.from(values, (value) => value.toString(16).padStart(2, '0')).join('')
}

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

  const state = createKakaoState()
  window.sessionStorage.setItem(PENDING_REDIRECT_KEY, redirect ?? '')
  window.sessionStorage.setItem(PENDING_STATE_KEY, state)

  try {
    kakao.Auth.authorize({ redirectUri: getKakaoRedirectUri(), state })
  } catch (error) {
    window.sessionStorage.removeItem(PENDING_REDIRECT_KEY)
    window.sessionStorage.removeItem(PENDING_STATE_KEY)
    throw error
  }
}

export function getKakaoAuthRequest(): KakaoAuthRequest {
  if (typeof window === 'undefined') return {}

  return {
    redirect: window.sessionStorage.getItem(PENDING_REDIRECT_KEY) ?? undefined,
    state: window.sessionStorage.getItem(PENDING_STATE_KEY) ?? undefined,
  }
}

export function clearKakaoAuthRequest() {
  if (typeof window === 'undefined') return

  window.sessionStorage.removeItem(PENDING_REDIRECT_KEY)
  window.sessionStorage.removeItem(PENDING_STATE_KEY)
}
