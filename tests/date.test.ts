import assert from 'node:assert/strict'
import test from 'node:test'

import { formatDate, getDateRangeDays } from '../src/shared/utils/date.ts'

test('날짜 포맷과 양끝 포함 기간을 공통 규칙으로 계산한다', () => {
  assert.equal(formatDate('2026-07-01'), '2026.07.01')
  assert.equal(getDateRangeDays('2026-07-01', '2026-07-03'), 3)
  assert.equal(getDateRangeDays('잘못된 날짜', '2026-07-03'), undefined)
  assert.equal(getDateRangeDays('2026-07-03', '2026-07-01'), undefined)
})
