import { apiClient } from '@/shared/libs/api-client'
import { requestWithMockFallback } from '@/shared/libs/api-fallback'

export * from './board'
export * from './review'

export type LikeRequestDto = {
  targetType?: string
  targetId?: number
}

export type LikeResponseDto = {
  liked?: boolean
  likeCount?: number
}

export async function toggleLike(payload: LikeRequestDto): Promise<LikeResponseDto> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.post<LikeResponseDto>('/community/likes', payload)
      return data
    },
    () => ({ likeCount: 1, liked: true }),
  )
}
