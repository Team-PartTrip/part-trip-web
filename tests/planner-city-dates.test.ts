import assert from 'node:assert/strict'
import test from 'node:test'
import { createJiti } from 'jiti'

const jiti = createJiti(process.cwd(), { alias: { '@': `${process.cwd()}/src` } })
const { isValidPlannerDateRange, overlapsExistingTrip } = await jiti.import('./src/widgets/planner/model/planner-date.ts') as {
  isValidPlannerDateRange: (start: string, end: string) => boolean
  overlapsExistingTrip: (trips: Array<{ startDate?: string; endDate?: string; status?: string }>, start: string, end: string) => boolean
}

test('planner date range requires real dates and allows at most 14 inclusive days', () => {
  assert.equal(isValidPlannerDateRange('2026-10-01', '2026-10-14'), true)
  assert.equal(isValidPlannerDateRange('2026-10-01', '2026-10-15'), false)
  assert.equal(isValidPlannerDateRange('2026-02-30', '2026-03-02'), false)
  assert.equal(isValidPlannerDateRange('2026-10-03', '2026-10-02'), false)
  assert.equal(isValidPlannerDateRange('', '2026-10-02'), false)
})

test('planner date range blocks overlapping active trips but permits adjacent and ended trips', () => {
  const trip = { startDate: '2026-10-01', endDate: '2026-10-03', status: 'BEFORE' }
  assert.equal(overlapsExistingTrip([trip], '2026-10-03', '2026-10-04'), true)
  assert.equal(overlapsExistingTrip([trip], '2026-10-04', '2026-10-05'), false)
  assert.equal(overlapsExistingTrip([{ ...trip, status: 'ENDED' }], '2026-10-02', '2026-10-02'), false)
})
