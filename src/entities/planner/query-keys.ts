export const plannerQueryKeys = {
  all: ['planners'] as const,
  blocks: () => [...plannerQueryKeys.all, 'blocks'] as const,
  survey: (plannerId: number) => [...plannerQueryKeys.all, 'survey', plannerId] as const,
  warnings: (plannerId: number) => [...plannerQueryKeys.all, 'warnings', plannerId] as const,
  invitations: () => [...plannerQueryKeys.all, 'invitations'] as const,
  list: () => [...plannerQueryKeys.all, 'list'] as const,
  detail: (plannerId: number) => [...plannerQueryKeys.all, 'detail', plannerId] as const,
  members: (plannerId: number) => [...plannerQueryKeys.all, 'members', plannerId] as const,
  schedule: (plannerId: number) => [...plannerQueryKeys.all, 'schedule', plannerId] as const,
  confirmedPlaces: (plannerId: number) => [...plannerQueryKeys.all, 'confirmed-places', plannerId] as const,
  scheduleCandidates: (plannerId: number, date: string, query: string) =>
    [...plannerQueryKeys.all, 'schedule-candidates', plannerId, date, query] as const,
}
