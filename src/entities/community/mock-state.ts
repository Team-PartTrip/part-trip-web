type MockLikeState = {
  liked: boolean
  likeCount: number
}

const mockLikes = new Map<string, MockLikeState>()

function likeKey(targetType?: string, targetId?: number) {
  return `${targetType ?? 'UNKNOWN'}:${targetId ?? ''}`
}

export function getMockLikeState(targetType: string, targetId: number, liked = false, likeCount = 0) {
  return mockLikes.get(likeKey(targetType, targetId)) ?? { liked, likeCount }
}

export function toggleMockLike(targetType?: string, targetId?: number) {
  if (targetId == null) return { liked: false, likeCount: 0 }
  const current = getMockLikeState(targetType ?? 'UNKNOWN', targetId)
  const next = { liked: !current.liked, likeCount: Math.max(0, current.likeCount + (current.liked ? -1 : 1)) }
  mockLikes.set(likeKey(targetType, targetId), next)
  return next
}
