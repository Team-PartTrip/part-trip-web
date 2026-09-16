import type {
  CountryInfoResponseDto,
  PopularCityResponseDto,
} from '@/entities/travel'

type DestinationLike = {
  countryName?: string | null
  cityName?: string | null
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
