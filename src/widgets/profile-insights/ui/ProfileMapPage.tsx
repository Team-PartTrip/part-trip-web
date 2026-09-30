import { lazy, Suspense } from 'react'

import { useProfileMapFlow } from '../model/useProfileMapFlow'
import { ProfileInsightFrame } from './ProfileInsightFrame'
import * as S from './ProfileInsightPage.styles'

const ProfileMapView = lazy(() => import('./ProfileMapView'))

export function ProfileMapPage() {
  const { hasError, isLoading, openCountries, openRecords, openYearReview, selectCountry, trips, unknownCities } = useProfileMapFlow()
  return (
    <ProfileInsightFrame title="내 국내 여행 지도" subtitle="여행 카드 사진 위치로 방문한 시·군·구를 표시합니다." isLoading={isLoading} hasError={hasError} loadingContent={<S.LoadingLayout aria-busy="true" aria-label="여행 기록 로딩 중"><S.LoadingHeader /><S.LoadingGrid><S.LoadingPanel /><S.LoadingPanel /></S.LoadingGrid></S.LoadingLayout>}>
      <Suspense fallback={<S.LoadingSingle aria-label="지도 로딩 중" />}>
        <ProfileMapView trips={trips} unknownCities={unknownCities} onOpenCountries={openCountries} onOpenRecords={openRecords} onOpenYearReview={openYearReview} onSelectRegion={selectCountry} />
      </Suspense>
    </ProfileInsightFrame>
  )
}
