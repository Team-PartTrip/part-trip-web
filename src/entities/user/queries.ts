import { queryOptions, useQuery } from '@tanstack/react-query'
import { getProfile, getProfileStats, getTravelThemes } from './api'
import { getUserProfile } from './profile-model'

export const userQueryKeys = {
  all: ['user'] as const,
  profile: () => [...userQueryKeys.all, 'profile'] as const,
  source: () => [...userQueryKeys.all, 'source'] as const,
}

export const userProfileQueryOptions = () =>
  queryOptions({
    queryKey: userQueryKeys.profile(),
    queryFn: getUserProfile,
  })

export function useUserProfileQuery() {
  return useQuery(userProfileQueryOptions())
}

export const profileSourceQueryOptions = () =>
  queryOptions({
    queryKey: userQueryKeys.source(),
    queryFn: getProfile,
  })

export function useProfileSourceQuery() {
  return useQuery(profileSourceQueryOptions())
}

export const travelThemesQueryOptions = () =>
  queryOptions({
    queryKey: [...userQueryKeys.all, 'travel-themes'] as const,
    queryFn: getTravelThemes,
  })

export function useTravelThemesQuery() {
  return useQuery(travelThemesQueryOptions())
}

export const profileStatsQueryOptions = () =>
  queryOptions({
    queryKey: [...userQueryKeys.all, 'stats'] as const,
    queryFn: getProfileStats,
  })

export function useProfileStatsQuery() {
  return useQuery(profileStatsQueryOptions())
}
