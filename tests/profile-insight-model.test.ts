import assert from 'node:assert/strict'
import test from 'node:test'

import { getProfileInsightModel } from '../src/widgets/profile-insights/model/profile-insight.ts'

test('국가별 insight model은 방문 국가와 여행 기록을 분리해 파생한다', () => {
  const model = getProfileInsightModel({
    kind: 'countries',
    selectedCountry: '일본',
    trips: [
      { cityName: '오사카', countryName: '일본', startDate: '2026-05-02', title: '오사카 여행', tripId: 7 },
      { cityName: '서울', countryName: '한국', startDate: '2025-01-01', tripId: 8 },
    ],
    worldMap: {
      totalCountries: 200,
      visited: [
        { countryCode: 'JP', countryName: '일본' },
        { countryCode: 'JP', countryName: '일본' },
        { countryCode: 'KR', countryName: '한국' },
      ],
    },
  })

  assert.deepEqual(model.visitedCountries, ['일본', '한국'])
  assert.deepEqual(model.claimCountries, ['일본', '한국'])
  assert.equal(model.activeCountry, '일본')
  assert.deepEqual(model.countryCities, ['오사카'])
  assert.equal(model.countryCode, 'JP')
  assert.equal(model.firstVisit, '2026.05.02')
  assert.equal(model.selectedTrip?.tripId, 7)
  assert.equal(model.totalCountries, 200)
  assert.equal(model.acquiredCount, 2)
  assert.equal(model.achievementPercentage, 1)
  assert.equal(model.pageTitle, '일본')
  assert.equal(model.pageSubtitle, '첫 방문 2026.05.02')
})

test('claim mode는 여행 기록 국가를 사용하고 stats fallback을 유지한다', () => {
  const model = getProfileInsightModel({
    kind: 'claim',
    selectedCountry: '한국',
    trips: [{ countryName: '태국', tripId: 12 }],
    worldMap: { visited: [{ countryCode: 'KR', countryName: '한국' }] },
    worldMapStats: {
      acquiredCount: 3,
      byContinent: [{ acquiredCount: 2, continent: '아시아', totalCount: 10 }],
      percentage: 30,
      totalCount: 10,
    },
  })

  assert.deepEqual(model.visitedCountries, ['한국'])
  assert.deepEqual(model.claimCountries, ['태국'])
  assert.equal(model.activeCountry, '태국')
  assert.equal(model.countryCode, '--')
  assert.equal(model.selectedTrip?.tripId, 12)
  assert.equal(model.totalCountries, 10)
  assert.equal(model.acquiredCount, 3)
  assert.equal(model.achievementPercentage, 30)
  assert.deepEqual(model.continentProgress, [['아시아', 2, 10]])
})
