import assert from 'node:assert/strict'
import test from 'node:test'
import { pickRecommendations, readRecommendations, saveRecommendations } from '../src/widgets/main/model/recommendations.ts'
import { festivalMatchesCity } from '../src/widgets/record-calendar/model/festivals.ts'
import { getDayOrigin, getKakaoMapUrl } from '../src/widgets/planner/model/schedule-edit.ts'
import { countDistrictTrips, summarizeVisitedAreas, type District } from '../src/widgets/profile-insights/model/district-visits.ts'

test('추천은 4점 이상을 우선하고 카테고리를 분산하며 가능한 새로고침 결과를 바꾼다', () => {
  const places = [
    { tourPlaceId: 1, rating: 4.5, category: 'A' },
    { tourPlaceId: 2, rating: 4, category: 'A' },
    { tourPlaceId: 3, rating: 5, category: 'B' },
    { tourPlaceId: 4, rating: 4, category: 'C' },
    { tourPlaceId: 5, rating: 3, category: 'D' },
  ]
  const first = pickRecommendations(places)
  assert.equal(first.length, 3)
  assert.ok(first.every(place => place.rating! >= 4))
  assert.equal(new Set(first.map(place => place.category)).size, 3)
  const refreshed = pickRecommendations(places, first)
  assert.notDeepEqual(refreshed, first)
  assert.equal(new Set(refreshed.map(place => place.category)).size, 3)
  const scarce = pickRecommendations([places[0], places[1], { tourPlaceId: 6, rating: 3, category: 'B' }, { tourPlaceId: 7, rating: 2, category: 'C' }])
  assert.equal(scarce.filter(place => place.rating! >= 4).length, 2)
  assert.equal(pickRecommendations(places.slice(0, 1)).length, 1)
  assert.deepEqual(pickRecommendations([]), [])
  assert.equal(pickRecommendations([places[0], places[4]]).length, 2)
})

test('추천은 도시별 저장 결과를 유지하고 잘못된 저장값 및 차단된 저장소를 처리한다', () => {
  const saved = new Map<string, string>()
  const original = Object.getOwnPropertyDescriptor(globalThis, 'window')
  const places = [1, 2, 3, 4].map(tourPlaceId => ({ tourPlaceId, rating: 4, category: String(tourPlaceId) }))
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { localStorage: { getItem: (key: string) => saved.get(key), setItem: (key: string, value: string) => saved.set(key, value) } } })
  try {
    saveRecommendations('대구', places.slice(0, 3))
    assert.deepEqual(readRecommendations('대구', places), places.slice(0, 3))
    assert.equal(readRecommendations('부산', places), undefined)
    saved.set('parttrip:main-recommendations:%EB%8C%80%EA%B5%AC', '{broken')
    assert.equal(readRecommendations('대구', places), undefined)
    Object.defineProperty(globalThis, 'window', { configurable: true, value: { get localStorage() { throw new Error('blocked') } } })
    assert.doesNotThrow(() => saveRecommendations('대구', places))
    assert.equal(readRecommendations('대구', places), undefined)
  } finally {
    if (original) Object.defineProperty(globalThis, 'window', original)
    else Reflect.deleteProperty(globalThis, 'window')
  }
})

test('축제는 주소 앞 두 단어로 도시를 구분하고 해운대구를 대구로 취급하지 않는다', () => {
  assert.equal(festivalMatchesCity('부산광역시 해운대구 APEC로 55', '대구'), false)
  assert.equal(festivalMatchesCity('대구광역시 수성구 동대구로', '대구'), true)
  assert.equal(festivalMatchesCity('  경상북도 경주시 첨성로', '경주'), true)
  assert.equal(festivalMatchesCity(undefined, '대구'), false)
})

test('날짜별 출발지는 첫날 departure, 다음날 마지막 숙소이며 빈 칸은 건너뛴다', () => {
  const departure = { name: '우리 집', latitude: 35, longitude: 128 }
  const hotel = { tourPlaceId: 1, name: '숙소', category: 'ACCOMMODATION', latitude: 36, longitude: 129 }
  const days = [{ date: '2026-09-30', slots: [{ place: hotel }, {}] }, { date: '2026-10-01', slots: [] }]
  const resolve = (slot: typeof days[number]['slots'][number]) => slot.place ?? undefined
  assert.deepEqual(getDayOrigin(days, 0, departure, resolve), { point: departure, isLodging: false })
  assert.deepEqual(getDayOrigin(days, 1, departure, resolve), { point: hotel, isLodging: true })
  assert.equal(getDayOrigin(days, 0, null, resolve), undefined)
  assert.deepEqual(getDayOrigin([{ date: '2026-09-30', slots: [] }], 1, departure, resolve), { point: departure, isLodging: false })
})

test('카카오 길 안내는 이동수단과 출발 좌표를 전달하고 좌표 누락시 안전하게 대체한다', () => {
  const origin = { name: '우리 집', latitude: 35, longitude: 128 }
  for (const [mode, expected] of [['PUBLIC_TRANSIT', 'traffic'], ['WALKING', 'walk'], ['TAXI', 'car']] as const) {
    const url = getKakaoMapUrl(mode, '역', 36, 129, origin)!
    assert.ok(url.includes(`/by/${expected}/`))
    assert.ok(url.includes(`${encodeURIComponent('우리 집')},35,128/${encodeURIComponent('역')},36,129`))
  }
  assert.ok(getKakaoMapUrl('CAR', '역', 36, 129, { name: '좌표 없음' })!.includes('/link/to/'))
  assert.equal(getKakaoMapUrl('CAR', '역', Number.NaN, 129, origin), undefined)
})

test('광역시 방문은 전체 구군을 칠하고 목록에서 여행 횟수를 중복 집계하지 않는다', () => {
  const district = (regionCode: string, name: string): District => ({ id: `${regionCode}-${name}`, regionCode, name, feature: { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [] } }, bounds: [[0, 0], [0, 0]] })
  for (const code of ['11', '26', '27', '28', '29', '30', '31', '36']) {
    const districts = [district(code, '중구'), district(code, '동구')]
    const counts = countDistrictTrips([{ tripCardId: 1, regionCode: code }], districts)
    assert.equal(counts.size, 2)
    const areas = summarizeVisitedAreas(districts, counts)
    assert.equal(areas.length, 1)
    assert.equal(areas[0].visits, 1)
    assert.equal(areas[0].isMetro, true)
  }
  const districts = [district('41', '수원시'), district('41', '용인시')]
  assert.deepEqual([...countDistrictTrips([{ tripCardId: 2, regionCode: '41', cityName: '수원' }], districts).keys()], ['41-수원시'])
})
