import assert from 'node:assert/strict'
import test from 'node:test'
import { getDomesticCities } from '../src/widgets/planner/model/domestic-cities.ts'

test('국내 플래너는 서버가 대한민국으로 분류한 실제 도시만 중복 없이 보여준다', () => {
  const cities = getDomesticCities([
    { countryName: '대한민국', cityName: ' 서울 ', regionName: '서울특별시' },
    { countryName: '대한민국', cityName: '서울', regionName: '서울특별시' },
    { countryName: '대한민국', cityName: '대한민국', regionName: '서울특별시' },
    { countryName: '일본', cityName: '오사카', regionName: '서울특별시' },
    { countryName: '대한민국', cityName: ' ', regionName: '서울특별시' },
  ])
  assert.deepEqual(cities, [{ cityName: '서울', regionCode: '11', regionName: '서울특별시' }])
  assert.equal(cities.some(({ cityName }) => cityName === '오사카'), false)
})
