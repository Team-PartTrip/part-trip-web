import { apiClient } from '@/shared/libs/api-client'

export type VisitedRegionResponseDto = {
  regionCode?: string
  regionName?: string
  tripCount?: number
}

export type TripResponseDto = {
  tripCardId?: number
  regionCode?: string
  cityName?: string
  points?: number[][]
}

export type RegionMapResponseDto = {
  totalRegions?: number
  visited?: VisitedRegionResponseDto[]
  trips?: TripResponseDto[]
}

export async function getRegionMap(): Promise<RegionMapResponseDto> {
  const { data } = await apiClient.get<RegionMapResponseDto>('/region-map')
  return data
}
