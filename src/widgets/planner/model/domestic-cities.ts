import type { CountryInfoResponseDto } from '@/entities/travel/api'

export function getDomesticCityNames(countries: CountryInfoResponseDto[]) {
  return [...new Set(countries
    .filter((country) => country.countryName?.trim() === '대한민국')
    .map((country) => country.cityName?.trim())
    .filter((city): city is string => Boolean(city)))]
}
