import { type InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query'

import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
  type NotificationPageResponseDto,
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
    onSuccess: (result) => {
      queryClient.setQueryData(notificationQueryKeys.unreadCount(), result)
      queryClient.setQueriesData<InfiniteData<NotificationPageResponseDto>>(
        { queryKey: [...notificationQueryKeys.all, 'list'] },
        (data) => data
          ? {
              ...data,
              pages: data.pages.map((page) => ({
                ...page,
                items: page.items?.map((notification) => ({ ...notification, read: true })),
              })),
            }
          : data,
      )
    },
  })
}
