export const tripCardQueryKeys = {
  all: ['trip-cards'] as const,
  list: () => [...tripCardQueryKeys.all, 'list'] as const,
  detail: (tripId: number) => [...tripCardQueryKeys.all, 'detail', tripId] as const,
}
