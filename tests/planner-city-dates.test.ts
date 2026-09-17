import assert from 'node:assert/strict'
import test from 'node:test'

import { validatePlannerCityRanges } from '../src/widgets/planner/model/destination.ts'

const osaka = { countryName: '일본', cityName: '오사카', startDate: '2026-10-01', endDate: '2026-10-03' }
const kyoto = { countryName: '일본', cityName: '교토', startDate: '2026-10-04', endDate: '2026-10-05' }

test('planner city date ranges allow consecutive non-overlapping stays', () => {
  assert.equal(validatePlannerCityRanges([osaka, kyoto]), '')
})

test('planner city date ranges reject overlapping or reversed stays', () => {
  assert.notEqual(validatePlannerCityRanges([osaka, { ...kyoto, startDate: '2026-10-03' }]), '')
  assert.notEqual(validatePlannerCityRanges([{ ...osaka, endDate: '2026-09-30' }]), '')
  assert.notEqual(validatePlannerCityRanges([{ ...osaka, startDate: '2026-02-30' }]), '')
})

test('planner city date ranges require at least one complete destination', () => {
  assert.notEqual(validatePlannerCityRanges([]), '')
  assert.notEqual(validatePlannerCityRanges([{ ...osaka, cityName: '' }]), '')
})
