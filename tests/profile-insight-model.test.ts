import assert from 'node:assert/strict'
import test from 'node:test'
import { createTestJiti } from './helpers.ts'

const jiti = createTestJiti()
const { getDomesticTravelModel, getAnnualTravelSummary, getProfileInsightModel } = await jiti.import('./src/widgets/profile-insights/model/profile-insight.ts') as {
  getDomesticTravelModel: (trips: Array<{ cityName?: string; countryName?: string; startDate?: string; endDate?: string; tripId?: number }>) => { regions: Array<{ code: string; name: string; trips: unknown[] }>; unknownCities: string[]; domesticTrips: unknown[] }
  getAnnualTravelSummary: (trips: Array<{ cityName?: string; countryName?: string; startDate?: string; endDate?: string }>, year: number) => { placesVisited: number; tripCount: number; mostVisitedName?: string; longestStayName?: string; longestStayDays: number }
  getProfileInsightModel: (input: { kind: 'countries'; selectedCountry: string; trips: Array<{ cityName?: string; countryName?: string }> }) => { activeRegion?: { name: string; trips: unknown[] } }
}

test('국내 여행 지도는 시·도별 기록을 중복 없이 집계하고 연결 못한 도시를 표시한다', () => {
  const model = getDomesticTravelModel([
    { cityName: '서울', countryName: '대한민국', tripId: 1 },
    { cityName: '서울', countryName: '한국', tripId: 2 },
    { cityName: '오사카', countryName: '일본', tripId: 3 },
    { cityName: '새 도시', countryName: '대한민국', tripId: 4 },
  ])

  assert.equal(model.domesticTrips.length, 3)
  assert.deepEqual(model.regions.map((region) => [region.code, region.name, region.trips.length]), [['11', '서울', 2]])
  assert.deepEqual(model.unknownCities, ['새 도시'])
})

test('올해 회고는 방문 도시 수, 최다 방문, 최장 체류를 요약한다', () => {
  const summary = getAnnualTravelSummary([
    { cityName: '서울', countryName: '대한민국', startDate: '2026-05-01', endDate: '2026-05-02' },
    { cityName: '서울', countryName: '대한민국', startDate: '2026-06-01', endDate: '2026-06-01' },
    { cityName: '부산', countryName: '한국', startDate: '2026-07-01', endDate: '2026-07-04' },
    { cityName: '오사카', countryName: '일본', startDate: '2026-08-01', endDate: '2026-08-10' },
    { cityName: '제주', countryName: '대한민국', startDate: '2025-12-30', endDate: '2026-01-02' },
  ], 2026)

  assert.equal(summary.tripCount, 3)
  assert.equal(summary.placesVisited, 2)
  assert.equal(summary.mostVisitedName, '서울')
  assert.equal(summary.longestStayName, '부산')
  assert.equal(summary.longestStayDays, 4)
})

test('방문하지 않은 지도 지역을 선택하면 다른 방문 지역으로 잘못 대체하지 않는다', () => {
  const model = getProfileInsightModel({
    kind: 'countries',
    selectedCountry: '부산광역시',
    trips: [{ cityName: '서울', countryName: '대한민국' }],
  })

  assert.deepEqual(model.activeRegion, { code: '26', mapName: '부산광역시', name: '부산', trips: [] })
})
