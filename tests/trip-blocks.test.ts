import assert from 'node:assert/strict'
import test from 'node:test'
import { tripBlockOptions, tripBlocks } from '../src/widgets/planner/model/trip-blocks.ts'

const draft = { cityName: '경주', regionName: '경북', regionCode: '47', startDate: '2099-01-01', endDate: '2099-01-02' }
const companion = { type: 'COMPANION', options: ['혼자', '친구', '가족'] }
const lodging = { type: 'LODGING_TYPE', options: ['호텔', '숙박 없음', '펜션'] }
test('혼자·같이 여행에 맞는 선택지와 미리 선택된 답', () => {
  assert.deepEqual(tripBlockOptions(companion, { ...draft, isSolo: true }), ['혼자'])
  assert.deepEqual(tripBlockOptions(companion, { ...draft, isSolo: false }), ['친구', '가족'])
  assert.deepEqual(tripBlockOptions(companion, draft), companion.options)
  assert.deepEqual(tripBlocks([{ type: 'COMPANION', value: '친구' }], { ...draft, isSolo: true }, null), [{ type: 'COMPANION', value: '혼자' }])
  assert.deepEqual(tripBlocks([{ type: 'COMPANION', value: '혼자' }], { ...draft, isSolo: false }, null), [])
})
test('당일치기는 숙박 없음으로 고정하고 숙박 여행은 숙박 없음을 제외', () => {
  const day = { ...draft, endDate: draft.startDate }
  assert.deepEqual(tripBlockOptions(lodging, day), ['숙박 없음'])
  assert.deepEqual(tripBlockOptions(lodging, draft), ['호텔', '펜션'])
  assert.deepEqual(tripBlocks([{ type: 'LODGING_TYPE', value: '호텔' }], day, null), [{ type: 'LODGING_TYPE', value: '숙박 없음' }])
  assert.deepEqual(tripBlocks([{ type: 'LODGING_TYPE', value: '숙박 없음' }], draft, null), [])
})
test('걷기 부담은 이동 편의 답만 따르고 미응답이면 기존 WALKING도 제거', () => {
  assert.deepEqual(tripBlocks([{ type: 'WALKING', value: '많이 걷기' }], draft, null), [])
  for (const mobility of [[], ['STAIRS']] as const) assert.equal(tripBlocks([], draft, [...mobility]).at(-1)?.value, '조금 걷기')
  for (const mobility of [['WHEELCHAIR'], ['WALKING'], ['STAIRS', 'WALKING']] as const) assert.equal(tripBlocks([], draft, [...mobility]).at(-1)?.value, '걷기 최소화')
})
