import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getBoards,
  getReviews,
  resolveApiAssetUrl,
  listSharedTrips,
} from '@shared/api'
import catAvatarUrl from '@shared/assets/community-avatar-cat.png'
import dogAvatarUrl from '@shared/assets/community-avatar-dog.png'
import communityDaNangUrl from '@shared/assets/community-destination-danang.jpg'
import communitySwissUrl from '@shared/assets/community-destination-swiss.jpg'
import communityTokyoUrl from '@shared/assets/community-destination-tokyo.jpg'
import { createCommunityDetailPath, paths } from '@shared/config'
import { AppShell } from '@widgets/app-shell'

import * as S from './CommunityPage.styles'

const categories = ['자유게시판', '여행 후기', '경로/일정 공유'] as const
type Category = (typeof categories)[number]

type FeedPost = {
  author: string
  category: Category
  commentCount: number
  content: string
  createdAt: string
  id: string
  imageUrls: string[]
  likeCount: number
  title: string
}

function toDateLabel(value?: string) {
  if (!value) return '방금 전'
  return new Date(value).toLocaleDateString('ko-KR')
}

async function loadPosts(category: Category): Promise<FeedPost[]> {
  if (category === '자유게시판') {
    const page = await getBoards({ page: 0, size: 20 })
    return (page.content ?? []).map((post) => ({
      author: post.nickName ?? post.userId ?? '여행자',
      category,
      commentCount: post.commentCount ?? 0,
      content: post.content ?? '',
      createdAt: toDateLabel(post.createDate),
      id: `board-${post.boardId}`,
      imageUrls: post.images ?? [],
      likeCount: post.likeCount ?? 0,
      title: post.title ?? '제목 없는 게시글',
    }))
  }

  if (category === '여행 후기') {
    const page = await getReviews({ page: 0, size: 20 })
    return (page.content ?? []).map((post) => ({
      author: post.nickName ?? post.userId ?? '여행자',
      category,
      commentCount: post.commentCount ?? 0,
      content: post.content ?? '',
      createdAt: toDateLabel(post.createDate),
      id: `review-${post.reviewId}`,
      imageUrls: post.images ?? [],
      likeCount: post.likeCount ?? 0,
      title: post.title ?? '제목 없는 여행 후기',
    }))
  }

  const page = await listSharedTrips({ page: 0, size: 20 })
  return (page.content ?? []).map((post) => ({
    author: post.nickName ?? post.userId ?? '여행자',
    category,
    commentCount: post.commentCount ?? 0,
    content: post.content ?? '',
    createdAt: toDateLabel(post.createDate),
    id: `trip-${post.tripId}`,
    imageUrls: post.images ?? [],
    likeCount: post.likeCount ?? 0,
    title: post.title ?? '공유 여행 일정',
  }))
}

function PostCard({ onOpen, post }: { onOpen: () => void; post: FeedPost }) {
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
  const [posts, setPosts] = useState<FeedPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true
    void loadPosts(category)
      .then((nextPosts) => { if (isMounted) setPosts(nextPosts) })
      .catch(() => { if (isMounted) setErrorMessage('게시글을 불러오지 못했습니다.') })
      .finally(() => { if (isMounted) setIsLoading(false) })
    return () => { isMounted = false }
  }, [category])

  const handleCategoryChange = (nextCategory: Category) => {
    if (nextCategory === category) return
    setCategory(nextCategory)
    setIsLoading(true)
    setErrorMessage('')
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
            {isLoading ? <S.FeedStatus>게시글을 불러오는 중입니다.</S.FeedStatus> : null}
            {errorMessage ? <S.FeedStatus role="alert">{errorMessage}</S.FeedStatus> : null}
            {!isLoading && !errorMessage && posts.length === 0 ? <S.FeedStatus>등록된 게시글이 없습니다.</S.FeedStatus> : null}
            {columns.map((column, columnIndex) => (
              <S.Column key={columnIndex}>
                {column.map((post) => <PostCard key={post.id} post={post} onOpen={() => navigate(createCommunityDetailPath(post.id))} />)}
              </S.Column>
            ))}
          </S.Feed>
          <S.Aside>
            <S.CreateButton type="button" onClick={() => navigate(paths.communityWrite)}>⊕ 게시글 작성하기</S.CreateButton>
            <S.Trending>
              <header><h2>인기 여행지</h2><button type="button">전체보기</button></header>
              <S.Destination><img src={communityTokyoUrl} alt="도쿄" /><div><strong>도쿄, 일본</strong><span>최근 24시간 1.2k+ 언급</span></div></S.Destination>
              <S.Destination><img src={communityDaNangUrl} alt="다낭" /><div><strong>다낭, 베트남</strong><span>인기 급상승 중 🔥</span></div></S.Destination>
              <S.Destination><img src={communitySwissUrl} alt="인터라켄" /><div><strong>인터라켄, 스위스</strong><span>여름 휴가 추천 1위</span></div></S.Destination>
            </S.Trending>
          </S.Aside>
        </S.Layout>
      </S.Content>
      </S.Page>
    </AppShell>
  )
}
