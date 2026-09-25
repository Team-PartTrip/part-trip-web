import { queryOptions, useQuery } from '@tanstack/react-query'
import { getTravelPreferences } from './api'
import { getUserProfile } from './profile-model'

export const userQueryKeys = {
  all: ['user'] as const,
  profile: () => [...userQueryKeys.all, 'profile'] as const,
  travelPreferences: () => [...userQueryKeys.all, 'travel-preferences'] as const,
}

export const userProfileQueryOptions = () =>
  queryOptions({
    queryKey: userQueryKeys.profile(),
    queryFn: getUserProfile,
  })

export function useUserProfileQuery() {
  return useQuery(userProfileQueryOptions())
}

export const travelPreferencesQueryOptions = () =>
  queryOptions({ queryKey: userQueryKeys.travelPreferences(), queryFn: getTravelPreferences })

export function useTravelPreferencesQuery() {
  return useQuery(travelPreferencesQueryOptions())
}
