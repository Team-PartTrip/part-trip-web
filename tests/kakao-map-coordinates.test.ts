import assert from 'node:assert/strict'
import test from 'node:test'
import { hasMapCoordinates } from '../src/shared/libs/kakao-maps.ts'

test('지도 좌표는 국내 장소를 포함하며 좌표 누락·범위 초과·비정상 수를 제외한다', () => {
  assert.equal(hasMapCoordinates({ latitude: 35.79, longitude: 129.33 }), true)
  assert.equal(hasMapCoordinates({ latitude: 0, longitude: 0 }), true)
  for (const point of [{}, { latitude: 35.79, longitude: null }, { latitude: NaN, longitude: 129 }, { latitude: 91, longitude: 129 }, { latitude: 35, longitude: -181 }, { latitude: Infinity, longitude: 129 }]) assert.equal(hasMapCoordinates(point), false)
})
