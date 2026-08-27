export const plannerQueryKeys = {
  all: ['planners'] as const,
  list: () => [...plannerQueryKeys.all, 'list'] as const,
  detail: (plannerId: number) => [...plannerQueryKeys.all, 'detail', plannerId] as const,
  members: (plannerId: number) => [...plannerQueryKeys.all, 'members', plannerId] as const,
  confirmedPlaces: (plannerId: number) => [...plannerQueryKeys.all, 'confirmed-places', plannerId] as const,
  votes: (plannerId: number) => [...plannerQueryKeys.all, 'votes', plannerId] as const,
  vote: (plannerId: number, voteId: number) => [...plannerQueryKeys.all, 'vote', plannerId, voteId] as const,
}
