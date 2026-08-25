export const travelQueryKeys = {
  all: ['travel'] as const,
  countries: () => [...travelQueryKeys.all, 'countries'] as const,
  dday: () => [...travelQueryKeys.all, 'dday'] as const,
  destinationSelector: () => [...travelQueryKeys.all, 'destination-selector'] as const,
  festivals: (countryName: string) => [...travelQueryKeys.all, 'festivals', countryName] as const,
}
