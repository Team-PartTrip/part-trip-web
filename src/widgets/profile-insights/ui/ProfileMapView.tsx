import { useEffect, useMemo, useState, type KeyboardEvent, type MouseEvent } from 'react'
import { feature, merge } from 'topojson-client'
import { geoBounds, geoMercator, geoPath } from 'd3-geo'
import topologyUrl from '@/shared/assets/maps/skorea-municipalities-topo.json?url'
import { DOMESTIC_REGIONS, getDomesticRegion, getDomesticRegionByMapCode } from '@/entities/region-map/domestic-regions'
import { countDistrictTrips, summarizeVisitedAreas, type District } from '../model/district-visits'
import type { TripResponseDto } from '@/entities/region-map/api'
import * as S from './ProfileInsightPage.styles'

type MapShape = District & { path: string }
type MapRegion = typeof DOMESTIC_REGIONS[number] & { districts: MapShape[] }
type MapData = { districts: District[]; shapes: MapShape[]; mapRegions: MapRegion[] }

function buildMapData(value: unknown): MapData {
  const topology = value as Parameters<typeof feature>[0]
  const object = topology.objects[Object.keys(topology.objects)[0]] as unknown as { geometries: Array<{ properties?: { code?: string; name?: string } }> }
  const groups = new Map<string, { name: string; regionCode: string; geometries: Array<typeof object.geometries[number]> }>()
  for (const geometry of object.geometries) {
    const region = getDomesticRegionByMapCode(String(geometry.properties?.code ?? '').slice(0, 2))
    if (!region) continue
    const name = String(geometry.properties?.name ?? '').replace(/^(.+시).+구$/, '$1')
    const id = `${region.code}-${name}`
    const group = groups.get(id) ?? { name, regionCode: region.code, geometries: [] }
    group.geometries.push(geometry)
    groups.set(id, group)
  }

  const districts: District[] = [...groups].map(([id, group]) => {
    const shape = group.geometries.length === 1
      ? feature(topology, group.geometries[0] as Parameters<typeof feature>[1])
      : { type: 'Feature' as const, properties: {}, geometry: merge(topology, group.geometries as Parameters<typeof merge>[1]) }
    return { id, name: group.name, regionCode: group.regionCode, feature: shape as GeoJSON.Feature, bounds: geoBounds(shape) as District['bounds'] }
  })
  const collection = { type: 'FeatureCollection' as const, features: districts.map((district) => district.feature) }
  const toPath = geoPath(geoMercator().fitExtent([[20, 20], [580, 700]], collection)).digits(1)
  const shapes = districts.map((district) => ({ ...district, path: toPath(district.feature) ?? '' })).filter((district) => district.path)
  const mapRegions = DOMESTIC_REGIONS.map((region) => ({ ...region, districts: shapes.filter((district) => district.regionCode === region.code) })).filter((region) => region.districts.length)
  return { districts, shapes, mapRegions }
}

export default function ProfileMapView({
  trips,
  unknownCities,
  onOpenCountries,
  onOpenRecords,
  onOpenYearReview,
  onSelectRegion,
}: {
  trips: TripResponseDto[]
  unknownCities: string[]
  onOpenCountries: () => void
  onOpenRecords: () => void
  onOpenYearReview: () => void
  onSelectRegion: (region: string) => void
}) {
  const [mapData, setMapData] = useState<MapData>()
  const [mapError, setMapError] = useState(false)
  useEffect(() => {
    const controller = new AbortController()
    fetch(topologyUrl, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Failed to load municipality boundaries')
        return response.json() as Promise<unknown>
      })
      .then((topology) => setMapData(buildMapData(topology)))
      .catch(() => {
        if (!controller.signal.aborted) setMapError(true)
      })
    return () => controller.abort()
  }, [])
  const counts = useMemo(() => mapData ? countDistrictTrips(trips, mapData.districts) : new Map<string, Set<string>>(), [mapData, trips])
  const shapes = mapData?.shapes ?? []
  const districts = mapData?.districts ?? []
  const mapRegions = mapData?.mapRegions ?? []
  const visitedDistricts = shapes.filter((district) => counts.has(district.id)).sort((a, b) => (counts.get(b.id)?.size ?? 0) - (counts.get(a.id)?.size ?? 0) || a.name.localeCompare(b.name, 'ko'))
  const visitedAreas = summarizeVisitedAreas(visitedDistricts, counts)

  if (mapError) return <S.State role="alert">시·군·구 지도를 불러오지 못했습니다.</S.State>
  if (!mapData) return <S.State role="status">시·군·구 지도를 불러오고 있습니다.</S.State>

  const openRegion = (regionCode: string) => {
    const region = getDomesticRegion(regionCode)
    if (!region) return
    onSelectRegion(region.name)
    onOpenCountries()
  }
  const selectShape = (event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => {
    if ('key' in event && event.key !== 'Enter' && event.key !== ' ') return
    const target = event.target
    if (!(target instanceof Element)) return
    const region = target.closest<SVGGElement>('g[data-region-code]')?.dataset.regionCode
    if (!region) return
    event.preventDefault()
    openRegion(region)
  }

  return (
    <S.MapBody>
      <S.MapCard>
        <S.SectionTitle>방문한 시·군·구</S.SectionTitle>
        <S.MapCanvas><S.KoreaMap role="group" aria-label="대한민국 시·군·구 지도. 지역을 선택하면 해당 시·도 여행 기록을 볼 수 있어요." onClick={selectShape} onKeyDown={selectShape}>
          <svg viewBox="0 0 600 720" role="group" aria-label="대한민국 시·군·구 경계 지도">
            {mapRegions.map((region) => {
              const visitedCount = region.districts.filter((district) => counts.has(district.id)).length
              return <g key={region.code} data-region-code={region.code} tabIndex={0} role="button" aria-label={`${region.name}, ${visitedCount}개 시·군·구 방문`}>
                {region.districts.map((district) => <path key={district.id} d={district.path} data-visited={counts.has(district.id)} />)}
              </g>
            })}
          </svg>
        </S.KoreaMap></S.MapCanvas>
        <S.MapLegend><span><S.LegendDot aria-hidden="true" />미방문</span><span><S.LegendDot $visited aria-hidden="true" />방문 완료</span></S.MapLegend>
        <S.RegionPicker><summary>방문한 시·군·구 목록</summary><S.RegionPickerList>{visitedAreas.map((area) => <button key={area.id} type="button" onClick={() => openRegion(area.regionCode)}><span>{area.label}</span><small>{area.isMetro ? `여행 ${area.visits}번` : `${area.visits}회 방문`}</small></button>)}</S.RegionPickerList></S.RegionPicker>
      </S.MapCard>
      <S.CountryStats>
        <S.SectionTitle>방문한 시·군·구 {visitedDistricts.length} / {districts.length}</S.SectionTitle>
        {visitedAreas.length ? <S.CountrySummaryList>{visitedAreas.map((area) => <S.CountrySummaryRow key={area.id} type="button" onClick={() => openRegion(area.regionCode)}><strong>{area.label}</strong><span>{area.isMetro ? `여행 ${area.visits}번` : `${area.visits}회 방문`} <b>›</b></span></S.CountrySummaryRow>)}</S.CountrySummaryList> : <S.Empty>아직 기록된 국내 여행이 없어요.</S.Empty>}
        {unknownCities.length ? <S.UnknownRegionNotice>지역을 자동으로 연결하지 못한 기록: {unknownCities.join(', ')}</S.UnknownRegionNotice> : null}
        <S.MoreLink type="button" onClick={onOpenRecords}>여행 기록 보기</S.MoreLink>
        <S.MoreLink type="button" onClick={onOpenYearReview}>올해의 여행 돌아보기</S.MoreLink>
      </S.CountryStats>
    </S.MapBody>
  )
}
