import assert from 'node:assert/strict'
import test from 'node:test'

import {
  dedupeDestinations,
  findExactDestinationMatches,
  getDestinationResults,
  getPersistedPlannerCities,
  matchesDestinationKeyword,
} from '../src/widgets/planner/model/destination.ts'

const destinations = [
  { countryName: '일본', cityName: '오사카', id: 1 },
  { countryName: '일본', cityName: '오사카', id: 2 },
  { countryName: '태국', cityName: '방콕', id: 3 },
]
const incompleteDestination = { countryName: undefined, cityName: undefined, id: 4 }

test('destination 후보는 첫 항목을 유지한 채 중복을 제거한다', () => {
  assert.deepEqual(dedupeDestinations(destinations).map(({ id }) => id), [1, 3])
})

test('destination 검색은 국가명과 도시명의 부분 일치를 유지한다', () => {
  assert.equal(matchesDestinationKeyword(destinations[0], ' 오사 '), true)
  assert.equal(matchesDestinationKeyword(destinations[0], '일본'), true)
  assert.equal(matchesDestinationKeyword(destinations[0], '도쿄'), false)
  assert.equal(matchesDestinationKeyword(incompleteDestination, ''), false)

  const result = getDestinationResults(destinations, [{ countryName: '일본', cityName: '오사카' }], '오사')
  assert.deepEqual(result.destinationResults.map(({ cityName }) => cityName), ['오사카'])
})

test('destination 저장 검증은 도시명 또는 국가명의 exact match를 유지한다', () => {
  assert.deepEqual(
    findExactDestinationMatches(destinations, '오사카', '').map(({ id }) => id),
    [1, 2],
  )
  assert.deepEqual(
    findExactDestinationMatches(destinations, '오사카', '태국').map(({ id }) => id),
    [],
  )
  assert.deepEqual(findExactDestinationMatches([incompleteDestination], '', ''), [])
})

test('부분 도시 응답이 있으면 저장 요청의 전체 도시 목록을 보존한다', () => {
  const requested = [
    { countryName: '일본', cityName: '오사카', startDate: '2026-10-01', endDate: '2026-10-03' },
    { countryName: '일본', cityName: '교토', startDate: '2026-10-04', endDate: '2026-10-05' },
  ]

  assert.deepEqual(getPersistedPlannerCities(requested, [
    { countryName: '일본', cityName: '오사카', startDate: '2026-10-01', endDate: '2026-10-03' },
    { cityName: '교토' },
  ]), requested)
})

test('완전한 도시 응답은 서버가 반환한 목록을 사용한다', () => {
  const requested = [{ countryName: '일본', cityName: '오사카', startDate: '2026-10-01', endDate: '2026-10-03' }]
  const returned = [{ countryName: '일본', cityName: '나라', startDate: '2026-10-01', endDate: '2026-10-03' }]

  assert.deepEqual(getPersistedPlannerCities(requested, returned), returned)
})
