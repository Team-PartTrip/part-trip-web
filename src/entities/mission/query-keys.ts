export const missionQueryKeys = {
  all: ['missions'] as const,
  list: () => [...missionQueryKeys.all, 'list'] as const,
  completed: () => [...missionQueryKeys.all, 'completed'] as const,
}
