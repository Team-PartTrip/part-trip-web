export function normalizeStatus(status?: string) {
  return status?.trim().toUpperCase() ?? ''
}

type DetailState = 'loading' | 'error' | 'empty' | 'ready'

export function getDetailState({ hasData, isError, isLoading }: { hasData: boolean; isError: boolean; isLoading: boolean }): DetailState {
  if (hasData) return 'ready'
  if (isLoading) return 'loading'
  return isError ? 'error' : 'empty'
}
