import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteProfile, updateProfile, updateTravelPreferences, uploadProfileImage, type ProfileUpdateRequestDto, type TravelPreferenceRequestDto } from './api'
import { userQueryKeys } from './queries'

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ProfileUpdateRequestDto) => updateProfile(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userQueryKeys.all }),
  })
}

export function useDeleteProfileMutation() {
  return useMutation({ mutationFn: deleteProfile })
}

export function useUploadProfileImageMutation() {
  return useMutation({
    mutationFn: (file: File) => uploadProfileImage(file),
  })
}

export function useUpdateTravelPreferencesMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: TravelPreferenceRequestDto) => updateTravelPreferences(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userQueryKeys.travelPreferences() }),
  })
}
