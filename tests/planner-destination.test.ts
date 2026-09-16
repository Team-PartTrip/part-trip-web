import assert from 'node:assert/strict'
import test from 'node:test'

import {
  dedupeDestinations,
  findExactDestinationMatches,
  getDestinationResults,
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
