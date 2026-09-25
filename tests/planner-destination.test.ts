import assert from 'node:assert/strict'
import test from 'node:test'
import { getDomesticCityNames } from '../src/widgets/planner/model/domestic-cities.ts'

test('국내 플래너는 서버가 대한민국으로 분류한 실제 도시만 중복 없이 보여준다', () => {
  const cities = getDomesticCityNames([
    { countryName: '대한민국', cityName: ' 서울 ' },
    { countryName: '대한민국', cityName: '서울' },
    { countryName: '대한민국', cityName: '대한민국' },
    { countryName: '일본', cityName: '오사카' },
    { countryName: '대한민국', cityName: ' ' },
  ])
  assert.deepEqual(cities, ['서울'])
  assert.equal(cities.includes('오사카'), false)
})
