import type { TravelRecordDto } from '@/entities/trip-card'
import type { WorldMapResponseDto, WorldMapStatsResponseDto } from '@/entities/world-map'
import { getDateRangeDays, isPositiveSafeInteger } from '@/shared/utils'

export type ProfileInsightKind = 'map' | 'claim' | 'countries' | 'achievements'

export type DomesticRegionVisit = {
  code: string
  mapName: string
  name: string
  trips: TravelRecordDto[]
}

const DOMESTIC_REGIONS = [
  { code: '11', mapName: '서울특별시', name: '서울', aliases: ['서울', '서울특별시', 'Seoul'] },
  { code: '26', mapName: '부산광역시', name: '부산', aliases: ['부산', '부산광역시', 'Busan'] },
  { code: '27', mapName: '대구광역시', name: '대구', aliases: ['대구', '대구광역시', 'Daegu'] },
  { code: '28', mapName: '인천광역시', name: '인천', aliases: ['인천', '인천광역시', 'Incheon'] },
  { code: '29', mapName: '광주광역시', name: '광주', aliases: ['광주', '광주광역시', 'Gwangju'] },
  { code: '30', mapName: '대전광역시', name: '대전', aliases: ['대전', '대전광역시', 'Daejeon'] },
  { code: '31', mapName: '울산광역시', name: '울산', aliases: ['울산', '울산광역시', 'Ulsan'] },
  { code: '36', mapName: '세종특별자치시', name: '세종', aliases: ['세종', '세종특별자치시', 'Sejong'] },
  { code: '41', mapName: '경기도', name: '경기', aliases: ['경기', '경기도', '수원', '용인', '성남', '고양', '파주', '가평', 'Suwon'] },
  { code: '51', mapName: '강원도', name: '강원', aliases: ['강원', '강원도', '강원특별자치도', '강릉', '춘천', '속초', '양양', '평창', '원주', 'Gangneung', 'Sokcho'] },
  { code: '43', mapName: '충청북도', name: '충북', aliases: ['충북', '충청북도', '청주', '충주', '제천', 'Cheongju'] },
  { code: '44', mapName: '충청남도', name: '충남', aliases: ['충남', '충청남도', '천안', '아산', '공주', '보령', '서산', '태안', 'Cheonan'] },
  { code: '52', mapName: '전라북도', name: '전북', aliases: ['전북', '전라북도', '전북특별자치도', '전주', '군산', '익산', 'Jeonju'] },
  { code: '46', mapName: '전라남도', name: '전남', aliases: ['전남', '전라남도', '여수', '순천', '목포', '광양', 'Yeosu', 'Suncheon'] },
  { code: '47', mapName: '경상북도', name: '경북', aliases: ['경북', '경상북도', '경주', '포항', '안동', '구미', 'Gyeongju'] },
  { code: '48', mapName: '경상남도', name: '경남', aliases: ['경남', '경상남도', '창원', '통영', '거제', '진주', '김해', '양산', 'Changwon'] },
  { code: '50', mapName: '제주특별자치도', name: '제주', aliases: ['제주', '제주도', '제주특별자치도', '서귀포', 'Jeju'] },
] as const

function normalizedName(value?: string | null) {
  return value?.trim().toLocaleLowerCase().replaceAll(' ', '') ?? ''
}

function regionForCity(cityName?: string | null) {
  const city = normalizedName(cityName)
  return DOMESTIC_REGIONS.find((region) => region.aliases.some((alias) => normalizedName(alias) === city))
}

function isDomesticTrip(trip: TravelRecordDto) {
  const country = normalizedName(trip.countryName)
  if (['대한민국', '한국', '국내', 'korea', 'southkorea', 'republicofkorea', 'kr'].includes(country)) return true
  return !country && Boolean(regionForCity(trip.cityName))
}

export function getDomesticTravelModel(trips: TravelRecordDto[]) {
  const domesticTrips = trips.filter(isDomesticTrip)
  const regions: DomesticRegionVisit[] = DOMESTIC_REGIONS.flatMap((region) => {
    const regionTrips = domesticTrips.filter((trip) => regionForCity(trip.cityName)?.code === region.code)
    return regionTrips.length ? [{ code: region.code, mapName: region.mapName, name: region.name, trips: regionTrips }] : []
  })
  const unknownCities = [...new Set(domesticTrips
    .filter((trip) => !regionForCity(trip.cityName))
    .map((trip) => trip.cityName?.trim())
    .filter((city): city is string => Boolean(city)))]

  return {
    domesticTrips,
    regions: [...regions].sort((left, right) => right.trips.length - left.trips.length || left.name.localeCompare(right.name, 'ko')),
    unknownCities,
  }
}

export function getAnnualTravelSummary(trips: TravelRecordDto[], year: number) {
  const domesticTrips = getDomesticTravelModel(trips).domesticTrips.filter((trip) => (trip.startDate ?? '').startsWith(String(year)))
  const places = new Map<string, TravelRecordDto[]>()
  for (const trip of domesticTrips) {
    const place = trip.cityName?.trim()
    if (place) places.set(place, [...(places.get(place) ?? []), trip])
  }
  const stayDays = (trip: TravelRecordDto) => getDateRangeDays(trip.startDate, trip.endDate) ?? 0
  const longestStay = domesticTrips.filter((trip) => stayDays(trip) > 0).reduce<TravelRecordDto | undefined>((longest, trip) =>
    !longest || stayDays(trip) > stayDays(longest) ? trip : longest, undefined)
  const mostVisited = [...places.entries()].sort((left, right) => right[1].length - left[1].length || left[0].localeCompare(right[0], 'ko'))[0]

  return {
    placesVisited: places.size,
    tripCount: domesticTrips.length,
    mostVisitedName: mostVisited?.[0],
    mostVisitedCount: mostVisited?.[1].length ?? 0,
    longestStayName: longestStay?.cityName,
    longestStayDays: longestStay ? stayDays(longestStay) : 0,
    placeVisits: [...places.entries()].map(([name, visits]) => ({ name, count: visits.length, days: Math.max(...visits.map(stayDays)) }))
      .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name, 'ko')),
  }
}

type ProfileInsightModelProps = {
  kind: ProfileInsightKind
  selectedCountry: string
  trips: TravelRecordDto[]
  worldMap?: WorldMapResponseDto
  worldMapStats?: WorldMapStatsResponseDto
}

const copy: Record<ProfileInsightKind, { title: string; subtitle: string }> = {
  map: { title: '내 국내 여행 지도', subtitle: '여행 기록에서 방문한 지역을 확인하세요.' },
  claim: { title: '방문 국가 획득', subtitle: '여행 기록을 선택해 국가를 획득하세요.' },
  countries: { title: '국가별 여행 기록', subtitle: '나라를 선택하면 해당 국가의 여행 기록을 모아봅니다.' },
  achievements: { title: '올해의 여행 돌아보기', subtitle: '올해 다녀온 지역과 여행을 한눈에 모아봐요.' },
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
  const domestic = getDomesticTravelModel(trips)
  const selectedRegion = DOMESTIC_REGIONS.find((region) => region.name === selectedCountry || region.mapName === selectedCountry)
  const activeRegion = selectedRegion
    ? {
        code: selectedRegion.code,
        mapName: selectedRegion.mapName,
        name: selectedRegion.name,
        trips: domestic.domesticTrips.filter((trip) => regionForCity(trip.cityName)?.code === selectedRegion.code),
      }
    : domestic.regions[0]
  const activeRegionTrips = activeRegion?.trips ?? []
  const selectedTrip = countryTrips.find((trip) => isPositiveSafeInteger(trip.tripId))
  const countryCode = visited.find((country) => country.countryName === activeCountry)?.countryCode ?? '--'
  const totalCountries = worldMap?.totalCountries ?? worldMapStats?.totalCount ?? 0
  const acquiredCount = worldMapStats?.acquiredCount ?? visitedCountries.length
  const achievementPercentage = worldMapStats?.percentage ?? (totalCountries ? acquiredCount / totalCountries * 100 : 0)
  const { title, subtitle } = copy[kind]
  const pageTitle = kind === 'countries' ? activeRegion?.name || '방문 지역' : title
  const pageSubtitle = kind === 'map'
    ? `방문한 지역 ${domestic.regions.length} / 17`
    : kind === 'countries'
      ? `국내 여행 기록 ${activeRegionTrips.length}회`
      : subtitle
  const continentProgress = worldMapStats?.byContinent?.length
    ? worldMapStats.byContinent.map((item) => [item.continent || '대륙', item.acquiredCount || 0, item.totalCount || 0] as const)
    : []

  return {
    acquiredCount,
    activeRegion,
    activeRegionTrips,
    achievementPercentage,
    activeCountry,
    claimCountries,
    continentProgress,
    countryCode,
    countryTrips,
    pageSubtitle,
    pageTitle,
    selectedTrip,
    totalCountries,
    visited,
    visitedCountries,
    domesticRegions: domestic.regions,
    domesticTrips: domestic.domesticTrips,
    unknownCities: domestic.unknownCities,
  }
}
