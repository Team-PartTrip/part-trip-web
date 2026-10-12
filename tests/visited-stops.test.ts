import assert from 'node:assert/strict'
import test from 'node:test'
import { readVisitedStops, saveVisitedStops } from '../src/widgets/main/model/visited-stops.ts'

test('방문 표시는 날짜별 슬롯 ID로 복원되고 중복·잘못된 저장값을 처리한다', () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'window')
  const values = new Map<string, string>()
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { localStorage: {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  } } })
  try {
    assert.deepEqual(readVisitedStops('2026-10-12'), [])
    assert.equal(saveVisitedStops('2026-10-12', [10, 11, 10]), true)
    assert.deepEqual(readVisitedStops('2026-10-12'), [10, 11])
    assert.deepEqual(readVisitedStops('2026-10-13'), [])
    for (const invalid of ['{broken', 'null', '{}', '["10"]', '[0]', '[-1]', '[1.5]']) {
      values.set('parttrip:visited:2026-10-12', invalid)
      assert.deepEqual(readVisitedStops('2026-10-12'), [])
    }
  } finally {
    if (previous) Object.defineProperty(globalThis, 'window', previous)
    else Reflect.deleteProperty(globalThis, 'window')
  }
})

test('저장소가 차단되어도 방문 표시 조회는 안전하고 저장 실패를 알린다', () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'window')
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { get localStorage() { throw new Error('blocked') } } })
  try {
    assert.deepEqual(readVisitedStops('2026-10-12'), [])
    assert.equal(saveVisitedStops('2026-10-12', [10]), false)
  } finally {
    if (previous) Object.defineProperty(globalThis, 'window', previous)
    else Reflect.deleteProperty(globalThis, 'window')
  }
})
