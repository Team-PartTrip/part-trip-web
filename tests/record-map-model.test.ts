import assert from 'node:assert/strict'
import test from 'node:test'

import { getRecordLocations, mapPosition, routeSegment } from '../src/widgets/record-map/model/record-map.ts'

test('record map은 Osaka bounds 안의 좌표를 percentage로 변환한다', () => {
  const position = mapPosition(34.675, 135.51)
  assert.ok(position)
  assert.equal(position.left, 50)
  assert.ok(Math.abs(position.top - 50) < 1e-9)
  assert.equal(mapPosition(34.8, 135.51), null)
  assert.equal(mapPosition(undefined, 135.51), null)
})

test('record map route segment는 시작점과 거리·각도를 계산한다', () => {
  assert.deepEqual(routeSegment({ left: 0, top: 0 }, { left: 3, top: 4 }), {
    angle: Math.atan2(4, 3) * 180 / Math.PI,
    left: 0,
    length: 5,
    top: 0,
  })
})

test('record map은 GPS가 있는 사진을 촬영 위치로 표시하고 좌표 없는 사진은 제외한다', () => {
  assert.deepEqual(getRecordLocations([
    { date: '2026-09-17', placeName: '오사카성', type: 'PLACE' },
    { latitude: 34.68, longitude: 135.52, takenAt: '2026-09-17T10:00:00+09:00', type: 'PHOTO' },
    { type: 'PHOTO' },
  ]), [
    { latitude: undefined, longitude: undefined, name: '오사카성', photos: '2026-09-17' },
    { latitude: 34.68, longitude: 135.52, name: '사진 촬영 위치', photos: '2026-09-17' },
  ])
})
