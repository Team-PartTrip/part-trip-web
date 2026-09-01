import { useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'

import {
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
  useNotificationsQuery,
  useUnreadNotificationCountQuery,
  type NotificationResponseDto,
} from '@/entities/notification'
import { paths } from '@/shared/config'
import { isPositiveSafeInteger } from '@/shared/utils'

const ACTIVE_PLANNER_ID_KEY = 'parttrip:active-planner-id'
const ACTIVE_VOTE_ID_KEY = 'parttrip:active-vote-id'

function readSessionId(key: string) {
  if (typeof window === 'undefined') return 0
  try {
    const value = Number(window.sessionStorage.getItem(key))
    return isPositiveSafeInteger(value) ? value : 0
  } catch {
    return 0
  }
}

export type NotificationMode = 'list' | 'detail'

export function notificationDate(value?: string) {
  if (!value) return '방금 전'
  const timestamp = Date.parse(value)
  return Number.isNaN(timestamp) ? '방금 전' : new Date(timestamp).toLocaleString('ko-KR')
}

export function notificationTypeLabel(notification: NotificationResponseDto) {
  if (notification.category === 'VOTE') return '투표'
  if (notification.category === 'RECORD') return '기록'
  return '알림'
}

export function useNotificationFlow(mode: NotificationMode) {
  const navigate = useNavigate()
  const { notificationId = '' } = useParams({ strict: false })
  const [activeTab, setActiveTab] = useState<'ALL' | 'VOTE' | 'RECORD'>('ALL')
  const [actionError, setActionError] = useState('')
  const category = mode === 'list' ? activeTab : 'ALL'
  const notificationsQuery = useNotificationsQuery(category, mode === 'list' || mode === 'detail')
  const unreadCountQuery = useUnreadNotificationCountQuery()
  const markReadMutation = useMarkNotificationAsReadMutation()
  const markAllMutation = useMarkAllNotificationsAsReadMutation()
  const notifications = notificationsQuery.data?.pages.flatMap((page) => page.items ?? []) ?? []
  const detail = notifications.find((item) => String(item.notificationId) === notificationId)
  const canNavigateToVote = detail?.linkType?.trim().toUpperCase() === 'VOTE'
    && isPositiveSafeInteger(detail.linkId)
    && isPositiveSafeInteger(readSessionId(ACTIVE_PLANNER_ID_KEY))
  const hasUnread = (unreadCountQuery.data?.unreadCount ?? notifications.filter((item) => item.isRead !== true && item.notificationId != null).length) > 0

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
    if (notification.isRead !== true) await handleMarkRead(notification.notificationId)
    navigate({ params: { notificationId: String(notification.notificationId) }, to: '/notifications/$notificationId' })
  }

  const handleNotificationAction = async () => {
    if (!detail) return
    await handleMarkRead(detail.notificationId)
    const linkType = detail.linkType?.trim().toUpperCase()
    const linkId = detail.linkId

    if (linkType === 'TRIP_CARD' && linkId != null) {
      navigate({ params: { tripId: String(linkId) }, to: '/trip-cards/$tripId' })
      return
    }

    if ((linkType === 'GROUP' || linkType === 'GROUP_INVITATION') && linkId != null) {
      sessionStorage.setItem(ACTIVE_PLANNER_ID_KEY, String(linkId))
      navigate({ to: paths.plannerProgress })
      return
    }

    // The latest notification DTO exposes one linkId; use it as voteId only with the active planner context.
    if (linkType === 'VOTE' && isPositiveSafeInteger(linkId)) {
      const activePlannerId = readSessionId(ACTIVE_PLANNER_ID_KEY)
      if (!isPositiveSafeInteger(activePlannerId)) {
        setActionError('투표 알림의 여행 계획 정보를 확인할 수 없습니다.')
        return
      }
      try {
        window.sessionStorage.setItem(ACTIVE_VOTE_ID_KEY, String(linkId))
      } catch {
        setActionError('투표 알림을 열 수 없습니다.')
        return
      }
      navigate({ to: paths.plannerVote })
      return
    }

    if (linkType === 'WORLD_MAP') {
      navigate({ to: paths.profileMap })
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
    canNavigateToVote,
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
    paths,
    setActiveTab,
  }
}
