import assert from 'node:assert/strict'
import test from 'node:test'
import { DOMESTIC_CITIES, getDomesticCities } from '../src/entities/region-map/domestic-cities.ts'

test('국내 플래너는 내장된 국내 도시만 검색한다', () => {
  assert.ok(DOMESTIC_CITIES.some(({ cityName, regionCode }) => cityName === '대구' && regionCode === '27'))
  assert.ok(getDomesticCities('서울').some(({ cityName }) => cityName === '서울'))
  assert.equal(getDomesticCities('오사카').length, 0)
})
