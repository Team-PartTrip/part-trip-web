export const UNSUPPORTED_API_ERROR_CODE = 'API_UNAVAILABLE' as const

export class UnsupportedApiError extends Error {
  readonly code = UNSUPPORTED_API_ERROR_CODE

  constructor(feature: string) {
    super(`최신 API 명세서에 ${feature} API가 없습니다.`)
    this.name = 'UnsupportedApiError'
  }
}

export function createUnsupportedApiError(feature: string) {
  return new UnsupportedApiError(feature)
}
