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
  authorize(options: { redirectUri: string }): void
}

interface KakaoSdk {
  init(appKey: string): void
  isInitialized(): boolean
  Auth: KakaoAuthApi
}

interface Window {
  Kakao?: KakaoSdk
}
