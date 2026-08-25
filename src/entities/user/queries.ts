import { queryOptions, useQuery } from '@tanstack/react-query'
import { getUserProfile } from './api'

export const userQueryKeys = {
  all: ['user'] as const,
  profile: () => [...userQueryKeys.all, 'profile'] as const,
}

export const userProfileQueryOptions = () =>
  queryOptions({
    queryKey: userQueryKeys.profile(),
    queryFn: getUserProfile,
  })

export function useUserProfileQuery() {
  return useQuery(userProfileQueryOptions())
}
