export type RecordDetailState = 'loading' | 'error' | 'empty' | 'ready'

export function getRecordDetailState({
  hasRecord,
  isError,
  isLoading,
}: {
  hasRecord: boolean
  isError: boolean
  isLoading: boolean
}): RecordDetailState {
  if (hasRecord) return 'ready'
  if (isLoading) return 'loading'
  return isError ? 'error' : 'empty'
}
