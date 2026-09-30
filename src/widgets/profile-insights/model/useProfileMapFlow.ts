import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { useMyTravelRecords } from '@/entities/trip-card'
import { getRegionMap } from '@/entities/region-map/api'
import { paths } from '@/shared/config'
import { writeSessionValue } from '@/shared/libs/session-storage'
import { getDomesticTravelModel } from './profile-insight'

const PROFILE_COUNTRY_KEY = 'parttrip:profile-selected-country'

export function useProfileMapFlow() {
  const navigate = useNavigate()
  const tripsQuery = useMyTravelRecords()
  const regionMapQuery = useQuery({ queryKey: ['region-map'], queryFn: getRegionMap })
  const domestic = getDomesticTravelModel(tripsQuery.trips)
  const selectCountry = (country: string) => {
    writeSessionValue(PROFILE_COUNTRY_KEY, country)
  }
  return {
    hasError: tripsQuery.hasError || regionMapQuery.isError,
    isLoading: tripsQuery.isLoading || regionMapQuery.isLoading,
    trips: regionMapQuery.data?.trips ?? [],
    unknownCities: domestic.unknownCities,
    selectCountry,
    openCountries: () => navigate({ to: paths.profileCountries }),
    openRecords: () => navigate({ to: paths.record }),
    openYearReview: () => navigate({ to: paths.profileAchievements }),
  }
}
