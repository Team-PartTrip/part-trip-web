import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { resolveApiAssetUrl } from '@/entities/file/api'
import catAvatarUrl from '@/shared/assets/community-avatar-cat.png'
import dogAvatarUrl from '@/shared/assets/community-avatar-dog.png'
import { paths } from '@/shared/config'
import { AppShell } from '@/widgets/app-shell'

import type { CommunityFeedPost } from '../model/feed'
import { trendingDestinations } from '../model/trending'
import { useCommunityFeedQuery } from '../model/useCommunityFeed'
import * as S from './CommunityPage.styles'

const categories = ['자유게시판', '여행 후기', '경로/일정 공유'] as const
type Category = (typeof categories)[number]

function PostCard({ onOpen, post }: { onOpen: () => void; post: CommunityFeedPost }) {
  const avatarUrl = post.category === '자유게시판' ? catAvatarUrl : dogAvatarUrl
  const content = (
    <>
      <S.Author><img src={avatarUrl} alt="" /><div><strong>{post.author}</strong><span>{post.createdAt} · {post.category}</span></div></S.Author>
      {post.imageUrls.length > 0 ? (
        <S.PhotoGrid>
          {post.imageUrls.slice(0, 3).map((imageUrl) => <img key={imageUrl} src={resolveApiAssetUrl(imageUrl)} alt="여행 사진" />)}
        </S.PhotoGrid>
      ) : null}
      <S.PhotoCopy><h2>{post.title}</h2><p>{post.content}</p></S.PhotoCopy>
      <S.Reactions><span>♡ <b>{post.likeCount}</b></span><span>▢ <b>{post.commentCount}</b></span></S.Reactions>
    </>
  )

  return (
    <S.PostButton type="button" onClick={onOpen}>
      {post.imageUrls.length > 0 ? <S.PhotoCard>{content}</S.PhotoCard> : <S.QuestionCard>{content}</S.QuestionCard>}
    </S.PostButton>
  )
}

export function CommunityPage() {
  const navigate = useNavigate()
  const [category, setCategory] = useState<Category>('자유게시판')
  const postsQuery = useCommunityFeedQuery(category)
  const posts = postsQuery.data ?? []
  const isLoading = postsQuery.isLoading
  const errorMessage = postsQuery.isError ? '게시글을 불러오지 못했습니다.' : ''

  const handleCategoryChange = (nextCategory: Category) => {
    if (nextCategory === category) return
    setCategory(nextCategory)
  }

  const columns = [posts.filter((_, index) => index % 2 === 0), posts.filter((_, index) => index % 2 === 1)]

  return (
    <AppShell>
      <S.Page>
      <S.Content>
        <h1>커뮤니티</h1>
        <S.Tabs>{categories.map((item) => <button type="button" key={item} className={category === item ? 'active' : ''} onClick={() => handleCategoryChange(item)}>{item}</button>)}</S.Tabs>
        <S.Layout>
          <S.Feed>
            {isLoading ? <S.FeedLoading aria-busy="true" aria-label="게시글 로딩 중"><S.LoadingPost /><S.LoadingPost /></S.FeedLoading> : null}
            {errorMessage ? <S.FeedStatus role="alert">{errorMessage}</S.FeedStatus> : null}
            {!isLoading && !errorMessage && posts.length === 0 ? <S.FeedStatus>등록된 게시글이 없습니다.</S.FeedStatus> : null}
            {columns.map((column, columnIndex) => (
              <S.Column key={columnIndex}>
                {column.map((post) => <PostCard key={post.id} post={post} onOpen={() => navigate({ params: { postId: post.id }, to: '/community/$postId' })} />)}
              </S.Column>
            ))}
          </S.Feed>
          <S.Aside>
            <S.CreateButton type="button" onClick={() => navigate({ to: paths.communityWrite })}>⊕ 게시글 작성하기</S.CreateButton>
            <S.Trending>
              <header><h2>인기 여행지</h2><button type="button" onClick={() => navigate({ to: paths.travelSelect })}>전체보기</button></header>
              {trendingDestinations.map((destination) => <S.Destination key={destination.name}><img src={destination.imageUrl} alt={destination.name.split(', ')[0]} /><div><strong>{destination.name}</strong><span>{destination.description}</span></div></S.Destination>)}
            </S.Trending>
          </S.Aside>
        </S.Layout>
      </S.Content>
      </S.Page>
    </AppShell>
  )
}
