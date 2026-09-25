import assert from 'node:assert/strict'
import test from 'node:test'
import { createTestJiti } from './helpers.ts'

const jiti = createTestJiti()
const { getMainQueryPresentation } = await jiti.import('./src/widgets/main/model/main-query-presentation.ts').catch(() => ({})) as {
  getMainQueryPresentation?: (input: {
    isPlanLoading: boolean
  isRecommendationsLoading: boolean
  isScheduleLoading: boolean
  isRecommendationsError: boolean
  recommendationCount: number
  isPlanError: boolean
  hasPlanData: boolean
}) => { page: string; recommendations: string; schedule: string; showPlanError: boolean }
}

test('추천이나 오늘 일정 로딩은 여행 요약 화면을 막지 않는다', () => {
  assert.deepEqual(getMainQueryPresentation?.({
    isPlanLoading: false,
    isRecommendationsLoading: true,
    isScheduleLoading: true,
    isRecommendationsError: false,
    recommendationCount: 0,
    isPlanError: false,
    hasPlanData: true,
  }), { page: 'ready', recommendations: 'loading', schedule: 'loading', showPlanError: false })
})

test('추천 장소의 실패는 추천 섹션에만 반영된다', () => {
  assert.deepEqual(getMainQueryPresentation?.({
    isPlanLoading: false,
    isRecommendationsLoading: false,
    isScheduleLoading: false,
    isRecommendationsError: true,
    recommendationCount: 0,
    isPlanError: false,
    hasPlanData: true,
  }), { page: 'ready', recommendations: 'error', schedule: 'ready', showPlanError: false })
})

test('재조회가 실패해도 보관된 여행 계획을 계속 표시한다', () => {
  assert.deepEqual(getMainQueryPresentation?.({
    isPlanLoading: false,
    isRecommendationsLoading: false,
    isScheduleLoading: false,
    isRecommendationsError: false,
    recommendationCount: 0,
    isPlanError: true,
    hasPlanData: true,
  }), { page: 'ready', recommendations: 'empty', schedule: 'ready', showPlanError: true })
})

test('여행 계획이 없고 API가 실패하면 Main 오류 상태를 표시한다', () => {
  assert.deepEqual(getMainQueryPresentation?.({
    isPlanLoading: false,
    isRecommendationsLoading: false,
    isScheduleLoading: false,
    isRecommendationsError: false,
    recommendationCount: 0,
    isPlanError: true,
    hasPlanData: false,
  }), { page: 'error', recommendations: 'empty', schedule: 'ready', showPlanError: false })
})
