export const plannerQueryKeys = {
  all: ['planners'] as const,
  list: () => [...plannerQueryKeys.all, 'list'] as const,
  detail: (plannerId: number) => [...plannerQueryKeys.all, 'detail', plannerId] as const,
  members: (plannerId: number) => [...plannerQueryKeys.all, 'members', plannerId] as const,
}
