import { useProfileCountriesFlow } from '../model/useProfileCountriesFlow'
import { ProfileCountriesView } from './ProfileInsightModeViews'
import { ProfileInsightFrame } from './ProfileInsightFrame'
import * as S from './ProfileInsightPage.styles'

export function ProfileCountriesPage() {
  const { activeRegion, hasError, isLoading, openRecord, regions, selectCountry } = useProfileCountriesFlow()
  return (
    <ProfileInsightFrame title={activeRegion?.name || '방문 지역'} subtitle={`국내 여행 기록 ${activeRegion?.trips.length ?? 0}회`} wide isLoading={isLoading} hasError={hasError} loadingContent={<S.LoadingLayout aria-busy="true" aria-label="여행 기록 로딩 중"><S.LoadingHeader /><S.LoadingGrid><S.LoadingPanel /><S.LoadingPanel /></S.LoadingGrid></S.LoadingLayout>}>
      <ProfileCountriesView activeRegion={activeRegion} regions={regions} onOpenRecord={openRecord} onSelectRegion={selectCountry} />
    </ProfileInsightFrame>
  )
}
