export function getMainQueryPresentation({
  isPlanLoading,
  isRecommendationsLoading,
  isScheduleLoading,
  isRecommendationsError,
  recommendationCount,
  isPlanError,
  hasPlanData,
}: {
  isPlanLoading: boolean
  isRecommendationsLoading: boolean
  isScheduleLoading: boolean
  isRecommendationsError: boolean
  recommendationCount: number
  isPlanError: boolean
  hasPlanData: boolean
}) {
  let recommendations: 'loading' | 'error' | 'empty' | 'ready'
  if (recommendationCount > 0) recommendations = 'ready'
  else if (isRecommendationsLoading) recommendations = 'loading'
  else if (isRecommendationsError) recommendations = 'error'
  else recommendations = 'empty'

  return {
    page: isPlanLoading ? 'loading' as const : isPlanError && !hasPlanData ? 'error' as const : 'ready' as const,
    recommendations,
    schedule: isScheduleLoading ? 'loading' as const : 'ready' as const,
    showPlanError: isPlanError && hasPlanData,
  }
}
