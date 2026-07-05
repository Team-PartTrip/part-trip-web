import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  getCommunityPostMock,
  type CommunityPost,
} from '@shared/api'
import logoUrl from '@shared/assets/logo.png'
import { paths } from '@shared/config'
import { MENUS, Sidebar } from '@widgets/sidebar'

import * as S from './CommunityDetailPage.styles'

export function CommunityDetailPage() {
  const navigate = useNavigate()
  const { postId = '' } = useParams()
  const [post, setPost] = useState<CommunityPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    let isMounted = true

    void getCommunityPostMock(postId).then((nextPost) => {
      if (isMounted) {
        setPost(nextPost)
        setIsLoading(false)
      }
    })

    return () => {
      isMounted = false
    }
  }, [postId])

  return (
    <S.Page>
      <Sidebar logo={<S.Logo src={logoUrl} alt="PartTrip" />} menus={MENUS} />
      <S.Content>
        <S.TopBar>
          <S.BackButton type="button" onClick={() => navigate(paths.community)}>
            ← 커뮤니티
          </S.BackButton>
          <S.WriteLink to={paths.communityWrite}>새 글 작성</S.WriteLink>
        </S.TopBar>

        {isLoading ? (
          <S.StateCard aria-live="polite">게시글을 불러오고 있습니다.</S.StateCard>
        ) : post ? (
          <S.Layout>
            <S.Article>
              <S.Author>
                <img src={post.avatarUrl} alt="" />
                <div>
                  <strong>{post.author}</strong>
                  <span>{post.createdAt} · {post.category}</span>
                </div>
              </S.Author>
              <S.Destination>{post.destination}</S.Destination>
              <h1>{post.title}</h1>
              <p>{post.content}</p>
              {post.imageUrls.length > 0 ? (
                <S.ImageGrid $count={post.imageUrls.length}>
                  {post.imageUrls.map((imageUrl) => (
                    <img key={imageUrl} src={imageUrl} alt={`${post.destination} 여행`} />
                  ))}
                </S.ImageGrid>
              ) : null}
              <S.ReactionRow>
                <button type="button" className={isLiked ? 'active' : ''} onClick={() => setIsLiked((value) => !value)}>
                  {isLiked ? '♥' : '♡'} 좋아요 {post.likeCount + (isLiked ? 1 : 0)}
                </button>
                <span>댓글 {post.comments.length}</span>
              </S.ReactionRow>
            </S.Article>

            <S.Comments>
              <h2>댓글</h2>
              {post.comments.length > 0 ? post.comments.map((comment) => (
                <S.Comment key={comment.id}>
                  <div><strong>{comment.author}</strong><span>{comment.time}</span></div>
                  <p>{comment.content}</p>
                </S.Comment>
              )) : <S.EmptyComment>첫 댓글을 남겨보세요.</S.EmptyComment>}
            </S.Comments>
          </S.Layout>
        ) : (
          <S.StateCard>
            <h1>게시글을 찾을 수 없습니다.</h1>
            <p>삭제되었거나 잘못된 주소입니다.</p>
            <button type="button" onClick={() => navigate(paths.community)}>목록으로 돌아가기</button>
          </S.StateCard>
        )}
      </S.Content>
    </S.Page>
  )
}
