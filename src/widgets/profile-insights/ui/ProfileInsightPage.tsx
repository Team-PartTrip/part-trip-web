import { AppShell } from '@/widgets/app-shell'

import { getAnnualTravelSummary } from '../model/profile-insight'
import { useProfileInsightFlow, type ProfileInsightKind } from '../model/useProfileInsightFlow'
import * as S from './ProfileInsightPage.styles'
import {
  ProfileAchievementsView,
  ProfileCountriesView,
  ProfileMapView,
} from './ProfileInsightModeViews'

export type { ProfileInsightKind } from '../model/useProfileInsightFlow'

export function ProfileInsightPage({ kind }: { kind: ProfileInsightKind }) {
  const {
    activeRegion,
    activeRegionTrips,
    domesticRegions,
    hasError,
    isLoading,
    openCountries,
    openRecords,
    openYearReview,
    openRecord,
    pageSubtitle,
    pageTitle,
    selectCountry,
    trips,
    unknownCities,
  } = useProfileInsightFlow(kind)

  return (
    <AppShell>
      <S.Page $wide={kind === 'countries'}>
        {!isLoading ? <S.Header $wide={kind === 'countries'} $hasSubtitle={Boolean(pageSubtitle)}><S.Title>{pageTitle}</S.Title>{pageSubtitle ? <S.Subtitle>{pageSubtitle}</S.Subtitle> : null}</S.Header> : null}
        {hasError ? <S.State role="alert">여행 기록을 불러오지 못했습니다.</S.State> : null}
        {isLoading ? <S.LoadingLayout aria-busy="true" aria-label="여행 기록 로딩 중"><S.LoadingHeader />{kind === 'map' || kind === 'countries' ? <S.LoadingGrid><S.LoadingPanel /><S.LoadingPanel /></S.LoadingGrid> : <S.LoadingSingle />}</S.LoadingLayout> : null}

        {!isLoading && !hasError && kind === 'map' ? <ProfileMapView regions={domesticRegions} unknownCities={unknownCities} onOpenCountries={openCountries} onOpenRecords={openRecords} onOpenYearReview={openYearReview} onSelectRegion={selectCountry} /> : null}
        {!isLoading && !hasError && kind === 'countries' ? <ProfileCountriesView activeRegion={activeRegion ? { ...activeRegion, trips: activeRegionTrips } : undefined} regions={domesticRegions} onOpenRecord={openRecord} onSelectRegion={selectCountry} /> : null}
        {!isLoading && !hasError && kind === 'achievements' ? <ProfileAchievementsView summary={getAnnualTravelSummary(trips, new Date().getFullYear())} year={new Date().getFullYear()} /> : null}
      </S.Page>
    </AppShell>
  )
}
