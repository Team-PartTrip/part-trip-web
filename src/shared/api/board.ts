import { apiClient } from './client'
import { runtimeConfig } from '@shared/config'

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

// Mock 데이터 정의 (useMockApi가 true일 때 임시로 사용)
const mockBoards: BoardResponseDto[] = [
  {
    boardId: 1,
    userId: 'user1',
    nickName: '동반자 구함',
    title: '같이 8월에 싱가포르 가실 분!',
    content: '일정 맞춰서 같이 맛있는 것도 먹고 액티비티도 하고 싶어요.',
    images: [],
    likeCount: 3,
    liked: false,
    commentCount: 1,
    createDate: '2026-07-06T10:00:00Z',
    updateDate: '2026-07-06T10:00:00Z',
  }
]

const mockBoardComments: Record<number, CommentResponseDto[]> = {
  1: [
    {
      commentId: 1,
      targetType: 'BOARD',
      targetId: 1,
      parentCommentId: undefined,
      userId: 'user3',
      nickName: '관심자',
      content: '저 8월 중순에 가는데 쪽지 주세요!',
      createDate: '2026-07-06T12:00:00Z',
    }
  ]
}

export async function getBoards(params?: {
  page?: number
  size?: number
}): Promise<PageResponseDtoBoardResponseDto> {
  if (runtimeConfig.useMockApi) {
    return {
      content: mockBoards,
      page: params?.page ?? 0,
      size: params?.size ?? 20,
      totalElements: mockBoards.length,
      totalPages: 1,
      hasNext: false,
    }
  }
  const { data } = await apiClient.get<PageResponseDtoBoardResponseDto>(BOARD_API_PATHS.base, { params })
  return data
}

export async function createBoard(payload: BoardRequestDto): Promise<BoardResponseDto> {
  if (runtimeConfig.useMockApi) {
    const newBoard: BoardResponseDto = {
      ...payload,
      boardId: Date.now(),
      userId: 'mock-user',
      nickName: '임시유저',
      likeCount: 0,
      liked: false,
      commentCount: 0,
      createDate: new Date().toISOString(),
      updateDate: new Date().toISOString(),
    }
    mockBoards.push(newBoard)
    return newBoard
  }
  const { data } = await apiClient.post<BoardResponseDto>(BOARD_API_PATHS.base, payload)
  return data
}

export async function getBoard(boardId: number): Promise<BoardResponseDto> {
  if (runtimeConfig.useMockApi) {
    const found = mockBoards.find(b => b.boardId === boardId)
    if (!found) throw new Error('Board not found')
    return found
  }
  const { data } = await apiClient.get<BoardResponseDto>(BOARD_API_PATHS.detail(boardId))
  return data
}

export async function updateBoard(boardId: number, payload: BoardRequestDto): Promise<BoardResponseDto> {
  if (runtimeConfig.useMockApi) {
    const index = mockBoards.findIndex(b => b.boardId === boardId)
    if (index === -1) throw new Error('Board not found')
    const updated: BoardResponseDto = {
      ...mockBoards[index],
      ...payload,
      updateDate: new Date().toISOString(),
    }
    mockBoards[index] = updated
    return updated
  }
  const { data } = await apiClient.put<BoardResponseDto>(BOARD_API_PATHS.detail(boardId), payload)
  return data
}

export async function deleteBoard(boardId: number): Promise<string> {
  if (runtimeConfig.useMockApi) {
    const index = mockBoards.findIndex(b => b.boardId === boardId)
    if (index === -1) throw new Error('Board not found')
    mockBoards.splice(index, 1)
    return 'success'
  }
  const { data } = await apiClient.delete<string>(BOARD_API_PATHS.detail(boardId))
  return data
}

export async function getMyBoards(params?: {
  page?: number
  size?: number
}): Promise<PageResponseDtoBoardResponseDto> {
  if (runtimeConfig.useMockApi) {
    return {
      content: mockBoards.filter(b => b.userId === 'mock-user' || b.userId === 'user1'),
      page: params?.page ?? 0,
      size: params?.size ?? 20,
      totalElements: mockBoards.length,
      totalPages: 1,
      hasNext: false,
    }
  }
  const { data } = await apiClient.get<PageResponseDtoBoardResponseDto>(BOARD_API_PATHS.mine, { params })
  return data
}

export async function getBoardComments(boardId: number): Promise<CommentResponseDto[]> {
  if (runtimeConfig.useMockApi) {
    return mockBoardComments[boardId] || []
  }
  const { data } = await apiClient.get<CommentResponseDto[]>(BOARD_API_PATHS.comments(boardId))
  return data
}

export async function createBoardComment(
  boardId: number,
  payload: CommentRequestDto
): Promise<CommentResponseDto> {
  if (runtimeConfig.useMockApi) {
    const newComment: CommentResponseDto = {
      commentId: Date.now(),
      targetType: 'BOARD',
      targetId: boardId,
      parentCommentId: payload.parentCommentId,
      userId: 'mock-user',
      nickName: '임시댓글러',
      content: payload.content || '',
      createDate: new Date().toISOString(),
    }
    if (!mockBoardComments[boardId]) {
      mockBoardComments[boardId] = []
    }
    mockBoardComments[boardId].push(newComment)

    // 댓글 수 증가
    const board = mockBoards.find(b => b.boardId === boardId)
    if (board) {
      board.commentCount = (board.commentCount || 0) + 1
    }

    return newComment
  }
  const { data } = await apiClient.post<CommentResponseDto>(BOARD_API_PATHS.comments(boardId), payload)
  return data
}

export async function updateComment(
  commentId: number,
  payload: CommentRequestDto
): Promise<CommentResponseDto> {
  if (runtimeConfig.useMockApi) {
    // 모든 Mock 댓글 중 찾기
    for (const key in mockBoardComments) {
      const comments = mockBoardComments[key]
      const found = comments.find(c => c.commentId === commentId)
      if (found) {
        found.content = payload.content;
        return found;
      }
    }
    throw new Error('Comment not found')
  }
  const { data } = await apiClient.put<CommentResponseDto>(BOARD_API_PATHS.commentDetail(commentId), payload)
  return data
}

export async function deleteComment(commentId: number): Promise<string> {
  if (runtimeConfig.useMockApi) {
    for (const key in mockBoardComments) {
      const comments = mockBoardComments[key]
      const index = comments.findIndex(c => c.commentId === commentId)
      if (index !== -1) {
        comments.splice(index, 1)
        return 'success'
      }
    }
    throw new Error('Comment not found')
  }
  const { data } = await apiClient.delete<string>(BOARD_API_PATHS.commentDetail(commentId))
  return data
}
