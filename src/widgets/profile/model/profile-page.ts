import type { TripPlanResponseDto } from '@/entities/trip-plan'
import type { ProfileStatsResponseDto, UserProfile } from '@/entities/user'
import type { WorldMapResponseDto } from '@/entities/world-map'

type ProfilePageModelProps = {
  profile?: UserProfile
  profileStats?: ProfileStatsResponseDto
  trips: TripPlanResponseDto[]
  worldMap?: WorldMapResponseDto
}

export function getProfilePageModel({
  profile,
  profileStats,
  trips,
  worldMap,
}: ProfilePageModelProps) {
  const tripCountryCount = new Set(
    trips.map((trip) => trip.countryName).filter(Boolean),
  ).size
  const visitedCountries = worldMap?.visited ?? []
  const countryCount = worldMap
    ? new Set(visitedCountries.map((country) => country.countryName).filter(Boolean)).size
    : tripCountryCount
  const recordCount = trips.reduce((total, trip) => total + (trip.images?.length ?? 0), 0)
  const name = profile?.name || '닉네임 미설정'

  return {
    countryCount,
    displayedCountryCount: profileStats?.countryCount ?? countryCount,
    displayedRecordCount: profileStats?.recordCount ?? recordCount,
    displayedTripCount: profileStats?.tripCount ?? trips.length,
    initials: name.slice(0, 2).toUpperCase() || 'MS',
    name,
    visitedCountries,
  }
}
