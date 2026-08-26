import { queryOptions, useQuery } from '@tanstack/react-query'

import {
  getNotificationSettings,
  getNotifications,
  getUnreadNotificationCount,
  type NotificationFilter,
} from './api'
import { notificationQueryKeys } from './query-keys'

export const notificationsQueryOptions = (
  category: NotificationFilter = 'ALL',
  enabled = true,
) =>
  queryOptions({
    queryKey: notificationQueryKeys.list(category),
    queryFn: () => getNotifications({ category, size: 30 }),
    enabled,
  })

export function useNotificationsQuery(category: NotificationFilter = 'ALL', enabled = true) {
  return useQuery(notificationsQueryOptions(category, enabled))
}

export const notificationSettingsQueryOptions = (enabled = true) =>
  queryOptions({
    queryKey: notificationQueryKeys.settings(),
    queryFn: getNotificationSettings,
    enabled,
  })

export function useNotificationSettingsQuery(enabled = true) {
  return useQuery(notificationSettingsQueryOptions(enabled))
}

export const unreadNotificationCountQueryOptions = () =>
  queryOptions({
    queryKey: notificationQueryKeys.unreadCount(),
    queryFn: getUnreadNotificationCount,
  })

export function useUnreadNotificationCountQuery() {
  return useQuery(unreadNotificationCountQueryOptions())
}
