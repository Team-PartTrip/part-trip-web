import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { useMyTravelRecords } from '@/entities/trip-card'
import { getRegionMap } from '@/entities/region-map/api'
import { readSessionValue, writeSessionValue } from '@/shared/libs/session-storage'
import { getProfileRegionModel } from './profile-insight'

const PROFILE_COUNTRY_KEY = 'parttrip:profile-selected-country'

export function useProfileCountriesFlow() {
  const navigate = useNavigate()
  const tripsQuery = useMyTravelRecords()
  const regionMapQuery = useQuery({ queryKey: ['region-map'], queryFn: getRegionMap })
  const [selectedCountry, setSelectedCountry] = useState(() => readSessionValue(PROFILE_COUNTRY_KEY) ?? '')
  const region = getProfileRegionModel(tripsQuery.trips, selectedCountry, regionMapQuery.data?.visited)

  const selectCountry = (country: string) => {
    setSelectedCountry(country)
    writeSessionValue(PROFILE_COUNTRY_KEY, country)
  }

  return {
    ...region,
    hasError: tripsQuery.hasError || regionMapQuery.isError,
    isLoading: tripsQuery.isLoading || regionMapQuery.isLoading,
    openRecord: (tripId: number) => navigate({ params: { recordId: String(tripId) }, to: '/record/$recordId' }),
    selectCountry,
  }
}
