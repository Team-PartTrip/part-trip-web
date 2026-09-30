import { geoContains } from 'd3-geo'
import { getDomesticRegion } from '../../../entities/region-map/domestic-regions.ts'
import type { TripResponseDto } from '../../../entities/region-map/api.ts'

export type District = {
  id: string
  name: string
  regionCode: string
  feature: GeoJSON.Feature
  bounds: [[number, number], [number, number]]
}

const metroRegionCodes = new Set(['11', '26', '27', '28', '29', '30', '31', '36'])
const withoutAdminSuffix = (name: string) => name.trim().replace(/(시|군)$/, '').replaceAll(' ', '')
const districtLabel = (district: District) => `${getDomesticRegion(district.regionCode)?.name ?? ''} ${district.name}`.trim()

function districtForPoint(regionDistricts: District[], latitude: number, longitude: number) {
  return regionDistricts.find((district) => {
    const [[minLng, minLat], [maxLng, maxLat]] = district.bounds
    return longitude >= minLng && longitude <= maxLng && latitude >= minLat && latitude <= maxLat && geoContains(district.feature, [longitude, latitude])
  })
}

export function countDistrictTrips(trips: TripResponseDto[], districts: District[]) {
  const tripsByDistrict = new Map<string, Set<string>>()
  trips.forEach((trip, index) => {
    const regionDistricts = districts.filter((district) => district.regionCode === String(trip.regionCode ?? '').slice(0, 2))
    const regionCode = regionDistricts[0]?.regionCode
    const tripId = String(trip.tripCardId ?? `trip-${index}`)
    if (regionCode && metroRegionCodes.has(regionCode)) {
      regionDistricts.forEach((district) => {
        const tripIds = tripsByDistrict.get(district.id) ?? new Set<string>()
        tripIds.add(tripId)
        tripsByDistrict.set(district.id, tripIds)
      })
      return
    }
    let matched = false
    for (const [latitude, longitude] of trip.points ?? []) {
      if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) continue
      const district = districtForPoint(regionDistricts, latitude, longitude)
      if (!district) continue
      const tripIds = tripsByDistrict.get(district.id) ?? new Set<string>()
      tripIds.add(tripId)
      tripsByDistrict.set(district.id, tripIds)
      matched = true
    }
    if (matched) return
    const fallback = regionDistricts.find((district) => withoutAdminSuffix(district.name) === withoutAdminSuffix(trip.cityName ?? ''))
    if (fallback) {
      const tripIds = tripsByDistrict.get(fallback.id) ?? new Set<string>()
      tripIds.add(tripId)
      tripsByDistrict.set(fallback.id, tripIds)
    }
  })
  return tripsByDistrict
}

export function summarizeVisitedAreas(visitedDistricts: District[], counts: Map<string, Set<string>>) {
  const rows: Array<{ id: string; regionCode: string; label: string; visits: number; isMetro: boolean }> = []
  const metroVisits = new Map<string, Set<string>>()
  for (const district of visitedDistricts) {
    if (metroRegionCodes.has(district.regionCode)) {
      const visits = metroVisits.get(district.regionCode) ?? new Set<string>()
      counts.get(district.id)?.forEach((tripId) => visits.add(tripId))
      metroVisits.set(district.regionCode, visits)
      continue
    }
    rows.push({ id: district.id, regionCode: district.regionCode, label: districtLabel(district), visits: counts.get(district.id)?.size ?? 0, isMetro: false })
  }
  for (const [regionCode, trips] of metroVisits) {
    const region = getDomesticRegion(regionCode)
    rows.push({ id: regionCode, regionCode, label: region?.mapName ?? '', visits: trips.size, isMetro: true })
  }
  return rows.sort((a, b) => b.visits - a.visits || a.label.localeCompare(b.label, 'ko'))
}
