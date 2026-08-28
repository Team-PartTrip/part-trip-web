import { useMutation, useQueryClient } from '@tanstack/react-query'
import { acquireCountry } from './api'
import { worldMapQueryKeys } from './query-keys'

export function useAcquireCountryMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: acquireCountry,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: worldMapQueryKeys.map() }),
        queryClient.invalidateQueries({ queryKey: worldMapQueryKeys.stats() }),
      ])
    },
  })
}
