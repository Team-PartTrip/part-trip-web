import type {
  CountryInfoResponseDto,
  PopularCityResponseDto,
} from '@/entities/travel'
import type {
  PlannerCityRequestDto,
  PlannerCityResponseDto,
  PlannerDetailResponseDto,
} from '@/entities/planner'

type DestinationLike = {
  countryName?: string | null
  cityName?: string | null
}

export function getPlannerCityPlans(detail?: PlannerDetailResponseDto): PlannerCityRequestDto[] {
  const savedCities = (detail?.cities ?? []).flatMap((city) => {
    if (!city.countryName || !city.cityName || !city.startDate || !city.endDate) return []
    return [{
      countryName: city.countryName,
      cityName: city.cityName,
      startDate: city.startDate,
      endDate: city.endDate,
    }]
  })
  if (savedCities.length) return savedCities
  if (detail?.countryName && detail.cityName && detail.startDate && detail.endDate) {
    return [{
      countryName: detail.countryName,
      cityName: detail.cityName,
      startDate: detail.startDate,
      endDate: detail.endDate,
    }]
  }
  return []
}

export function getPersistedPlannerCities(
  requestedCities: PlannerCityRequestDto[],
  returnedCities?: PlannerCityResponseDto[],
): PlannerCityRequestDto[] {
  const completeCities = returnedCities?.flatMap((city) => {
    if (!city.countryName || !city.cityName || !city.startDate || !city.endDate) return []
    return [{
      countryName: city.countryName,
      cityName: city.cityName,
      startDate: city.startDate,
      endDate: city.endDate,
    }]
  }) ?? []
  return returnedCities?.length && completeCities.length === returnedCities.length
    ? completeCities
    : requestedCities
}

type PlannerCityRange = Pick<PlannerCityRequestDto, 'countryName' | 'cityName' | 'startDate' | 'endDate'>

function isValidPlannerDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export function validatePlannerCityRanges(cities: PlannerCityRange[]) {
  if (cities.length === 0) return '여행지를 하나 이상 추가해주세요.'
  if (cities.some(({ countryName, cityName, startDate, endDate }) =>
    !countryName.trim() || !cityName.trim() || !isValidPlannerDate(startDate) || !isValidPlannerDate(endDate) || startDate > endDate,
  )) return '각 여행지의 국가, 도시와 올바른 체류 기간을 입력해주세요.'

  const orderedCities = [...cities].sort((left, right) => left.startDate.localeCompare(right.startDate))
  for (let index = 1; index < orderedCities.length; index += 1) {
    if (orderedCities[index].startDate <= orderedCities[index - 1].endDate) {
      return '도시별 체류 기간이 겹치지 않도록 설정해주세요.'
    }
  }
  return ''
}

function normalizeDestinationValue(value?: string | null) {
  return value?.trim().toLocaleLowerCase() ?? ''
}

export function dedupeDestinations<T extends DestinationLike>(destinations: T[]) {
  return destinations.filter((destination, index, all) => all.findIndex((item) =>
    item.countryName === destination.countryName && item.cityName === destination.cityName,
  ) === index)
}

export function matchesDestinationKeyword(destination: DestinationLike, keyword: string) {
  const normalizedKeyword = normalizeDestinationValue(keyword)
  return [destination.countryName, destination.cityName]
    .some((value) => value != null && normalizeDestinationValue(value).includes(normalizedKeyword))
}

export function findExactDestinationMatches<T extends DestinationLike>(
  destinations: T[],
  cityOrCountry: string,
  selectedCountryName: string,
) {
  const normalizedCityName = normalizeDestinationValue(cityOrCountry)
  const normalizedCountryName = normalizeDestinationValue(selectedCountryName)

  return destinations.filter((destination) => {
    const itemCityName = destination.cityName == null ? undefined : normalizeDestinationValue(destination.cityName)
    const itemCountryName = destination.countryName == null ? undefined : normalizeDestinationValue(destination.countryName)
    const matchesCity = itemCityName === normalizedCityName
    const matchesCountryInput = itemCountryName === normalizedCityName
    const matchesSelectedCountry = !normalizedCountryName || itemCountryName === normalizedCountryName
    return matchesSelectedCountry && (matchesCity || matchesCountryInput)
  })
}

export function getDestinationResults(
  countries: CountryInfoResponseDto[],
  popularCities: PopularCityResponseDto[],
  selectedCityName: string,
  plannerCityName?: string,
) {
  const destinationKeyword = normalizeDestinationValue(selectedCityName)
  const isDestinationSearch =
    destinationKeyword !== '' &&
    destinationKeyword !== normalizeDestinationValue(plannerCityName)
  const matchingCountries = countries.filter((country) =>
    matchesDestinationKeyword(country, destinationKeyword),
  )
  const popularDestinations = popularCities.flatMap((city) => {
    if (!city.countryName || !city.cityName) return []
    const country = countries.find(
      (item) =>
        item.countryName === city.countryName && item.cityName === city.cityName,
    )
    return [{
      countryInfoId: country?.countryInfoId,
      countryName: city.countryName,
      cityName: city.cityName,
      imageUrl: country?.imageUrl,
      summary: country?.summary,
    }]
  })

  return {
    destinationResults: isDestinationSearch
      ? dedupeDestinations([
          ...matchingCountries,
          ...popularDestinations.filter((popular) => matchesDestinationKeyword(popular, destinationKeyword)),
        ])
      : popularDestinations,
    isDestinationSearch,
  }
}
