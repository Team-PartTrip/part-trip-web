import assert from 'node:assert/strict'
import test from 'node:test'
import { withRouteTimeout } from '../src/widgets/planner/model/route-timeout.ts'
import { createTestJiti } from './helpers.ts'
import type { PlannerScheduleResponseDto } from '../src/entities/planner/types.ts'

const jiti = createTestJiti()
const { getErrorMessage } = await jiti.import('./src/shared/utils/errorMessage.ts') as typeof import('../src/shared/utils/errorMessage.ts')
const { eventDateLabel } = await jiti.import('./src/widgets/record-calendar/model/festivals.ts') as typeof import('../src/widgets/record-calendar/model/festivals.ts')

test('경로 시간 초과는 계산 중인 경로만 화면에서 실패로 바꾸고 원본과 저장 내용을 보존한다', () => {
  const schedule: PlannerScheduleResponseDto = { days: [{ date: '2026-10-16', slots: [
    { routeStatus: 'CALCULATING', tourPlaceId: 1 }, { routeStatus: 'READY', tourPlaceId: 2 }, { routeStatus: 'API_ERROR', tourPlaceId: 3 },
  ] }] }
  assert.equal(withRouteTimeout(schedule, false), schedule)
  const displayed = withRouteTimeout(schedule, true)
  assert.deepEqual(displayed.days?.[0].slots?.map(slot => slot.routeStatus), ['API_ERROR', 'READY', 'API_ERROR'])
  assert.equal(schedule.days?.[0].slots?.[0].routeStatus, 'CALCULATING')
  assert.equal(displayed.days?.[0].slots?.[0].tourPlaceId, 1)
})

test('서버 안내를 우선하고 빈 응답과 네트워크 실패에는 화면 안내를 사용한다', () => {
  const fallback = '다시 시도해주세요.'
  const error = (data: unknown) => ({ isAxiosError: true, message: 'Request failed with status code 400', response: { data } })
  assert.equal(getErrorMessage(error({ message: '반드시 포함할 곳이 너무 많아요.' }), fallback), '반드시 포함할 곳이 너무 많아요.')
  assert.equal(getErrorMessage(error({ message: ' ' }), fallback), fallback)
  assert.equal(getErrorMessage(error({}), fallback), fallback)
  assert.equal(getErrorMessage(new Error('Network Error'), fallback), fallback)
})

test('축제는 하루 또는 전체 기간과 시간을 표시한다', () => {
  assert.equal(eventDateLabel({ startDate: '2026-10-27', endDate: '2026-11-22' }), '10.27 – 11.22')
  assert.equal(eventDateLabel({ startDate: '2026-10-27', endDate: '2026-10-27', startTime: '10:00' }), '10.27 · 10:00')
})
