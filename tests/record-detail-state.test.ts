import assert from 'node:assert/strict'
import test from 'node:test'
import { createTestJiti } from './helpers.ts'

const jiti = createTestJiti()
const { getRecordDetailState } = await jiti.import('./src/widgets/record-detail/model/record-detail-state.ts').catch(() => ({})) as {
  getRecordDetailState?: (input: { hasRecord: boolean; isError: boolean; isLoading: boolean }) => string
}

test('기록 상세는 API 실패와 없는 기록 상태를 분리하고 캐시 데이터를 보존한다', () => {
  assert.equal(getRecordDetailState?.({ hasRecord: false, isError: true, isLoading: false }), 'error')
  assert.equal(getRecordDetailState?.({ hasRecord: false, isError: false, isLoading: false }), 'empty')
  assert.equal(getRecordDetailState?.({ hasRecord: true, isError: true, isLoading: false }), 'ready')
})
