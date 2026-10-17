export function relativeLocationTime(recordedAt: string, now: number) {
  const timestamp = new Date(recordedAt).getTime()
  if (!Number.isFinite(timestamp)) return '시각 미상'
  const minutes = Math.max(0, Math.floor((now - timestamp) / 60_000))
  return minutes < 1 ? '방금 전' : `${minutes}분 전`
}
