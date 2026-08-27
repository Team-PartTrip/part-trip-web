export type CommentRequestDto = {
  content?: string
  parentCommentId?: number
}

export type CommentResponseDto = {
  commentId?: number
  targetType?: string
  targetId?: number
  parentCommentId?: number
  userId?: string
  nickName?: string
  content?: string
  createDate?: string
}
