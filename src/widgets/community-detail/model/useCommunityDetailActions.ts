import type { Dispatch, FormEvent, SetStateAction } from 'react'
import { useNavigate } from '@tanstack/react-router'

import {
  useCreateBoardCommentMutation,
  useCreateReviewCommentMutation,
  useDeleteBoardMutation,
  useDeleteCommentMutation,
  useDeleteReviewMutation,
  useToggleLikeMutation,
  useUpdateBoardMutation,
  useUpdateCommentMutation,
  useUpdateReviewMutation,
  type CommunityDetailPost,
} from '@/entities/community'
import {
  useCreateSharedTripCommentMutation,
  useImportTripMutation,
} from '@/entities/trip-card'
import { paths } from '@/shared/config'

type CommunityDetailActionArgs = {
  comment: string
  editContent: string
  editTitle: string
  editingCommentContent: string
  post: CommunityDetailPost | null
  setComment: Dispatch<SetStateAction<string>>
  setEditContent: Dispatch<SetStateAction<string>>
  setEditTitle: Dispatch<SetStateAction<string>>
  setEditingCommentContent: Dispatch<SetStateAction<string>>
  setEditingCommentId: Dispatch<SetStateAction<number | null>>
  setErrorMessage: Dispatch<SetStateAction<string>>
  setIsEditingPost: Dispatch<SetStateAction<boolean>>
}

export function useCommunityDetailActions({
  comment,
  editContent,
  editTitle,
  editingCommentContent,
  post,
  setComment,
  setEditContent,
  setEditTitle,
  setEditingCommentContent,
  setEditingCommentId,
  setErrorMessage,
  setIsEditingPost,
}: CommunityDetailActionArgs) {
  const navigate = useNavigate()
  const likeMutation = useToggleLikeMutation()
  const createBoardCommentMutation = useCreateBoardCommentMutation()
  const createReviewCommentMutation = useCreateReviewCommentMutation()
  const createSharedTripCommentMutation = useCreateSharedTripCommentMutation()
  const updateBoardMutation = useUpdateBoardMutation()
  const updateReviewMutation = useUpdateReviewMutation()
  const deleteBoardMutation = useDeleteBoardMutation()
  const deleteReviewMutation = useDeleteReviewMutation()
  const updateCommentMutation = useUpdateCommentMutation()
  const deleteCommentMutation = useDeleteCommentMutation()
  const importTripMutation = useImportTripMutation()

  const isSubmittingComment =
    createBoardCommentMutation.isPending ||
    createReviewCommentMutation.isPending ||
    createSharedTripCommentMutation.isPending
  const isMutating =
    likeMutation.isPending ||
    isSubmittingComment ||
    updateBoardMutation.isPending ||
    updateReviewMutation.isPending ||
    deleteBoardMutation.isPending ||
    deleteReviewMutation.isPending ||
    updateCommentMutation.isPending ||
    deleteCommentMutation.isPending ||
    importTripMutation.isPending

  const handleLike = async () => {
    if (!post) return
    try {
      setErrorMessage('')
      await likeMutation.mutateAsync({
        targetId: post.id,
        targetType: post.type === 'trip' ? 'TRIP' : post.type.toUpperCase(),
      })
    } catch {
      setErrorMessage('좋아요를 처리하지 못했습니다.')
    }
  }

  const handleComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!post || !comment.trim()) return

    try {
      const payload = { content: comment.trim() }
      if (post.type === 'board') {
        await createBoardCommentMutation.mutateAsync({
          boardId: post.id,
          payload,
        })
      } else if (post.type === 'review') {
        await createReviewCommentMutation.mutateAsync({
          reviewId: post.id,
          payload,
        })
      } else {
        await createSharedTripCommentMutation.mutateAsync({
          tripId: post.id,
          payload,
        })
      }
      setComment('')
    } catch {
      setErrorMessage('댓글을 등록하지 못했습니다.')
    }
  }

  const startPostEdit = () => {
    if (!post) return
    setEditTitle(post.title)
    setEditContent(post.content)
    setIsEditingPost(true)
  }

  const handlePostUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!post || post.type === 'trip' || !editTitle.trim() || !editContent.trim()) {
      return
    }

    try {
      setErrorMessage('')
      if (post.type === 'board') {
        await updateBoardMutation.mutateAsync({
          boardId: post.id,
          payload: {
            content: editContent.trim(),
            images: post.imageUrls,
            title: editTitle.trim(),
          },
        })
      } else {
        await updateReviewMutation.mutateAsync({
          reviewId: post.id,
          payload: {
            content: editContent.trim(),
            countryInfoId: post.countryInfoId,
            images: post.imageUrls,
            rating: post.rating ?? 5,
            title: editTitle.trim(),
          },
        })
      }
      setIsEditingPost(false)
    } catch {
      setErrorMessage('게시글을 수정하지 못했습니다.')
    }
  }

  const handlePostDelete = async () => {
    if (
      !post ||
      post.type === 'trip' ||
      !window.confirm('이 게시글을 삭제하시겠습니까?')
    ) {
      return
    }

    try {
      if (post.type === 'board') {
        await deleteBoardMutation.mutateAsync(post.id)
      } else {
        await deleteReviewMutation.mutateAsync(post.id)
      }
      navigate({ to: paths.community, replace: true })
    } catch {
      setErrorMessage('게시글을 삭제하지 못했습니다.')
    }
  }

  const handleCommentUpdate = async (commentId: number) => {
    if (!editingCommentContent.trim()) return

    try {
      await updateCommentMutation.mutateAsync({
        commentId,
        payload: { content: editingCommentContent.trim() },
      })
      setEditingCommentId(null)
      setEditingCommentContent('')
    } catch {
      setErrorMessage('댓글을 수정하지 못했습니다.')
    }
  }

  const handleCommentDelete = async (commentId: number) => {
    if (!window.confirm('이 댓글을 삭제하시겠습니까?')) return

    try {
      await deleteCommentMutation.mutateAsync(commentId)
    } catch {
      setErrorMessage('댓글을 삭제하지 못했습니다.')
    }
  }

  const handleImportTrip = async () => {
    if (!post) return

    try {
      const imported = await importTripMutation.mutateAsync(post.id)
      if (imported.tripId) {
        navigate({
          params: { recordId: String(imported.tripId) },
          to: '/record/$recordId',
        })
      }
    } catch {
      setErrorMessage('여행 일정을 가져오지 못했습니다.')
    }
  }

  return {
    handleComment,
    handleCommentDelete,
    handleCommentUpdate,
    handleImportTrip,
    handleLike,
    handlePostDelete,
    handlePostUpdate,
    isMutating,
    isSubmittingComment,
    startPostEdit,
  }
}
