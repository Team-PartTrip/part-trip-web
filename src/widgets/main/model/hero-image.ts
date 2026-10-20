import type { TourPlaceResponseDto } from '@/entities/travel'

export function heroImageOf(places: TourPlaceResponseDto[]) {
  const withImage = places.filter((place) => place.imageUrl?.trim())
  return (withImage.find((place) => place.category?.trim() === '명소') ?? withImage[0])?.imageUrl?.trim()
}
