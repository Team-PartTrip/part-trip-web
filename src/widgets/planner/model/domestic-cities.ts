type CityRecord = { countryName?: string; cityName?: string }

export function getDomesticCityNames(cities: CityRecord[]) {
  return [...new Set(cities
    .filter((city) => city.countryName?.trim() === '대한민국' && city.cityName?.trim() !== '대한민국')
    .map((city) => city.cityName?.trim())
    .filter((city): city is string => Boolean(city)))]
}
