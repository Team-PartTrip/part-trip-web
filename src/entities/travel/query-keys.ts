export const travelQueryKeys = {
  all: ['travel'] as const,
  countries: () => [...travelQueryKeys.all, 'countries'] as const,
  country: (countryName: string) => [...travelQueryKeys.all, 'country', countryName] as const,
  dday: () => [...travelQueryKeys.all, 'dday'] as const,
  destinationSelector: () => [...travelQueryKeys.all, 'destination-selector'] as const,
  exchangeRate: (countryName: string) => [...travelQueryKeys.all, 'exchange-rate', countryName] as const,
  festivals: (countryName: string, year?: number, month?: number) =>
    [...travelQueryKeys.all, 'festivals', countryName, year ?? null, month ?? null] as const,
  food: (countryName: string) => [...travelQueryKeys.all, 'food', countryName] as const,
  phrase: (countryName: string) => [...travelQueryKeys.all, 'phrase', countryName] as const,
  population: (countryName: string) => [...travelQueryKeys.all, 'population', countryName] as const,
  tourPlaces: (countryName: string, cityName?: string, category?: string) =>
    [...travelQueryKeys.all, 'tour-places', countryName, cityName ?? null, category ?? null] as const,
  weather: (countryName: string) => [...travelQueryKeys.all, 'weather', countryName] as const,
}
