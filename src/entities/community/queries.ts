import { queryOptions, useQuery } from '@tanstack/react-query'

import {
  getBoard,
  getBoardComments,
  getBoards,
  getReview,
  getReviewComments,
  getReviews,
  type CommentResponseDto,
} from './api'
import { getSharedTripComments, getSharedTripDetail, listSharedTrips } from '../trip-card/api'
import { communityQueryKeys } from './query-keys'
import { parseCommunityPostId, type CommunityPostKind } from './post-id'

export { parseCommunityPostId } from './post-id'
export type { CommunityPostKind } from './post-id'

export type CommunityFeedPost = {
  author: string
  category: string
  commentCount: number
  content: string
  createdAt: string
  id: string
  imageUrls: string[]
  likeCount: number
  title: string
}

export type CommunityDetailPost = {
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
  type: CommunityPostKind
  userId: string
}

export type CommunityDetailQueryData = {
  comments: CommentResponseDto[]
  post: CommunityDetailPost
}

function toDateLabel(value?: string) {
  if (!value) return '방금 전'
  return new Date(value).toLocaleDateString('ko-KR')
}

export async function getCommunityFeed(category: string): Promise<CommunityFeedPost[]> {
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

export async function getCommunityDetail(
  type: CommunityPostKind,
  id: number,
): Promise<CommunityDetailQueryData> {
  if (type === 'board') {
    const [post, comments] = await Promise.all([getBoard(id), getBoardComments(id)])
    return {
      comments,
      post: {
        author: post.nickName ?? post.userId ?? '여행자',
        category: '자유게시판',
        content: post.content ?? '',
        createdAt: post.createDate ?? '',
        destination: '자유게시판',
        id,
        imageUrls: post.images ?? [],
        likeCount: post.likeCount ?? 0,
        liked: post.liked ?? false,
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
      title: post.title ?? '공유 여행 일정',
      type,
      userId: post.userId ?? '',
    },
  }
}

export function useCommunityFeedQuery(category: string) {
  return useQuery(queryOptions({
    queryKey: communityQueryKeys.feed(category),
    queryFn: () => getCommunityFeed(category),
  }))
}
export function useCommunityDetailQuery(postId: string) {
  const parsed = parseCommunityPostId(postId)
  const query = useQuery(queryOptions({
    queryKey: communityQueryKeys.detail(postId),
    queryFn: () => getCommunityDetail(parsed!.type, parsed!.id),
    enabled: Boolean(parsed),
  }))

  return { ...query, isValidPostId: Boolean(parsed) }
}
