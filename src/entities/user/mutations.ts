import { useMutation, useQueryClient } from '@tanstack/react-query'

import { updateProfile, uploadProfileImage, type ProfileUpdateRequestDto } from './api'
import { userQueryKeys } from './queries'

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ProfileUpdateRequestDto) => updateProfile(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userQueryKeys.all }),
  })
}

export function useUploadProfileImageMutation() {
  return useMutation({
    mutationFn: (file: File) => uploadProfileImage(file),
  })
}
