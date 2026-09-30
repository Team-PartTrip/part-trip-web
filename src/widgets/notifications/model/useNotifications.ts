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
import { matchesNotificationFilter, normalizeNotificationLinkType, type NotificationViewFilter } from './notification-presentation'

function useNotificationData() {
  const notificationsQuery = useNotificationsQuery('ALL')
  const unreadCountQuery = useUnreadNotificationCountQuery()
  const fetched = notificationsQuery.data?.pages.flatMap((page) => page.items ?? []) ?? []
  const unreadCount = unreadCountQuery.data?.unreadCount
  const notifications = unreadCount === 0 ? fetched.map((notification) => ({ ...notification, read: true })) : fetched
  return { notificationsQuery, notifications, unreadCount }
}

function useReadNotification() {
  const [actionError, setActionError] = useState('')
  const markReadMutation = useMarkNotificationAsReadMutation()
  const handleMarkRead = async (id?: number) => {
    if (id == null) return
    try {
      setActionError('')
      await markReadMutation.mutateAsync(id)
    } catch {
      setActionError('알림을 읽음 처리하지 못했습니다.')
    }
  }
  return { actionError, setActionError, markReadMutation, handleMarkRead }
}

export function useNotificationList() {
  const navigate = useNavigate()
  const data = useNotificationData()
  const { actionError, setActionError, handleMarkRead } = useReadNotification()
  const [activeTab, setActiveTab] = useState<NotificationViewFilter>('ALL')
  const markAllMutation = useMarkAllNotificationsAsReadMutation()
  const notifications = data.notifications.filter((notification) => matchesNotificationFilter(notification, activeTab))
  const hasUnread = (data.unreadCount ?? 0) > 0
    || notifications.some((notification) => notification.read !== true && notification.notificationId != null)
  const handleNotificationClick = async (notification: NotificationResponseDto) => {
    if (notification.notificationId == null) return
    if (notification.read !== true) await handleMarkRead(notification.notificationId)
    navigate({ params: { notificationId: String(notification.notificationId) }, to: '/notifications/$notificationId' })
  }
  const handleMarkAll = async () => {
    try {
      setActionError('')
      await markAllMutation.mutateAsync()
    } catch {
      setActionError('알림을 모두 읽음 처리하지 못했습니다.')
    }
  }
  return { notificationsQuery: data.notificationsQuery, unreadCount: data.unreadCount, notifications, activeTab, setActiveTab, actionError, hasUnread, markAllMutation, handleMarkAll, handleNotificationClick }
}

export function useNotificationDetail() {
  const navigate = useNavigate()
  const { notificationId = '' } = useParams({ strict: false })
  const { notifications, notificationsQuery } = useNotificationData()
  const { actionError, markReadMutation, handleMarkRead } = useReadNotification()
  const detail = notifications.find((notification) => String(notification.notificationId) === notificationId)
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
    }
  }
  return { actionError, detail, notificationsQuery, markReadMutation, handleNotificationAction, navigate }
}
