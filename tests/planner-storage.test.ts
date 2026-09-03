import assert from 'node:assert/strict'
import test from 'node:test'

import {
  parsePlannerGroupSettings,
  parsePlannerSelectedPlacesByCategory,
  parsePlannerSelectedIndexes,
} from '../src/widgets/planner/model/storage.ts'

test('플래너 세션 저장값은 허용된 범위만 복원한다', () => {
  assert.deepEqual(
    parsePlannerGroupSettings(JSON.stringify({ isSolo: true, memberCount: 3 })),
    { isSolo: true, memberCount: 3 },
  )
  assert.deepEqual(parsePlannerGroupSettings('{"memberCount":99}'), { isSolo: false, memberCount: 2 })
  assert.deepEqual(parsePlannerGroupSettings('invalid'), { isSolo: false, memberCount: 2 })
  assert.deepEqual(parsePlannerSelectedIndexes('[0,2,4]'), [0, 2, 4])
  assert.deepEqual(parsePlannerSelectedIndexes('[0,-1]'), [])
  assert.deepEqual(
    parsePlannerSelectedPlacesByCategory('{"맛집":[{"tourPlaceId":1,"placeName":"라멘"}],"명소":[{"tourPlaceId":2,"placeName":"공원"}]}'),
    { 맛집: [{ tourPlaceId: 1, placeName: '라멘' }], 명소: [{ tourPlaceId: 2, placeName: '공원' }] },
  )
  assert.deepEqual(parsePlannerSelectedPlacesByCategory('{"맛집":[{"tourPlaceId":0}]}'), {})
})
