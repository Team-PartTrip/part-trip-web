import { createUnsupportedApiError } from '@/shared/libs/unsupported-api-error'
import type { CommentRequestDto, CommentResponseDto } from './types'

export type { CommentRequestDto, CommentResponseDto } from './types'

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

export async function getBoards(params?: { page?: number; size?: number }): Promise<PageResponseDtoBoardResponseDto> {
  void params
  throw createUnsupportedApiError('커뮤니티')
}

export async function createBoard(payload: BoardRequestDto): Promise<BoardResponseDto> {
  void payload
  throw createUnsupportedApiError('커뮤니티')
}

export async function getBoard(boardId: number): Promise<BoardResponseDto> {
  void boardId
  throw createUnsupportedApiError('커뮤니티')
}

export async function updateBoard(boardId: number, payload: BoardRequestDto): Promise<BoardResponseDto> {
  void boardId
  void payload
  throw createUnsupportedApiError('커뮤니티')
}

export async function deleteBoard(boardId: number): Promise<string> {
  void boardId
  throw createUnsupportedApiError('커뮤니티')
}

export async function getMyBoards(params?: { page?: number; size?: number }): Promise<PageResponseDtoBoardResponseDto> {
  void params
  throw createUnsupportedApiError('커뮤니티')
}

export async function getBoardComments(boardId: number): Promise<CommentResponseDto[]> {
  void boardId
  throw createUnsupportedApiError('커뮤니티')
}

export async function createBoardComment(boardId: number, payload: CommentRequestDto): Promise<CommentResponseDto> {
  void boardId
  void payload
  throw createUnsupportedApiError('커뮤니티')
}

export async function updateComment(commentId: number, payload: CommentRequestDto): Promise<CommentResponseDto> {
  void commentId
  void payload
  throw createUnsupportedApiError('커뮤니티')
}

export async function deleteComment(commentId: number): Promise<string> {
  void commentId
  throw createUnsupportedApiError('커뮤니티')
}
