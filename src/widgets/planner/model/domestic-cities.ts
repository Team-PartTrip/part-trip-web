import { getDomesticRegion } from '../../../entities/region-map/domestic-regions.ts'

type CityRecord = { cityName?: string; countryName?: string; regionName?: string }

export function getDomesticCities(cities: CityRecord[]) {
  const result = new Map<string, { cityName: string; regionCode: string; regionName: string }>()
  for (const city of cities) {
    const cityName = city.cityName?.trim()
    const regionName = city.regionName?.trim()
    if (city.countryName?.trim() !== '대한민국') continue
    const region = getDomesticRegion(undefined, regionName)
    if (!cityName || cityName === '대한민국' || !region) continue
    result.set(cityName, { cityName, regionCode: region.code, regionName: regionName ?? region.mapName })
  }
  return [...result.values()]
}

export function getDomesticPopularCityNames(cities: CityRecord[]) {
  return [...new Set(cities
    .filter((city) => city.countryName?.trim() === '대한민국' && city.cityName?.trim() !== '대한민국')
    .map((city) => city.cityName?.trim())
    .filter((city): city is string => Boolean(city)))]
}
