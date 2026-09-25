export function shouldRetryQuery(failureCount: number, error: unknown) {
  const status = (error as { response?: { status?: unknown } } | null)?.response?.status
  if (typeof status === 'number' && status >= 400 && status < 500) return false
  return failureCount < 1
}
