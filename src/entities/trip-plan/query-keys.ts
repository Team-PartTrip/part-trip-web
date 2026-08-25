export const tripPlanQueryKeys = {
  all: ['trip-plans'] as const,
  mine: () => [...tripPlanQueryKeys.all, 'mine'] as const,
  detail: (tripId: number) => [...tripPlanQueryKeys.all, 'detail', tripId] as const,
}
