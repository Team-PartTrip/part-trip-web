export const tripPlanQueryKeys = {
  all: ['trip-plans'] as const,
  mine: () => [...tripPlanQueryKeys.all, 'mine'] as const,
}
