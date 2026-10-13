import assert from 'node:assert/strict'
import test from 'node:test'
import { getPreferenceAnswers, togglePreference } from '../src/widgets/planner/model/preference-answers.ts'

const pref = { preferredTransport: 'CAR', dailyScheduleCount: 4, canUseStairs: false } as const

test('편의 미응답은 저장하지 않고 기존 응답은 덮어쓰지 않는다', () => {
  assert.equal(getPreferenceAnswers(undefined, [], []), undefined)
  assert.equal(getPreferenceAnswers(pref, null, null), undefined)
  assert.equal(getPreferenceAnswers({ ...pref, usesWheelchair: false, limitedWalking: false, avoidFoods: [] }, ['WHEELCHAIR'], ['MEAT']), undefined)
  assert.deepEqual(getPreferenceAnswers({ ...pref, usesWheelchair: true }, [], ['MEAT']), { ...pref, avoidFoods: ['MEAT'] })
})

test('편의 없음과 복수 응답은 기존 이동수단과 밀도를 유지하고 질문별로 저장한다', () => {
  assert.deepEqual(getPreferenceAnswers(pref, [], null), { ...pref, usesWheelchair: false, limitedWalking: false })
  assert.deepEqual(getPreferenceAnswers(pref, null, []), { ...pref, avoidFoods: [] })
  assert.deepEqual(getPreferenceAnswers(pref, ['WHEELCHAIR', 'WALKING'], ['SPICY', 'HARD']), {
    ...pref, usesWheelchair: true, limitedWalking: true, canUseStairs: false, avoidFoods: ['SPICY', 'HARD'],
  })
  assert.equal(getPreferenceAnswers(pref, ['STAIRS'], null)?.canUseStairs, false)
  assert.equal(getPreferenceAnswers(pref, ['WALKING'], null)?.canUseStairs, false)
})

test('계단이나 휠체어를 고르지 않으면 기존 계단 설정을 유지한다', () => {
  for (const canUseStairs of [false, true]) {
    const preferences = { ...pref, canUseStairs }
    for (const mobility of [[], ['WALKING']] as const) {
      assert.equal(getPreferenceAnswers(preferences, [...mobility], null)?.canUseStairs, canUseStairs)
    }
    assert.equal(getPreferenceAnswers(preferences, null, ['MEAT'])?.canUseStairs, canUseStairs)
    assert.equal(getPreferenceAnswers(preferences, ['STAIRS'], null)?.canUseStairs, false)
    assert.equal(getPreferenceAnswers(preferences, ['WHEELCHAIR'], null)?.canUseStairs, false)
  }
})

test('없음 선택은 다른 항목을 지우고 다른 항목 선택은 없음 표시를 해제한다', () => {
  assert.deepEqual(togglePreference(['WHEELCHAIR', 'STAIRS'], null), [])
  assert.deepEqual(togglePreference([], 'WALKING'), ['WALKING'])
  assert.deepEqual(togglePreference(['MEAT'], 'DAIRY'), ['MEAT', 'DAIRY'])
  assert.deepEqual(togglePreference(['MEAT', 'DAIRY'], 'MEAT'), ['DAIRY'])
})
