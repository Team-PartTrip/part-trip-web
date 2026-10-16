import assert from 'node:assert/strict'
import test from 'node:test'

import { getRecordLocations } from '../src/widgets/record-map/model/record-map.ts'

test('record map은 GPS가 있는 사진을 촬영 위치로 표시하고 좌표 없는 사진은 제외한다', () => {
  assert.deepEqual(getRecordLocations([
    { date: '2026-09-17', placeName: '오사카성', type: 'PLACE' },
    { latitude: 34.68, longitude: 135.52, takenAt: '2026-09-17T10:00:00+09:00', type: 'PHOTO' },
    { type: 'PHOTO' },
    { type: 'NO_INFO_PHOTO', latitude: 35.79, longitude: 129.33, placeName: '불국사', date: '2026-11-24' },
  ]), [
    { latitude: undefined, longitude: undefined, name: '오사카성', photos: '2026-09-17' },
    { latitude: 34.68, longitude: 135.52, name: '사진 촬영 위치', photos: '2026-09-17' },
    { latitude: 35.79, longitude: 129.33, name: '불국사', photos: '2026-11-24' },
  ])
})
