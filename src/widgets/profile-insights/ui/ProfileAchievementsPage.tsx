import { useMyTravelRecords } from '@/entities/trip-card'
import { getAnnualTravelSummary } from '../model/profile-insight'
import { ProfileAchievementsView } from './ProfileInsightModeViews'
import { ProfileInsightFrame } from './ProfileInsightFrame'
import * as S from './ProfileInsightPage.styles'

export function ProfileAchievementsPage() {
  const { hasError, isLoading, trips } = useMyTravelRecords()
  const year = new Date().getFullYear()
  const summary = getAnnualTravelSummary(trips, year)
  return (
    <ProfileInsightFrame title="올해의 여행 돌아보기" subtitle="올해 다녀온 지역과 여행을 한눈에 모아봐요." isLoading={isLoading} hasError={hasError} loadingContent={<S.LoadingLayout aria-busy="true" aria-label="여행 기록 로딩 중"><S.LoadingHeader /><S.LoadingSingle /></S.LoadingLayout>}>
      <ProfileAchievementsView summary={summary} year={year} />
    </ProfileInsightFrame>
  )
}
