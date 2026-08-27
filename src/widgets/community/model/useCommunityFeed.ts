import { queryOptions, useQuery } from '@tanstack/react-query'

import { getBoards, getReviews } from '@/entities/community'
import { communityQueryKeys } from '@/entities/community'
import { listSharedTrips } from '@/entities/trip-card'

import { toCommunityFeedPost, type CommunityFeedPost } from './feed'

export async function getCommunityFeed(category: string): Promise<CommunityFeedPost[]> {
  if (category === '자유게시판') {
    const page = await getBoards({ page: 0, size: 20 })
    return (page.content ?? []).map((post) =>
      toCommunityFeedPost(post, category, `board-${post.boardId}`, '제목 없는 게시글'),
    )
  }

  if (category === '여행 후기') {
    const page = await getReviews({ page: 0, size: 20 })
    return (page.content ?? []).map((post) =>
      toCommunityFeedPost(post, category, `review-${post.reviewId}`, '제목 없는 여행 후기'),
    )
  }

  const page = await listSharedTrips({ page: 0, size: 20 })
  return (page.content ?? []).map((post) =>
    toCommunityFeedPost(post, category, `trip-${post.tripId}`, '공유 여행 일정'),
  )
}

export function useCommunityFeedQuery(category: string) {
  return useQuery(queryOptions({
    queryKey: communityQueryKeys.feed(category),
    queryFn: () => getCommunityFeed(category),
  }))
}
