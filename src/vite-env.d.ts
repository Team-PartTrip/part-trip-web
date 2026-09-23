/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_GOOGLE_CLIENT_ID?: string
  readonly VITE_KAKAO_JAVASCRIPT_KEY?: string
  readonly VITE_KAKAO_REDIRECT_URI?: string
  readonly VITE_USE_MOCK_API?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface KakaoAuthApi {
  authorize(options: { redirectUri: string; state?: string }): void
}

interface KakaoShareLink {
  mobileWebUrl: string
  webUrl: string
}

interface KakaoShareDefaultFeedOptions {
  objectType: 'feed'
  content: {
    title: string
    description: string
    imageUrl: string
    link: KakaoShareLink
  }
  buttons: Array<{ title: string; link: KakaoShareLink }>
}

interface KakaoShareApi {
  sendDefault(options: KakaoShareDefaultFeedOptions): void
}

interface KakaoSdk {
  init(appKey: string): void
  isInitialized(): boolean
  Auth: KakaoAuthApi
  Share: KakaoShareApi
}

interface Window {
  Kakao?: KakaoSdk
}
