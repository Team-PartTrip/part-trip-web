import { useMutation, useQueryClient } from '@tanstack/react-query'

import { completeMission } from './api'
import { missionQueryKeys } from './query-keys'

export function useCompleteMissionMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (missionId: number) => completeMission(missionId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: missionQueryKeys.all }),
  })
}
