import { useEffect, useState } from 'react'
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
import { uniqueNotifications, matchesNotificationFilter, normalizeNotificationLinkType, type NotificationViewFilter } from './notification-presentation'

function useNotificationData() {
  const notificationsQuery = useNotificationsQuery('ALL')
  const unreadCountQuery = useUnreadNotificationCountQuery()
  const fetched = uniqueNotifications(notificationsQuery.data?.pages.flatMap((page) => page.items ?? []) ?? [])
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
      setActionError('알림을 읽음 처리하지 못했어요.')
    }
  }
  return { actionError, setActionError, markReadMutation, handleMarkRead }
}

export function useNotificationList() {
  const data = useNotificationData()
  const { actionError, setActionError, markReadMutation, handleMarkRead } = useReadNotification()
  const [selectedNotification, setSelectedNotification] = useState<NotificationResponseDto | null>(null)
  const [activeTab, setActiveTab] = useState<NotificationViewFilter>('ALL')
  const markAllMutation = useMarkAllNotificationsAsReadMutation()
  const notifications = data.notifications.filter((notification) => matchesNotificationFilter(notification, activeTab))
  const hasUnread = (data.unreadCount ?? 0) > 0
    || notifications.some((notification) => notification.read !== true && notification.notificationId != null)
  const handleNotificationClick = async (notification: NotificationResponseDto) => {
    if (notification.notificationId == null) return
    setActionError('')
    markReadMutation.reset()
    setSelectedNotification(notification)
    if (notification.read !== true) await handleMarkRead(notification.notificationId)
  }
  const handleMarkAll = async () => {
    try {
      setActionError('')
      await markAllMutation.mutateAsync()
    } catch {
      setActionError('알림을 모두 읽음 처리하지 못했어요.')
    }
  }
  return { selectedNotification, setSelectedNotification, markReadMutation, notificationsQuery: data.notificationsQuery, unreadCount: data.unreadCount, notifications, activeTab, setActiveTab, actionError, hasUnread, markAllMutation, handleMarkAll, handleNotificationClick }
}

export function useNotificationDetail(selectedNotification?: NotificationResponseDto) {
  const navigate = useNavigate()
  const { notificationId = '' } = useParams({ strict: false })
  const { notifications, notificationsQuery } = useNotificationData()
  const { actionError, markReadMutation, handleMarkRead } = useReadNotification()
  const detail = notifications.find((notification) => String(notification.notificationId) === (selectedNotification ? String(selectedNotification.notificationId) : notificationId)) ?? selectedNotification
  const { fetchNextPage, hasNextPage, isFetching, isError } = notificationsQuery
  const needsMorePages = !selectedNotification && Boolean(notificationId) && !detail && Boolean(hasNextPage) && !isError
  useEffect(() => {
    if (needsMorePages && !isFetching) void fetchNextPage()
  }, [needsMorePages, isFetching, fetchNextPage])
  const isDetailLoading = notificationsQuery.isLoading || needsMorePages
  const handleNotificationAction = async () => {
    if (!detail) return
    await handleMarkRead(detail.notificationId)
    const linkType = normalizeNotificationLinkType(detail.linkType)
    const linkId = detail.linkId
    if (linkType === 'GUARDIAN_LINK') {
      navigate({ to: paths.profileGuardians })
      return
    }
    if (linkType === 'TRIP_CARD' && linkId != null) {
      navigate({ params: { tripId: String(linkId) }, to: '/trip-cards/$tripId' })
      return
    }
    if (linkType === 'REGION_MAP') {
      navigate({ to: paths.profileMap });
      return;
    }
    if ((linkType === 'PLANNER' || linkType === 'GROUP' || linkType === 'GROUP_INVITATION') && linkId != null) {
      writeSessionValue(ACTIVE_PLANNER_ID_KEY, String(linkId))
      navigate({ to: '/planner/$plannerId', params: { plannerId: String(linkId) } })
    }
  }
  return { actionError, detail, isDetailLoading, notificationsQuery, markReadMutation, handleNotificationAction, navigate }
}
