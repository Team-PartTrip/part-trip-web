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
  throw new Error('최신 API 명세서에 커뮤니티 API가 없습니다.')
}
