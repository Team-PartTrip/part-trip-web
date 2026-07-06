import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  createBoardComment,
  createReviewComment,
  createSharedTripComment,
  deleteBoard,
  deleteComment,
  deleteReview,
  getBoard,
  getBoardComments,
  getReview,
  getReviewComments,
  getSharedTripComments,
  getSharedTripDetail,
  getProfile,
  importTrip,
  resolveApiAssetUrl,
  toggleLike,
  updateBoard,
  updateComment,
  updateReview,
  type CommentResponseDto,
} from '@shared/api'
import catAvatarUrl from '@shared/assets/community-avatar-cat.png'
import logoUrl from '@shared/assets/logo.png'
import { createRecordDetailPath, paths } from '@shared/config'
import { MENUS, Sidebar } from '@widgets/sidebar'

import * as S from './CommunityDetailPage.styles'

type PostKind = 'board' | 'review' | 'trip'

type DetailPost = {
  author: string
  category: string
  content: string
  countryInfoId?: number
  createdAt: string
  destination: string
  id: number
  imageUrls: string[]
  likeCount: number
  liked: boolean
  rating?: number
  title: string
  type: PostKind
  userId: string
}

function parsePostId(value: string): { id: number; type: PostKind } | null {
  const [type, id] = value.split('-')
  if ((type === 'board' || type === 'review' || type === 'trip') && Number.isFinite(Number(id))) {
    return { id: Number(id), type }
  }
  return null
}

async function loadPost(type: PostKind, id: number): Promise<{ comments: CommentResponseDto[]; post: DetailPost }> {
  if (type === 'board') {
    const [post, comments] = await Promise.all([getBoard(id), getBoardComments(id)])
    return {
      comments,
      post: {
        author: post.nickName ?? post.userId ?? '여행자',
        category: '자유게시판',
        content: post.content ?? '',
        countryInfoId: undefined,
        createdAt: post.createDate ?? '',
        destination: '자유게시판',
        id,
        imageUrls: post.images ?? [],
        likeCount: post.likeCount ?? 0,
        liked: post.liked ?? false,
        rating: undefined,
        title: post.title ?? '제목 없는 게시글',
        type,
        userId: post.userId ?? '',
      },
    }
  }

  if (type === 'review') {
    const [post, comments] = await Promise.all([getReview(id), getReviewComments(id)])
    return {
      comments,
      post: {
        author: post.nickName ?? post.userId ?? '여행자',
        category: '여행 후기',
        content: post.content ?? '',
        countryInfoId: post.countryInfoId,
        createdAt: post.createDate ?? '',
        destination: [post.cityName, post.countryName].filter(Boolean).join(', '),
        id,
        imageUrls: post.images ?? [],
        likeCount: post.likeCount ?? 0,
        liked: post.liked ?? false,
        rating: post.rating,
        title: post.title ?? '제목 없는 여행 후기',
        type,
        userId: post.userId ?? '',
      },
    }
  }

  const [post, comments] = await Promise.all([getSharedTripDetail(id), getSharedTripComments(id)])
  return {
    comments,
    post: {
      author: post.nickName ?? post.userId ?? '여행자',
      category: '경로/일정 공유',
      content: post.content ?? '',
      countryInfoId: post.countryInfoId,
      createdAt: post.createDate ?? '',
      destination: [post.cityName, post.countryName].filter(Boolean).join(', '),
      id,
      imageUrls: post.images ?? [],
      likeCount: post.likeCount ?? 0,
      liked: post.liked ?? false,
      rating: undefined,
      title: post.title ?? '공유 여행 일정',
      type,
      userId: post.userId ?? '',
    },
  }
}

export function CommunityDetailPage() {
  const navigate = useNavigate()
  const { postId = '' } = useParams()
  const [post, setPost] = useState<DetailPost | null>(null)
  const [comments, setComments] = useState<CommentResponseDto[]>([])
  const [comment, setComment] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(() => Boolean(parsePostId(postId)))
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [currentUserId, setCurrentUserId] = useState('')
  const [isEditingPost, setIsEditingPost] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editingCommentContent, setEditingCommentContent] = useState('')
  const [isMutating, setIsMutating] = useState(false)

  useEffect(() => {
    let isMounted = true
    const parsedPost = parsePostId(postId)
    if (!parsedPost) {
      return () => { isMounted = false }
    }

    void Promise.all([loadPost(parsedPost.type, parsedPost.id), getProfile().catch(() => null)])
      .then(([result, profile]) => {
        if (isMounted) {
          setPost(result.post)
          setComments(result.comments)
          setCurrentUserId(profile?.userId ?? '')
        }
      })
      .catch(() => { if (isMounted) setErrorMessage('게시글을 불러오지 못했습니다.') })
      .finally(() => { if (isMounted) setIsLoading(false) })

    return () => { isMounted = false }
  }, [postId])

  const handleLike = async () => {
    if (!post) return
    try {
      setErrorMessage('')
      const result = await toggleLike({
        targetId: post.id,
        targetType: post.type === 'trip' ? 'TRIP' : post.type.toUpperCase(),
      })
      setPost((current) => current ? { ...current, liked: result.liked ?? current.liked, likeCount: result.likeCount ?? current.likeCount } : current)
    } catch {
      setErrorMessage('좋아요를 처리하지 못했습니다.')
    }
  }

  const handleComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!post || !comment.trim()) return
    try {
      setIsSubmittingComment(true)
      const payload = { content: comment.trim() }
      const created = post.type === 'board'
        ? await createBoardComment(post.id, payload)
        : post.type === 'review'
          ? await createReviewComment(post.id, payload)
          : await createSharedTripComment(post.id, payload)
      setComments((current) => [...current, created])
      setComment('')
    } catch {
      setErrorMessage('댓글을 등록하지 못했습니다.')
    } finally {
      setIsSubmittingComment(false)
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
      setIsMutating(true)
      setErrorMessage('')
      const updated = post.type === 'board'
        ? await updateBoard(post.id, { content: editContent.trim(), images: post.imageUrls, title: editTitle.trim() })
        : await updateReview(post.id, {
            content: editContent.trim(),
            countryInfoId: post.countryInfoId,
            images: post.imageUrls,
            rating: post.rating ?? 5,
            title: editTitle.trim(),
          })
      setPost((current) => current ? {
        ...current,
        content: updated.content ?? editContent.trim(),
        title: updated.title ?? editTitle.trim(),
      } : current)
      setIsEditingPost(false)
    } catch {
      setErrorMessage('게시글을 수정하지 못했습니다.')
    } finally {
      setIsMutating(false)
    }
  }

  const handlePostDelete = async () => {
    if (!post || post.type === 'trip' || !window.confirm('이 게시글을 삭제하시겠습니까?')) return
    try {
      setIsMutating(true)
      if (post.type === 'board') await deleteBoard(post.id)
      else await deleteReview(post.id)
      navigate(paths.community, { replace: true })
    } catch {
      setErrorMessage('게시글을 삭제하지 못했습니다.')
      setIsMutating(false)
    }
  }

  const handleCommentUpdate = async (commentId: number) => {
    if (!editingCommentContent.trim()) return
    try {
      setIsMutating(true)
      const updated = await updateComment(commentId, { content: editingCommentContent.trim() })
      setComments((current) => current.map((item) => item.commentId === commentId ? updated : item))
      setEditingCommentId(null)
      setEditingCommentContent('')
    } catch {
      setErrorMessage('댓글을 수정하지 못했습니다.')
    } finally {
      setIsMutating(false)
    }
  }

  const handleCommentDelete = async (commentId: number) => {
    if (!window.confirm('이 댓글을 삭제하시겠습니까?')) return
    try {
      setIsMutating(true)
      await deleteComment(commentId)
      setComments((current) => current.filter((item) => item.commentId !== commentId))
    } catch {
      setErrorMessage('댓글을 삭제하지 못했습니다.')
    } finally {
      setIsMutating(false)
    }
  }

  const handleImportTrip = async () => {
    if (!post) return
    try {
      setIsMutating(true)
      const imported = await importTrip(post.id)
      if (imported.tripId) navigate(createRecordDetailPath(String(imported.tripId)))
    } catch {
      setErrorMessage('여행 일정을 가져오지 못했습니다.')
    } finally {
      setIsMutating(false)
    }
  }

  return (
    <S.Page>
      <Sidebar logo={<S.Logo src={logoUrl} alt="PartTrip" />} menus={MENUS} />
      <S.Content>
        <S.TopBar>
          <S.BackButton type="button" onClick={() => navigate(paths.community)}>← 커뮤니티</S.BackButton>
          <S.WriteLink to={paths.communityWrite}>새 글 작성</S.WriteLink>
        </S.TopBar>

        {errorMessage ? <S.StateCard role="alert">{errorMessage}</S.StateCard> : null}
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
            <button type="button" onClick={() => navigate(paths.community)}>목록으로 돌아가기</button>
          </S.StateCard>
        ) : null}
      </S.Content>
    </S.Page>
  )
}
