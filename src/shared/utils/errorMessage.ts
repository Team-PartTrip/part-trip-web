import { isAxiosError } from 'axios'

const fallbackErrorMessage = '요청 처리 중 오류가 발생했습니다.'

function getResponseMessage(data: unknown) {
  if (typeof data === 'string') {
    return /<[^>]+>/.test(data) ? null : data
  }

  if (data && typeof data === 'object' && 'message' in data) {
    const message = data.message
    return typeof message === 'string' && !/<[^>]+>/.test(message) ? message : null
  }

  return null
}

export function getErrorMessage(error: unknown, fallback?: string) {
  if (isAxiosError(error)) {
    return (
      getResponseMessage(error.response?.data)?.trim() ||
      fallback ||
      error.message ||
      fallbackErrorMessage
    )
  }

  if (error instanceof Error) {
    return fallback ?? error.message
  }

  return fallback ?? fallbackErrorMessage
}
