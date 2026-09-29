import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { useMyTravelRecords } from '@/entities/trip-card'
import { getRegionMap } from '@/entities/region-map/api'
import { paths } from '@/shared/config'
import { readSessionValue, writeSessionValue } from '@/shared/libs/session-storage'

import { getProfileInsightModel, type ProfileInsightKind } from './profile-insight'

export type { ProfileInsightKind } from './profile-insight'

const PROFILE_COUNTRY_KEY = 'parttrip:profile-selected-country'

export function useProfileInsightFlow(kind: ProfileInsightKind) {
  const navigate = useNavigate()
  const { hasError: hasTripsError, isLoading: isTripsLoading, trips } = useMyTravelRecords()
  const regionMapQuery = useQuery({ queryKey: ['region-map'], queryFn: getRegionMap, enabled: kind === 'map' || kind === 'countries' })
  const [selectedCountry, setSelectedCountry] = useState(() => readSessionValue(PROFILE_COUNTRY_KEY) ?? '')
  const model = getProfileInsightModel({
    kind,
    selectedCountry,
    trips,
    visitedRegions: regionMapQuery.data?.visited,
  })
  const isLoading = isTripsLoading || ((kind === 'map' || kind === 'countries') && regionMapQuery.isLoading)
  const hasError = hasTripsError || ((kind === 'map' || kind === 'countries') && regionMapQuery.isError)

  const selectCountry = (country: string) => {
    setSelectedCountry(country)
    writeSessionValue(PROFILE_COUNTRY_KEY, country)
  }

  return {
    ...model,
    hasError,
    isLoading,
    openCountries: () => navigate({ to: paths.profileCountries }),
    openRecords: () => navigate({ to: paths.record }),
    openYearReview: () => navigate({ to: paths.profileAchievements }),
    openRecord: (tripId: number) => navigate({ params: { recordId: String(tripId) }, to: '/record/$recordId' }),
    selectCountry,
    regionMapTrips: regionMapQuery.data?.trips ?? [],
    trips,
  }
}
