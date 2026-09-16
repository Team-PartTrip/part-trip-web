import assert from 'node:assert/strict'
import test from 'node:test'

import { mapPosition, routeSegment } from '../src/widgets/record-map/model/record-map.ts'

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
