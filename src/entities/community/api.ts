import { createUnsupportedApiError } from '@/shared/libs/unsupported-api-error'

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
  void payload
  throw createUnsupportedApiError('커뮤니티')
}
