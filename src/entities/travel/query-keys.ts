export const travelQueryKeys = {
  all: ['travel'] as const,
  countries: (keyword = '') => [...travelQueryKeys.all, 'countries', keyword] as const,
  country: (countryName: string) => [...travelQueryKeys.all, 'country', countryName] as const,
  dday: () => [...travelQueryKeys.all, 'dday'] as const,
  destinationSelector: () => [...travelQueryKeys.all, 'destination-selector'] as const,
  festivals: (countryName: string, year?: number, month?: number) =>
    [...travelQueryKeys.all, 'festivals', countryName, year ?? null, month ?? null] as const,
  tourPlaces: (countryName: string, cityName?: string, category?: string) =>
    [...travelQueryKeys.all, 'tour-places', countryName, cityName ?? null, category ?? null] as const,
}
