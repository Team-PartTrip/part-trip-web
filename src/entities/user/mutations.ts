import { useMutation, useQueryClient } from '@tanstack/react-query'

import { deleteHome, deleteProfile, updateHome, updateProfile, updateTravelPreferences, uploadProfileImage, type HomeRequestDto, type ProfileUpdateRequestDto, type TravelPreferenceRequestDto } from './api'
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

export function useUpdateHomeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: HomeRequestDto) => updateHome(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userQueryKeys.travelPreferences() }),
  })
}

export function useDeleteHomeMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteHome,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: userQueryKeys.travelPreferences() }),
  })
}
