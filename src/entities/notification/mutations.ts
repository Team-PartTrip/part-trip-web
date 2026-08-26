import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
  updateNotificationSettings,
  type NotificationSettingUpdateRequestDto,
} from './api'
import { notificationQueryKeys } from './query-keys'

export function useMarkNotificationAsReadMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (notificationId: number) => markNotificationAsRead(notificationId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all }),
  })
}

export function useMarkAllNotificationsAsReadMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all }),
  })
}

export function useUpdateNotificationSettingsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: NotificationSettingUpdateRequestDto) => updateNotificationSettings(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationQueryKeys.settings() }),
  })
}
