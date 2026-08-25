import { useState, type FormEvent } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  useCommunityDetailQuery,
  useCreateBoardCommentMutation,
  useCreateReviewCommentMutation,
  useDeleteBoardMutation,
  useDeleteCommentMutation,
  useDeleteReviewMutation,
  useToggleLikeMutation,
  useUpdateBoardMutation,
  useUpdateCommentMutation,
  useUpdateReviewMutation,
} from '@/entities/community'
import { getProfile } from '@/entities/user/api'
import { resolveApiAssetUrl } from '@/entities/file/api'
import { useCreateSharedTripCommentMutation, useImportTripMutation } from '@/entities/trip-card'
import catAvatarUrl from '@/shared/assets/community-avatar-cat.png'
import { paths } from '@/shared/config'
import { AppShell } from '@/widgets/app-shell'

import * as S from './CommunityDetailPage.styles'

export function CommunityDetailPage() {
  const navigate = useNavigate()
  const { postId = '' } = useParams({ strict: false })
  const postQuery = useCommunityDetailQuery(postId)
  const profileQuery = useQuery({ queryKey: ['user', 'source'], queryFn: getProfile })
  const post = postQuery.data?.post ?? null
  const comments = postQuery.data?.comments ?? []
  const [comment, setComment] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const currentUserId = profileQuery.data?.userId ?? ''
  const [isEditingPost, setIsEditingPost] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editingCommentContent, setEditingCommentContent] = useState('')
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
  const isLoading = postQuery.isLoading
  const isSubmittingComment = createBoardCommentMutation.isPending
    || createReviewCommentMutation.isPending
    || createSharedTripCommentMutation.isPending
  const isMutating = likeMutation.isPending
    || isSubmittingComment
    || updateBoardMutation.isPending
    || updateReviewMutation.isPending
    || deleteBoardMutation.isPending
    || deleteReviewMutation.isPending
    || updateCommentMutation.isPending
    || deleteCommentMutation.isPending
    || importTripMutation.isPending

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
        await createBoardCommentMutation.mutateAsync({ boardId: post.id, payload })
      } else if (post.type === 'review') {
        await createReviewCommentMutation.mutateAsync({ reviewId: post.id, payload })
      } else {
        await createSharedTripCommentMutation.mutateAsync({ tripId: post.id, payload })
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
    if (!post || post.type === 'trip' || !editTitle.trim() || !editContent.trim()) return
    try {
      setErrorMessage('')
      if (post.type === 'board') {
        await updateBoardMutation.mutateAsync({ boardId: post.id, payload: { content: editContent.trim(), images: post.imageUrls, title: editTitle.trim() } })
      } else {
        await updateReviewMutation.mutateAsync({ reviewId: post.id, payload: {
            content: editContent.trim(),
            countryInfoId: post.countryInfoId,
            images: post.imageUrls,
            rating: post.rating ?? 5,
            title: editTitle.trim(),
          } })
      }
      setIsEditingPost(false)
    } catch {
      setErrorMessage('게시글을 수정하지 못했습니다.')
    }
  }

  const handlePostDelete = async () => {
    if (!post || post.type === 'trip' || !window.confirm('이 게시글을 삭제하시겠습니까?')) return
    try {
      if (post.type === 'board') await deleteBoardMutation.mutateAsync(post.id)
      else await deleteReviewMutation.mutateAsync(post.id)
      navigate({ to: paths.community, replace: true })
    } catch {
      setErrorMessage('게시글을 삭제하지 못했습니다.')
    }
  }

  const handleCommentUpdate = async (commentId: number) => {
    if (!editingCommentContent.trim()) return
    try {
      await updateCommentMutation.mutateAsync({ commentId, payload: { content: editingCommentContent.trim() } })
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
      if (imported.tripId) navigate({ params: { recordId: String(imported.tripId) }, to: '/record/$recordId' })
    } catch {
      setErrorMessage('여행 일정을 가져오지 못했습니다.')
    }
  }

  return (
    <AppShell>
      <S.Page>
      <S.Content>
        <S.TopBar>
          <S.BackButton type="button" onClick={() => navigate({ to: paths.community })}>← 커뮤니티</S.BackButton>
          <S.WriteLink to={paths.communityWrite}>새 글 작성</S.WriteLink>
        </S.TopBar>

        {errorMessage || postQuery.isError ? <S.StateCard role="alert">{errorMessage || '게시글을 불러오지 못했습니다.'}</S.StateCard> : null}
        {isLoading ? (
          <S.StateCard aria-live="polite">게시글을 불러오고 있습니다.</S.StateCard>
        ) : post ? (
          <S.Layout>
            <S.Article>
              {currentUserId && post.userId === currentUserId && post.type !== 'trip' ? (
                <S.OwnerActions>
                  <button type="button" onClick={startPostEdit}>수정</button>
                  <button type="button" disabled={isMutating} onClick={() => void handlePostDelete()}>삭제</button>
                </S.OwnerActions>
              ) : null}
              <S.Author>
                <img src={catAvatarUrl} alt="" />
                <div><strong>{post.author}</strong><span>{post.createdAt} · {post.category}</span></div>
              </S.Author>
              <S.Destination>{post.destination}</S.Destination>
              {isEditingPost ? (
                <S.EditForm onSubmit={(event) => void handlePostUpdate(event)}>
                  <input value={editTitle} onChange={(event) => setEditTitle(event.target.value)} maxLength={80} aria-label="제목" />
                  <textarea value={editContent} onChange={(event) => setEditContent(event.target.value)} maxLength={1200} aria-label="내용" />
                  <div><button type="button" onClick={() => setIsEditingPost(false)}>취소</button><button type="submit" disabled={isMutating}>저장</button></div>
                </S.EditForm>
              ) : <><h1>{post.title}</h1><p>{post.content}</p></>}
              {post.imageUrls.length > 0 ? (
                <S.ImageGrid $count={post.imageUrls.length}>
                  {post.imageUrls.map((imageUrl) => <img key={imageUrl} src={resolveApiAssetUrl(imageUrl)} alt={`${post.destination} 여행`} />)}
                </S.ImageGrid>
              ) : null}
              <S.ReactionRow>
                <button type="button" className={post.liked ? 'active' : ''} onClick={() => void handleLike()}>
                  {post.liked ? '♥' : '♡'} 좋아요 {post.likeCount}
                </button>
                <span>댓글 {comments.length}</span>
                {post.type === 'trip' ? <button type="button" disabled={isMutating} onClick={() => void handleImportTrip()}>내 기록으로 가져오기</button> : null}
              </S.ReactionRow>
            </S.Article>

            <S.Comments>
              <h2>댓글</h2>
              <S.CommentForm onSubmit={(event) => void handleComment(event)}>
                <input value={comment} onChange={(event) => setComment(event.target.value)} placeholder="댓글을 입력하세요." />
                <button type="submit" disabled={isSubmittingComment || !comment.trim()}>{isSubmittingComment ? '등록 중' : '등록'}</button>
              </S.CommentForm>
              {comments.length > 0 ? comments.map((item, index) => (
                <S.Comment key={item.commentId ?? index}>
                  <div><strong>{item.nickName ?? item.userId ?? '여행자'}</strong><span>{item.createDate}</span></div>
                  {editingCommentId === item.commentId ? (
                    <S.CommentEdit>
                      <input value={editingCommentContent} onChange={(event) => setEditingCommentContent(event.target.value)} aria-label="댓글 수정" />
                      <button type="button" onClick={() => setEditingCommentId(null)}>취소</button>
                      <button type="button" disabled={isMutating} onClick={() => item.commentId && void handleCommentUpdate(item.commentId)}>저장</button>
                    </S.CommentEdit>
                  ) : <p>{item.content}</p>}
                  {currentUserId && item.userId === currentUserId && editingCommentId !== item.commentId ? (
                    <S.CommentActions>
                      <button type="button" onClick={() => { setEditingCommentId(item.commentId ?? null); setEditingCommentContent(item.content ?? '') }}>수정</button>
                      <button type="button" disabled={isMutating} onClick={() => item.commentId && void handleCommentDelete(item.commentId)}>삭제</button>
                    </S.CommentActions>
                  ) : null}
                </S.Comment>
              )) : <S.EmptyComment>첫 댓글을 남겨보세요.</S.EmptyComment>}
            </S.Comments>
          </S.Layout>
        ) : !errorMessage ? (
          <S.StateCard>
            <h1>여행 게시글을 찾을 수 없습니다.</h1>
            <button type="button" onClick={() => navigate({ to: paths.community })}>목록으로 돌아가기</button>
          </S.StateCard>
        ) : null}
      </S.Content>
      </S.Page>
    </AppShell>
  )
}
