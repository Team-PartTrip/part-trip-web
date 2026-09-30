export const travelQueryKeys = {
  all: ['travel'] as const,
  places: (keyword: string) => [...travelQueryKeys.all, 'places', keyword] as const,
  dday: () => [...travelQueryKeys.all, 'dday'] as const,
  festivals: (countryName: string, year?: number, month?: number) =>
    [...travelQueryKeys.all, 'festivals', countryName, year ?? null, month ?? null] as const,
  tourPlaces: (countryName: string, cityName?: string, category?: string) =>
    [...travelQueryKeys.all, 'tour-places', countryName, cityName ?? null, category ?? null] as const,
  moreTourPlaces: (countryName: string, cityName: string, category: string) =>
    [...travelQueryKeys.all, 'more-tour-places', countryName, cityName, category] as const,
  tourPlaceAccessibility: (tourPlaceId: number) => [...travelQueryKeys.all, 'tour-place-accessibility', tourPlaceId] as const,
}
