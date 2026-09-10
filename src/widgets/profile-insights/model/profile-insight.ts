import type { TripPlanResponseDto } from '@/entities/trip-plan'
import type { WorldMapResponseDto, WorldMapStatsResponseDto } from '@/entities/world-map'
import { isPositiveSafeInteger } from '../../../shared/utils/number.ts'

export type ProfileInsightKind = 'map' | 'claim' | 'countries' | 'achievements'

type ProfileInsightModelProps = {
  kind: ProfileInsightKind
  selectedCountry: string
  trips: TripPlanResponseDto[]
  worldMap?: WorldMapResponseDto
  worldMapStats?: WorldMapStatsResponseDto
}

const copy: Record<ProfileInsightKind, { title: string; subtitle: string }> = {
  map: { title: '내 세계지도', subtitle: '방문한 국가를 확인하세요.' },
  claim: { title: '방문 국가 획득', subtitle: '여행 기록을 선택해 국가를 획득하세요.' },
  countries: { title: '국가별 여행 기록', subtitle: '나라를 선택하면 해당 국가의 여행 기록을 모아봅니다.' },
  achievements: { title: '여행 달성 현황', subtitle: '방문 국가와 대륙별 달성률을 확인하세요.' },
}

export function getProfileInsightModel({
  kind,
  selectedCountry,
  trips,
  worldMap,
  worldMapStats,
}: ProfileInsightModelProps) {
  const visited = worldMap?.visited ?? []
  const visitedCountries = [...new Set(visited.map((country) => country.countryName).filter((country): country is string => Boolean(country)))]
  const claimCountries = [...new Set(trips.map((trip) => trip.countryName).filter((country): country is string => Boolean(country)))]
  const countryChoices = kind === 'claim' ? claimCountries : visitedCountries
  const activeCountry = countryChoices.includes(selectedCountry) ? selectedCountry : countryChoices[0]
  const countryTrips = trips.filter((trip) => trip.countryName === activeCountry)
  const selectedTrip = countryTrips.find((trip) => isPositiveSafeInteger(trip.tripId))
  const countryCode = visited.find((country) => country.countryName === activeCountry)?.countryCode ?? '--'
  const countryCities = [...new Set(countryTrips.map((trip) => trip.cityName).filter((city): city is string => Boolean(city)))]
  const firstVisit = countryTrips.map((trip) => trip.startDate).filter(Boolean).sort()[0]?.replaceAll('-', '.') || '-'
  const totalCountries = worldMap?.totalCountries ?? worldMapStats?.totalCount ?? 0
  const acquiredCount = worldMapStats?.acquiredCount ?? visitedCountries.length
  const achievementPercentage = worldMapStats?.percentage ?? (totalCountries ? acquiredCount / totalCountries * 100 : 0)
  const { title, subtitle } = copy[kind]
  const pageTitle = kind === 'countries' ? activeCountry || title : title
  const pageSubtitle = kind === 'countries' ? `첫 방문 ${firstVisit}` : subtitle
  const continentProgress = worldMapStats?.byContinent?.length
    ? worldMapStats.byContinent.map((item) => [item.continent || '대륙', item.acquiredCount || 0, item.totalCount || 0] as const)
    : []

  return {
    acquiredCount,
    achievementPercentage,
    activeCountry,
    claimCountries,
    continentProgress,
    countryCities,
    countryCode,
    countryTrips,
    firstVisit,
    pageSubtitle,
    pageTitle,
    selectedTrip,
    totalCountries,
    visited,
    visitedCountries,
  }
}
