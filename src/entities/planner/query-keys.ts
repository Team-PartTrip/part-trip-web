export const plannerQueryKeys = {
  all: ['planners'] as const,
  blocks: () => [...plannerQueryKeys.all, 'blocks'] as const,
  invitations: () => [...plannerQueryKeys.all, 'invitations'] as const,
  list: () => [...plannerQueryKeys.all, 'list'] as const,
  detail: (plannerId: number) => [...plannerQueryKeys.all, 'detail', plannerId] as const,
  members: (plannerId: number) => [...plannerQueryKeys.all, 'members', plannerId] as const,
  schedule: (plannerId: number) => [...plannerQueryKeys.all, 'schedule', plannerId] as const,
}
