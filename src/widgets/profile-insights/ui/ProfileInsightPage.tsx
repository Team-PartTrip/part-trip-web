import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMyTrips } from '@/entities/trip-plan'
import { AppShell } from '@/widgets/app-shell'

import * as S from './ProfileInsightPage.styles'

export type ProfileInsightKind = 'map' | 'claim' | 'countries' | 'achievements'

const copy: Record<ProfileInsightKind, { title: string; subtitle: string }> = {
  map: { title: '내 세계지도', subtitle: '방문한 국가를 확인하세요.' },
  claim: { title: '방문 국가 획득', subtitle: '세계지도 API가 준비되면 이용할 수 있습니다.' },
  countries: { title: '국가별 여행 기록', subtitle: '나라를 선택하면 해당 국가의 여행 기록을 모아봅니다.' },
  achievements: { title: '여행 달성 현황', subtitle: '세계지도 API가 준비되면 이용할 수 있습니다.' },
}

const PROFILE_COUNTRY_KEY = 'parttrip:profile-selected-country'

function readSelectedCountry() {
  if (typeof window === 'undefined') return ''
  try {
    return window.sessionStorage.getItem(PROFILE_COUNTRY_KEY) ?? ''
  } catch {
    return ''
  }
}

function saveSelectedCountry(country: string) {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(PROFILE_COUNTRY_KEY, country)
  } catch {
    // Storage access can be blocked by browser privacy settings.
  }
}

export function ProfileInsightPage({ kind }: { kind: ProfileInsightKind }) {
  const navigate = useNavigate()
  const { hasError, isLoading, trips } = useMyTrips(kind === 'countries')
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(readSelectedCountry)
  const visitedCountries = [...new Set(trips.map((trip) => trip.countryName).filter((country): country is string => Boolean(country)))]
  const activeCountry = visitedCountries.includes(selectedCountry) ? selectedCountry : visitedCountries[0]
  const countryTrips = trips.filter((trip) => trip.countryName === activeCountry)
  const activeTrips = selectedCity ? countryTrips.filter((trip) => trip.cityName === selectedCity) : countryTrips
  const countryCities = [...new Set(countryTrips.map((trip) => trip.cityName).filter((city): city is string => Boolean(city)))]
  const countryPhotoCount = activeTrips.reduce((total, trip) => total + (trip.images?.length ?? 0), 0)
  const firstVisit = countryTrips.map((trip) => trip.startDate).filter(Boolean).sort()[0]?.replaceAll('-', '.') || '-'
  const { title, subtitle } = copy[kind]
  const pageTitle = kind === 'countries' ? activeCountry || title : title
  const pageSubtitle = kind === 'countries' ? `첫 방문 ${firstVisit}` : subtitle
  const selectCountry = (country: string) => {
    setSelectedCountry(country)
    saveSelectedCountry(country)
    setSelectedCity('')
  }

  return (
    <AppShell>
      <S.Page $wide={kind === 'countries'}>
        {!isLoading ? <S.Header $wide={kind === 'countries'} $hasSubtitle={Boolean(pageSubtitle)}><S.Title>{pageTitle}</S.Title>{pageSubtitle ? <S.Subtitle>{pageSubtitle}</S.Subtitle> : null}</S.Header> : null}
        {hasError ? <S.State role="alert">여행 기록을 불러오지 못했습니다.</S.State> : null}
        {isLoading ? <S.LoadingLayout aria-busy="true" aria-label="여행 정보 로딩 중"><S.LoadingHeader /><S.LoadingSingle /></S.LoadingLayout> : null}
        {!isLoading && !hasError && kind !== 'countries' ? <S.State role="status">최신 API 명세서에서 세계지도 API가 미구현 상태라 이 화면을 사용할 수 없습니다.</S.State> : null}
        {!isLoading && !hasError && kind === 'countries' ? activeCountry ? <S.CountryRecordsLayout><S.CountrySummaryCard><S.CountryCode>--</S.CountryCode><h2>{activeCountry}</h2><p>첫 방문 {firstVisit}</p><S.CountryMetrics><div><strong>{activeTrips.length}</strong><span>방문 횟수</span></div><div><strong>{countryCities.length}</strong><span>방문 도시</span></div><div><strong>{countryPhotoCount}</strong><span>총 기록</span></div></S.CountryMetrics></S.CountrySummaryCard><S.CountryRecordsPanel>{visitedCountries.length > 1 ? <S.CityTabs aria-label="방문 국가 선택">{visitedCountries.map((country) => <button key={country} type="button" className={activeCountry === country ? 'active' : ''} onClick={() => selectCountry(country)}>{country}</button>)}</S.CityTabs> : null}<S.SectionTitle>방문 도시</S.SectionTitle><S.CityTabs>{countryCities.map((city) => <button key={city} type="button" className={selectedCity === city ? 'active' : ''} onClick={() => setSelectedCity((current) => current === city ? '' : city)}>{city}</button>)}</S.CityTabs><S.SectionTitle>여행 기록</S.SectionTitle><S.CountryRecordList>{activeTrips.map((trip, index) => <S.CountryRecordRow key={trip.tripId ?? index} type="button" onClick={() => trip.tripId && navigate({ params: { recordId: String(trip.tripId) }, to: '/record/$recordId' })}><strong>{trip.title || `${trip.cityName || activeCountry} 여행`}</strong><span>{trip.startDate || '-'} – {trip.endDate || '-'}</span><b aria-hidden="true">›</b></S.CountryRecordRow>)}{activeTrips.length === 0 ? <S.Empty>선택한 국가의 여행 기록이 없습니다.</S.Empty> : null}</S.CountryRecordList></S.CountryRecordsPanel></S.CountryRecordsLayout> : <S.State>방문한 국가가 없습니다.</S.State> : null}
      </S.Page>
    </AppShell>
  )
}
