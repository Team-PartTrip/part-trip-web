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

export type BoardRequestDto = {
  title?: string
  content?: string
  images?: string[]
}

export type BoardResponseDto = {
  boardId?: number
  userId?: string
  nickName?: string
  title?: string
  content?: string
  images?: string[]
  likeCount?: number
  liked?: boolean
  commentCount?: number
  createDate?: string
  updateDate?: string
}

export type PageResponseDtoBoardResponseDto = {
  content?: BoardResponseDto[]
  page?: number
  size?: number
  totalElements?: number
  totalPages?: number
  hasNext?: boolean
}

const COMMUNITY_API_UNAVAILABLE = '최신 API 명세서에 커뮤니티 API가 없습니다.'

export async function getBoards(params?: { page?: number; size?: number }): Promise<PageResponseDtoBoardResponseDto> {
  void params
  throw new Error(COMMUNITY_API_UNAVAILABLE)
}

export async function createBoard(payload: BoardRequestDto): Promise<BoardResponseDto> {
  void payload
  throw new Error(COMMUNITY_API_UNAVAILABLE)
}

export async function getBoard(boardId: number): Promise<BoardResponseDto> {
  void boardId
  throw new Error(COMMUNITY_API_UNAVAILABLE)
}

export async function updateBoard(boardId: number, payload: BoardRequestDto): Promise<BoardResponseDto> {
  void boardId
  void payload
  throw new Error(COMMUNITY_API_UNAVAILABLE)
}

export async function deleteBoard(boardId: number): Promise<string> {
  void boardId
  throw new Error(COMMUNITY_API_UNAVAILABLE)
}

export async function getMyBoards(params?: { page?: number; size?: number }): Promise<PageResponseDtoBoardResponseDto> {
  void params
  throw new Error(COMMUNITY_API_UNAVAILABLE)
}

export async function getBoardComments(boardId: number): Promise<CommentResponseDto[]> {
  void boardId
  throw new Error(COMMUNITY_API_UNAVAILABLE)
}

export async function createBoardComment(boardId: number, payload: CommentRequestDto): Promise<CommentResponseDto> {
  void boardId
  void payload
  throw new Error(COMMUNITY_API_UNAVAILABLE)
}

export async function updateComment(commentId: number, payload: CommentRequestDto): Promise<CommentResponseDto> {
  void commentId
  void payload
  throw new Error(COMMUNITY_API_UNAVAILABLE)
}

export async function deleteComment(commentId: number): Promise<string> {
  void commentId
  throw new Error(COMMUNITY_API_UNAVAILABLE)
}
