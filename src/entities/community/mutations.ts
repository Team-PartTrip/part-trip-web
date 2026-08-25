import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  createBoard,
  createBoardComment,
  createReview,
  createReviewComment,
  deleteBoard,
  deleteComment,
  deleteReview,
  toggleLike,
  updateBoard,
  updateComment,
  updateReview,
  type BoardRequestDto,
  type CommentRequestDto,
  type ReviewRequestDto,
} from './api'
import { communityQueryKeys } from './query-keys'

export function useCreateBoardMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: BoardRequestDto) => createBoard(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: communityQueryKeys.all }),
  })
}

export function useCreateReviewMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ReviewRequestDto) => createReview(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: communityQueryKeys.all }),
  })
}

export function useToggleLikeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: toggleLike,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: communityQueryKeys.all }),
  })
}

export function useCreateBoardCommentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ boardId, payload }: { boardId: number; payload: CommentRequestDto }) =>
      createBoardComment(boardId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: communityQueryKeys.all }),
  })
}

export function useCreateReviewCommentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ reviewId, payload }: { reviewId: number; payload: CommentRequestDto }) =>
      createReviewComment(reviewId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: communityQueryKeys.all }),
  })
}

export function useUpdateBoardMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ boardId, payload }: { boardId: number; payload: BoardRequestDto }) =>
      updateBoard(boardId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: communityQueryKeys.all }),
  })
}

export function useUpdateReviewMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ reviewId, payload }: { reviewId: number; payload: ReviewRequestDto }) =>
      updateReview(reviewId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: communityQueryKeys.all }),
  })
}

export function useDeleteBoardMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (boardId: number) => deleteBoard(boardId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: communityQueryKeys.all }),
  })
}

export function useDeleteReviewMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (reviewId: number) => deleteReview(reviewId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: communityQueryKeys.all }),
  })
}

export function useUpdateCommentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ commentId, payload }: { commentId: number; payload: CommentRequestDto }) =>
      updateComment(commentId, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: communityQueryKeys.all }),
  })
}

export function useDeleteCommentMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: communityQueryKeys.all }),
  })
}
