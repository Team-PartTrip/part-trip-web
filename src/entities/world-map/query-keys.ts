export const worldMapQueryKeys = {
  all: ['world-map'] as const,
  country: (countryCode: string) => [...worldMapQueryKeys.all, 'country', countryCode] as const,
  map: () => [...worldMapQueryKeys.all, 'map'] as const,
  stats: () => [...worldMapQueryKeys.all, 'stats'] as const,
}
