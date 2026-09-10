import { AppShell } from '@/widgets/app-shell'

import { useProfileInsightFlow, type ProfileInsightKind } from '../model/useProfileInsightFlow'
import * as S from './ProfileInsightPage.styles'
import {
  ProfileAchievementsView,
  ProfileClaimView,
  ProfileCountriesView,
  ProfileMapView,
} from './ProfileInsightModeViews'

export type { ProfileInsightKind } from '../model/useProfileInsightFlow'

export function ProfileInsightPage({ kind }: { kind: ProfileInsightKind }) {
  const {
    acquiredCount,
    achievementPercentage,
    activeCountry,
    acquireCountryPending,
    claimCountries,
    claimFeedback,
    continentProgress,
    countryCities,
    countryCode,
    countryTrips,
    firstVisit,
    handleAcquireCountry,
    hasError,
    isLoading,
    openCountries,
    openMap,
    openRecord,
    pageSubtitle,
    pageTitle,
    selectedCity,
    selectCountry,
    setSelectedCity,
    totalCountries,
    trips,
    visited,
    visitedCountries,
  } = useProfileInsightFlow(kind)

  return (
    <AppShell>
      <S.Page $wide={kind === 'countries'}>
        {!isLoading ? <S.Header $wide={kind === 'countries'} $hasSubtitle={Boolean(pageSubtitle)}><S.Title>{pageTitle}</S.Title>{pageSubtitle ? <S.Subtitle>{pageSubtitle}</S.Subtitle> : null}</S.Header> : null}
        {hasError ? <S.State role="alert">세계지도 정보를 불러오지 못했습니다.</S.State> : null}
        {isLoading ? <S.LoadingLayout aria-busy="true" aria-label="세계지도 정보 로딩 중"><S.LoadingHeader />{kind === 'map' || kind === 'countries' ? <S.LoadingGrid><S.LoadingPanel /><S.LoadingPanel /></S.LoadingGrid> : <S.LoadingSingle />}</S.LoadingLayout> : null}

        {!isLoading && !hasError && kind === 'map' ? <ProfileMapView totalCountries={totalCountries} trips={trips} visited={visited} visitedCountries={visitedCountries} onOpenCountries={openCountries} onSelectCountry={selectCountry} /> : null}
        {!isLoading && !hasError && kind === 'claim' ? <ProfileClaimView acquiredCount={acquiredCount} activeCountry={activeCountry} claimCountries={claimCountries} claimFeedback={claimFeedback} countryCode={countryCode} countryTrips={countryTrips} isPending={acquireCountryPending} onAcquire={() => void handleAcquireCountry()} onMap={openMap} onSelectCountry={selectCountry} totalCountries={totalCountries} achievementPercentage={achievementPercentage} /> : null}
        {!isLoading && !hasError && kind === 'countries' ? <ProfileCountriesView activeCountry={activeCountry} acquiredCount={acquiredCount} countryCities={countryCities} countryCode={countryCode} firstVisit={firstVisit} onOpenRecord={openRecord} onSelectCity={setSelectedCity} onSelectCountry={selectCountry} selectedCity={selectedCity} totalCountries={totalCountries} visitedCountries={visitedCountries} trips={countryTrips} /> : null}
        {!isLoading && !hasError && kind === 'achievements' ? <ProfileAchievementsView acquiredCount={acquiredCount} achievementPercentage={achievementPercentage} continentProgress={continentProgress} totalCountries={totalCountries} /> : null}
      </S.Page>
    </AppShell>
  )
}
