import { queryOptions, useQuery } from '@tanstack/react-query'
import { getProfile, getUserProfile } from './api'

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
