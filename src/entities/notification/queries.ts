import { infiniteQueryOptions, queryOptions, useInfiniteQuery, useQuery } from '@tanstack/react-query'

import {
  getNotifications,
  getUnreadNotificationCount,
  type NotificationFilter,
} from './api'
import { notificationQueryKeys } from './query-keys'

export const notificationsQueryOptions = (
  category: NotificationFilter = 'ALL',
  enabled = true,
) =>
  infiniteQueryOptions({
    queryKey: notificationQueryKeys.list(category),
    queryFn: ({ pageParam }) => getNotifications({ category, cursor: pageParam, size: 30 }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.hasNext ? lastPage.nextCursor : undefined,
    enabled,
  })

export function useNotificationsQuery(category: NotificationFilter = 'ALL', enabled = true) {
  return useInfiniteQuery(notificationsQueryOptions(category, enabled))
}

export const unreadNotificationCountQueryOptions = () =>
  queryOptions({
    queryKey: notificationQueryKeys.unreadCount(),
    queryFn: getUnreadNotificationCount,
  })

export function useUnreadNotificationCountQuery() {
  return useQuery(unreadNotificationCountQueryOptions())
}
