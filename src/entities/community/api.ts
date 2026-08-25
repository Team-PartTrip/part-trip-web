import { apiClient } from '@/shared/libs/api-client'

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
  const { data } = await apiClient.post<LikeResponseDto>('/community/likes', payload)
  return data
}
