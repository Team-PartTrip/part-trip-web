import type { TravelRecordDto } from '@/entities/trip-card'
import { DOMESTIC_REGIONS, getDomesticRegion } from '@/entities/region-map/domestic-regions'
import type { VisitedRegionResponseDto } from '@/entities/region-map/api'
import { getDateRangeDays } from '@/shared/utils'

export type ProfileInsightKind = 'map' | 'countries' | 'achievements'

export type DomesticRegionVisit = {
  code: string
  mapName: string
  name: string
  trips: TravelRecordDto[]
}

function normalizedName(value?: string | null) {
  return value?.trim().toLocaleLowerCase().replaceAll(' ', '') ?? ''
}

function regionForTrip(trip: TravelRecordDto) {
  return getDomesticRegion(trip.regionCode, trip.regionName)
}

function isDomesticTrip(trip: TravelRecordDto) {
  const country = normalizedName(trip.countryName)
  if (['대한민국', '한국', '국내', 'korea', 'southkorea', 'republicofkorea', 'kr'].includes(country)) return true
  return Boolean(trip.regionCode || trip.regionName)
}

export function getDomesticTravelModel(trips: TravelRecordDto[]) {
  const domesticTrips = trips.filter(isDomesticTrip)
  const regions: DomesticRegionVisit[] = DOMESTIC_REGIONS.flatMap((region) => {
    const regionTrips = domesticTrips.filter((trip) => regionForTrip(trip)?.code === region.code)
    return regionTrips.length ? [{ code: region.code, mapName: region.mapName, name: region.name, trips: regionTrips }] : []
  })
  const unknownCities = [...new Set(domesticTrips
    .filter((trip) => !regionForTrip(trip))
    .map((trip) => trip.cityName?.trim() || trip.regionName?.trim())
    .filter((city): city is string => Boolean(city)))]

  return {
    domesticTrips,
    regions: [...regions].sort((left, right) => right.trips.length - left.trips.length || left.name.localeCompare(right.name, 'ko')),
    unknownCities,
  }
}

export function getAnnualTravelSummary(trips: TravelRecordDto[], year: number) {
  const domesticTrips = trips.filter((trip) =>
    isDomesticTrip(trip) && (trip.startDate ?? '').startsWith(String(year)),
  )
  const places = new Map<string, { count: number; days: number }>()
  let longestStay: TravelRecordDto | undefined
  let longestStayDays = 0

  for (const trip of domesticTrips) {
    const place = trip.cityName?.trim()
    const days = getDateRangeDays(trip.startDate, trip.endDate) ?? 0
    if (days > longestStayDays) {
      longestStay = trip
      longestStayDays = days
    }
    if (!place) continue
    const current = places.get(place)
    places.set(place, { count: (current?.count ?? 0) + 1, days: Math.max(current?.days ?? 0, days) })
  }
  const placeVisits = [...places.entries()].sort((left, right) => right[1].count - left[1].count || left[0].localeCompare(right[0], 'ko'))
  const mostVisited = placeVisits[0]

  return {
    placesVisited: places.size,
    tripCount: domesticTrips.length,
    mostVisitedName: mostVisited?.[0],
    mostVisitedCount: mostVisited?.[1].count ?? 0,
    longestStayName: longestStay?.cityName,
    longestStayDays,
    placeVisits: placeVisits.map(([name, summary]) => ({ name, ...summary })),
  }
}

type ProfileInsightModelProps = {
  kind: ProfileInsightKind
  selectedCountry: string
  trips: TravelRecordDto[]
  visitedRegions?: VisitedRegionResponseDto[]
}

const copy: Record<ProfileInsightKind, { title: string; subtitle: string }> = {
  map: { title: '내 국내 여행 지도', subtitle: '여행 기록에서 방문한 지역을 확인하세요.' },
  countries: { title: '국가별 여행 기록', subtitle: '나라를 선택하면 해당 국가의 여행 기록을 모아봅니다.' },
  achievements: { title: '올해의 여행 돌아보기', subtitle: '올해 다녀온 지역과 여행을 한눈에 모아봐요.' },
}

export function getProfileInsightModel({
  kind,
  selectedCountry,
  trips,
  visitedRegions,
}: ProfileInsightModelProps) {
  const domestic = getDomesticTravelModel(trips)
  if (visitedRegions) domestic.regions = visitedRegions.flatMap((visited) => {
    const region = getDomesticRegion(visited.regionCode, visited.regionName)
    if (!region) return []
    return [{ code: region.code, mapName: region.mapName, name: region.name, trips: domestic.domesticTrips.filter((trip) => trip.regionCode === visited.regionCode) }]
  })
  const selectedRegion = DOMESTIC_REGIONS.find((region) => region.name === selectedCountry || region.mapName === selectedCountry)
  const activeRegion = selectedRegion
    ? {
        code: selectedRegion.code,
        mapName: selectedRegion.mapName,
        name: selectedRegion.name,
        trips: domestic.domesticTrips.filter((trip) => regionForTrip(trip)?.code === selectedRegion.code),
      }
    : domestic.regions[0]
  const activeRegionTrips = activeRegion?.trips ?? []
  const { title, subtitle } = copy[kind]
  const pageTitle = kind === 'countries' ? activeRegion?.name || '방문 지역' : title
  const pageSubtitle = kind === 'map'
    ? `방문한 지역 ${domestic.regions.length} / 17`
    : kind === 'countries'
      ? `국내 여행 기록 ${activeRegionTrips.length}회`
      : subtitle
  return {
    activeRegion,
    activeRegionTrips,
    pageSubtitle,
    pageTitle,
    domesticRegions: domestic.regions,
    domesticTrips: domestic.domesticTrips,
    unknownCities: domestic.unknownCities,
  }
}
