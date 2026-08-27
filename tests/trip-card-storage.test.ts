import assert from 'node:assert/strict'
import test from 'node:test'

import {
  addHiddenTripIds,
  parseHiddenTripIds,
} from '../src/widgets/trip-cards/model/storage.ts'

test('숨긴 여행 카드 저장값과 선택값을 안전하게 합친다', () => {
  assert.deepEqual(parseHiddenTripIds('[1,2]'), [1, 2])
  assert.deepEqual(parseHiddenTripIds('{"id":1}'), [])
  assert.deepEqual(addHiddenTripIds([1, 2], [2, -1, 3]), [1, 2, 3])
})
