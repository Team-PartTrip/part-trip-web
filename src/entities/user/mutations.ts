import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateProfile, type ProfileUpdateRequestDto } from './api'
import { userQueryKeys } from './queries'

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ProfileUpdateRequestDto) => updateProfile(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userQueryKeys.all }),
  })
}
