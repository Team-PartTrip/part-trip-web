import assert from 'node:assert/strict'
import test from 'node:test'
import { supportedPlannerBlocks, tripBlockOptions, tripBlocks } from '../src/widgets/planner/model/trip-blocks.ts'

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
test('분 단위 걷기 선택을 유지하고 휠체어나 계단 답변으로 걷기 시간을 덮어쓰지 않는다', () => {
  const walking = [{ type: 'WALKING', value: '10분 이내' }]
  assert.deepEqual(tripBlocks(walking, draft, ['WALKING']), walking)
  for (const mobility of [[], ['STAIRS'], ['WHEELCHAIR']] as const) assert.deepEqual(tripBlocks([], draft, [...mobility]), [])
  assert.deepEqual(tripBlocks([], draft, ['WALKING']), [{ type: 'WALKING', value: '30분 이내' }])
})

test('서버에서 없어진 기준과 잘못된 선택값을 제외하고 단일·복수 선택을 검증한다', () => {
  const definitions = [
    { type: 'WALKING', multiple: false, options: ['10분 이내', '30분 이내', '1시간 이상'] },
    { type: 'TRAVEL_TYPE', multiple: true, options: ['미식', '휴양'] },
    { type: 'MUST_INCLUDE', multiple: true },
    { type: 'DAILY_DENSITY', options: ['직접 지정'] },
  ]
  assert.deepEqual(supportedPlannerBlocks([
    { type: 'BUDGET', value: '저렴하게' },
    { type: 'WALKING', value: '많이 걷기' },
    { type: 'WALKING', value: ' 10분 이내 ' },
    { type: 'WALKING', value: '30분 이내' },
    { type: 'TRAVEL_TYPE', value: '미식' },
    { type: 'TRAVEL_TYPE', value: '미식' },
    { type: 'TRAVEL_TYPE', value: '휴양' },
    { type: 'MUST_INCLUDE', value: ' 불국사 ' },
    { type: 'MUST_INCLUDE', value: ' ' },
    { type: 'DAILY_DENSITY', value: '하루 3곳' },
  ], definitions), [
    { type: 'WALKING', value: '10분 이내' },
    { type: 'TRAVEL_TYPE', value: '미식' },
    { type: 'TRAVEL_TYPE', value: '휴양' },
    { type: 'MUST_INCLUDE', value: '불국사' },
    { type: 'DAILY_DENSITY', value: '하루 3곳' },
  ])
  assert.deepEqual(supportedPlannerBlocks([{ type: 'WALKING', value: '10분 이내' }], []), [])
})
