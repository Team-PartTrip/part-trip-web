import { apiClient } from '@/shared/libs/api-client'

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

export type PageResponseDtoBoardResponseDto = {
  content?: BoardResponseDto[]
  page?: number
  size?: number
  totalElements?: number
  totalPages?: number
  hasNext?: boolean
}

const BOARD_API_PATHS = {
  base: '/community/boards',
  detail: (boardId: number) => `/community/boards/${boardId}`,
  mine: '/community/boards/mine',
  comments: (boardId: number) => `/community/boards/${boardId}/comments`,
  commentDetail: (commentId: number) => `/community/comments/${commentId}`,
} as const

export async function getBoards(params?: {
  page?: number
  size?: number
}): Promise<PageResponseDtoBoardResponseDto> {
  const { data } = await apiClient.get<PageResponseDtoBoardResponseDto>(BOARD_API_PATHS.base, { params })
  return data
}

export async function createBoard(payload: BoardRequestDto): Promise<BoardResponseDto> {
  const { data } = await apiClient.post<BoardResponseDto>(BOARD_API_PATHS.base, payload)
  return data
}

export async function getBoard(boardId: number): Promise<BoardResponseDto> {
  const { data } = await apiClient.get<BoardResponseDto>(BOARD_API_PATHS.detail(boardId))
  return data
}

export async function updateBoard(boardId: number, payload: BoardRequestDto): Promise<BoardResponseDto> {
  const { data } = await apiClient.put<BoardResponseDto>(BOARD_API_PATHS.detail(boardId), payload)
  return data
}

export async function deleteBoard(boardId: number): Promise<string> {
  const { data } = await apiClient.delete<string>(BOARD_API_PATHS.detail(boardId))
  return data
}

export async function getMyBoards(params?: {
  page?: number
  size?: number
}): Promise<PageResponseDtoBoardResponseDto> {
  const { data } = await apiClient.get<PageResponseDtoBoardResponseDto>(BOARD_API_PATHS.mine, { params })
  return data
}

export async function getBoardComments(boardId: number): Promise<CommentResponseDto[]> {
  const { data } = await apiClient.get<CommentResponseDto[]>(BOARD_API_PATHS.comments(boardId))
  return data
}

export async function createBoardComment(
  boardId: number,
  payload: CommentRequestDto
): Promise<CommentResponseDto> {
  const { data } = await apiClient.post<CommentResponseDto>(BOARD_API_PATHS.comments(boardId), payload)
  return data
}

export async function updateComment(
  commentId: number,
  payload: CommentRequestDto
): Promise<CommentResponseDto> {
  const { data } = await apiClient.put<CommentResponseDto>(BOARD_API_PATHS.commentDetail(commentId), payload)
  return data
}

export async function deleteComment(commentId: number): Promise<string> {
  const { data } = await apiClient.delete<string>(BOARD_API_PATHS.commentDetail(commentId))
  return data
}
