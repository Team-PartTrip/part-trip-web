import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'

import { useAcquireCountryMutation, useWorldMapQuery, useWorldMapStatsQuery } from '@/entities/world-map'
import { useMyTrips } from '@/entities/trip-plan'
import { paths } from '@/shared/config'
import { readSessionValue, writeSessionValue } from '@/shared/libs/session-storage'
import { isPositiveSafeInteger } from '@/shared/utils'

import { getProfileInsightModel, type ProfileInsightKind } from './profile-insight'

export type { ProfileInsightKind } from './profile-insight'

const PROFILE_COUNTRY_KEY = 'parttrip:profile-selected-country'

export function useProfileInsightFlow(kind: ProfileInsightKind) {
  const navigate = useNavigate()
  const { hasError: hasTripsError, isLoading: isTripsLoading, trips } = useMyTrips()
  const needsWorldMap = kind === 'claim'
  const worldMapQuery = useWorldMapQuery(needsWorldMap)
  const worldMapStatsQuery = useWorldMapStatsQuery(false)
  const acquireCountryMutation = useAcquireCountryMutation()
  const [selectedCountry, setSelectedCountry] = useState(() => readSessionValue(PROFILE_COUNTRY_KEY) ?? '')
  const [claimFeedback, setClaimFeedback] = useState('')
  const model = getProfileInsightModel({
    kind,
    selectedCountry,
    trips,
    worldMap: worldMapQuery.data,
    worldMapStats: worldMapStatsQuery.data,
  })
  const isLoading = isTripsLoading || (needsWorldMap && worldMapQuery.isLoading)
  const hasError = hasTripsError || (needsWorldMap && worldMapQuery.isError)

  const selectCountry = (country: string) => {
    setSelectedCountry(country)
    writeSessionValue(PROFILE_COUNTRY_KEY, country)
    setClaimFeedback('')
  }

  const handleAcquireCountry = async () => {
    const tripId = model.selectedTrip?.tripId
    if (!isPositiveSafeInteger(tripId)) {
      setClaimFeedback('획득할 여행 기록을 찾을 수 없습니다.')
      return
    }

    try {
      const result = await acquireCountryMutation.mutateAsync({ tripId })
      setClaimFeedback(result.isNew ? `${model.activeCountry}을 새로 획득했어요.` : `${model.activeCountry}은 이미 획득한 국가예요.`)
    } catch {
      setClaimFeedback('국가 획득에 실패했습니다. 여행 기록을 확인해주세요.')
    }
  }

  return {
    ...model,
    acquireCountryPending: acquireCountryMutation.isPending,
    claimFeedback,
    hasError,
    handleAcquireCountry,
    isLoading,
    openCountries: () => navigate({ to: paths.profileCountries }),
    openMap: () => navigate({ to: paths.profileMap }),
    openRecords: () => navigate({ to: paths.record }),
    openYearReview: () => navigate({ to: paths.profileAchievements }),
    openRecord: (tripId: number) => navigate({ params: { recordId: String(tripId) }, to: '/record/$recordId' }),
    selectCountry,
    trips,
  }
}
