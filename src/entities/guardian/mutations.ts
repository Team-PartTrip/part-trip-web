import { useMutation, useQueryClient } from '@tanstack/react-query'
import { acceptGuardianInvite, createGuardianInvite, unlinkGuardian } from './api'
import { guardianQueryKeys } from './queries'

export function useCreateGuardianInviteMutation() {
  return useMutation({ mutationFn: createGuardianInvite })
}

export function useAcceptGuardianInviteMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: acceptGuardianInvite,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: guardianQueryKeys.all }),
  })
}

export function useUnlinkGuardianMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: unlinkGuardian,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: guardianQueryKeys.all }),
  })
}
