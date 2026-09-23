import { useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'

import {
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
  useNotificationsQuery,
  useUnreadNotificationCountQuery,
  type NotificationResponseDto,
} from '@/entities/notification'
import { ACTIVE_PLANNER_ID_KEY, paths } from '@/shared/config'
import { writeSessionValue } from '@/shared/libs/session-storage'

import { normalizeNotificationLinkType } from './notification-presentation'
import { matchesNotificationFilter, type NotificationViewFilter } from './notification-presentation'

export type NotificationMode = 'list' | 'detail'

export function useNotificationFlow(mode: NotificationMode) {
  const navigate = useNavigate()
  const { notificationId = '' } = useParams({ strict: false })
  const [activeTab, setActiveTab] = useState<NotificationViewFilter>('ALL')
  const [actionError, setActionError] = useState('')
  const notificationsQuery = useNotificationsQuery('ALL', mode === 'list' || mode === 'detail')
  const unreadCountQuery = useUnreadNotificationCountQuery()
  const markReadMutation = useMarkNotificationAsReadMutation()
  const markAllMutation = useMarkAllNotificationsAsReadMutation()
  const fetchedNotifications = notificationsQuery.data?.pages.flatMap((page) => page.items ?? []) ?? []
  const allNotifications = unreadCountQuery.data?.unreadCount === 0
    ? fetchedNotifications.map((notification) => ({ ...notification, read: true }))
    : fetchedNotifications
  const notifications = mode === 'list'
    ? allNotifications.filter((notification) => matchesNotificationFilter(notification, activeTab))
    : allNotifications
  const detail = notifications.find((item) => String(item.notificationId) === notificationId)
  const hasUnread = (unreadCountQuery.data?.unreadCount ?? 0) > 0
    || notifications.some((item) => item.read !== true && item.notificationId != null)

  const handleMarkRead = async (id?: number) => {
    if (id == null) return
    try {
      setActionError('')
      await markReadMutation.mutateAsync(id)
    } catch {
      setActionError('알림을 읽음 처리하지 못했습니다.')
    }
  }

  const handleNotificationClick = async (notification: NotificationResponseDto) => {
    if (notification.notificationId == null) return
    if (notification.read !== true) await handleMarkRead(notification.notificationId)
    navigate({ params: { notificationId: String(notification.notificationId) }, to: '/notifications/$notificationId' })
  }

  const handleNotificationAction = async () => {
    if (!detail) return
    await handleMarkRead(detail.notificationId)
    const linkType = normalizeNotificationLinkType(detail.linkType)
    const linkId = detail.linkId

    if (linkType === 'TRIP_CARD' && linkId != null) {
      navigate({ params: { tripId: String(linkId) }, to: '/trip-cards/$tripId' })
      return
    }

    if ((linkType === 'GROUP' || linkType === 'GROUP_INVITATION') && linkId != null) {
      writeSessionValue(ACTIVE_PLANNER_ID_KEY, String(linkId))
      navigate({ to: paths.plannerProgress })
      return
    }

  }

  const handleMarkAll = async () => {
    try {
      setActionError('')
      await markAllMutation.mutateAsync()
    } catch {
      setActionError('알림을 모두 읽음 처리하지 못했습니다.')
    }
  }

  return {
    actionError,
    activeTab,
    detail,
    handleMarkAll,
    handleMarkRead,
    handleNotificationClick,
    handleNotificationAction,
    hasUnread,
    markAllMutation,
    markReadMutation,
    navigate,
    notifications,
    notificationsQuery,
    unreadCount: unreadCountQuery.data?.unreadCount,
    paths,
    setActiveTab,
  }
}
