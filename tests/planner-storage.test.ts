import assert from 'node:assert/strict'
import test from 'node:test'

import {
  parsePlannerGroupSettings,
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
})
