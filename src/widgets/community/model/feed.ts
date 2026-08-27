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

export type CommunityFeedSource = {
  commentCount?: number
  content?: string
  createDate?: string
  images?: string[]
  likeCount?: number
  nickName?: string
  title?: string
  userId?: string
}

function toDateLabel(value?: string) {
  if (!value) return '방금 전'
  return new Date(value).toLocaleDateString('ko-KR')
}

export function toCommunityFeedPost(
  post: CommunityFeedSource,
  category: string,
  id: string,
  fallbackTitle: string,
): CommunityFeedPost {
  return {
    author: post.nickName ?? post.userId ?? '여행자',
    category,
    commentCount: post.commentCount ?? 0,
    content: post.content ?? '',
    createdAt: toDateLabel(post.createDate),
    id,
    imageUrls: post.images ?? [],
    likeCount: post.likeCount ?? 0,
    title: post.title ?? fallbackTitle,
  }
}
