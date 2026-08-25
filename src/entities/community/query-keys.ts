export const communityQueryKeys = {
  all: ['community'] as const,
  feed: (category: string) => [...communityQueryKeys.all, 'feed', category] as const,
  detail: (postId: string) => [...communityQueryKeys.all, 'detail', postId] as const,
}
