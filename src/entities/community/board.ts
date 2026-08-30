import { apiClient } from '@/shared/libs/api-client'
import { requestWithMockFallback } from '@/shared/libs/api-fallback'
import { getMockLikeState } from './mock-state'
import { deleteMockReviewComment, updateMockReviewComment } from './review'
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

const BOARD_API_PATHS = {
  base: '/community/boards',
  detail: (boardId: number) => `/community/boards/${boardId}`,
  mine: '/community/boards/mine',
  comments: (boardId: number) => `/community/boards/${boardId}/comments`,
  commentDetail: (commentId: number) => `/community/comments/${commentId}`,
} as const

let mockBoards: BoardResponseDto[] = []
const mockBoardComments = new Map<number, CommentResponseDto[]>()

function mockPage<T>(content: T[], params?: { page?: number; size?: number }) {
  const page = params?.page ?? 0
  const size = params?.size ?? content.length
  const totalPages = size > 0 ? Math.ceil(content.length / size) : 0
  return {
    content: content.slice(page * size, page * size + size),
    hasNext: page + 1 < totalPages,
    page,
    size,
    totalElements: content.length,
    totalPages,
  }
}

export async function getBoards(params?: {
  page?: number
  size?: number
}): Promise<PageResponseDtoBoardResponseDto> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.get<PageResponseDtoBoardResponseDto>(BOARD_API_PATHS.base, { params })
      return data
    },
    () => mockPage(mockBoards.map((board) => board.boardId == null ? board : { ...board, ...getMockLikeState('BOARD', board.boardId, board.liked, board.likeCount) }), params),
  )
}

export async function createBoard(payload: BoardRequestDto): Promise<BoardResponseDto> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.post<BoardResponseDto>(BOARD_API_PATHS.base, payload)
      return data
    },
    () => {
      const board = { ...payload, boardId: Date.now(), commentCount: 0, likeCount: 0, nickName: '나', userId: 'mock-user' }
      mockBoards = [board, ...mockBoards]
      return board
    },
  )
}

export async function getBoard(boardId: number): Promise<BoardResponseDto> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.get<BoardResponseDto>(BOARD_API_PATHS.detail(boardId))
      return data
    },
    () => {
      const board = mockBoards.find((item) => item.boardId === boardId)
      if (!board) throw new Error('게시글을 찾을 수 없습니다.')
      return board.boardId == null ? board : { ...board, ...getMockLikeState('BOARD', board.boardId, board.liked, board.likeCount) }
    },
  )
}

export async function updateBoard(boardId: number, payload: BoardRequestDto): Promise<BoardResponseDto> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.put<BoardResponseDto>(BOARD_API_PATHS.detail(boardId), payload)
      return data
    },
    () => {
      const current = mockBoards.find((board) => board.boardId === boardId)
      if (!current) throw new Error('게시글을 찾을 수 없습니다.')
      const updated = { ...current, ...payload, boardId }
      mockBoards = mockBoards.map((board) => board.boardId === boardId ? updated : board)
      return updated
    },
  )
}

export async function deleteBoard(boardId: number): Promise<string> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.delete<string>(BOARD_API_PATHS.detail(boardId))
      return data
    },
    () => {
      mockBoards = mockBoards.filter((board) => board.boardId !== boardId)
      mockBoardComments.delete(boardId)
      return '삭제되었습니다.'
    },
  )
}

export async function getMyBoards(params?: {
  page?: number
  size?: number
}): Promise<PageResponseDtoBoardResponseDto> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.get<PageResponseDtoBoardResponseDto>(BOARD_API_PATHS.mine, { params })
      return data
    },
    () => mockPage(mockBoards, params),
  )
}

export async function getBoardComments(boardId: number): Promise<CommentResponseDto[]> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.get<CommentResponseDto[]>(BOARD_API_PATHS.comments(boardId))
      return data
    },
    () => mockBoardComments.get(boardId) ?? [],
  )
}

export async function createBoardComment(
  boardId: number,
  payload: CommentRequestDto
): Promise<CommentResponseDto> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.post<CommentResponseDto>(BOARD_API_PATHS.comments(boardId), payload)
      return data
    },
    () => {
      const comment = { ...payload, commentId: Date.now(), createDate: new Date().toISOString(), targetId: boardId, userId: 'mock-user' }
      mockBoardComments.set(boardId, [...(mockBoardComments.get(boardId) ?? []), comment])
      return comment
    },
  )
}

export async function updateComment(
  commentId: number,
  payload: CommentRequestDto
): Promise<CommentResponseDto> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.put<CommentResponseDto>(BOARD_API_PATHS.commentDetail(commentId), payload)
      return data
    },
    () => {
      for (const [boardId, comments] of mockBoardComments) {
        const index = comments.findIndex((comment) => comment.commentId === commentId)
        if (index >= 0) {
          const updated = { ...comments[index], ...payload, commentId, userId: 'mock-user' }
          mockBoardComments.set(boardId, comments.map((comment, commentIndex) => commentIndex === index ? updated : comment))
          return updated
        }
      }
      const updatedReviewComment = updateMockReviewComment(commentId, payload)
      if (updatedReviewComment) return updatedReviewComment
      throw new Error('댓글을 찾을 수 없습니다.')
    },
  )
}

export async function deleteComment(commentId: number): Promise<string> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.delete<string>(BOARD_API_PATHS.commentDetail(commentId))
      return data
    },
    () => {
      for (const [boardId, comments] of mockBoardComments) {
        mockBoardComments.set(boardId, comments.filter((comment) => comment.commentId !== commentId))
      }
      deleteMockReviewComment(commentId)
      return '삭제되었습니다.'
    },
  )
}
