import { useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'

import {
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
  useNotificationSettingsQuery,
  useNotificationsQuery,
  useUpdateNotificationSettingsMutation,
  type NotificationResponseDto,
  type NotificationType,
} from '@/entities/notification'
import { paths } from '@/shared/config'

export type NotificationMode = 'list' | 'detail' | 'settings'

export function notificationDate(value?: string) {
  return value ? new Date(value).toLocaleString('ko-KR') : '방금 전'
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
  const settingsQuery = useNotificationSettingsQuery(mode === 'settings')
  const markReadMutation = useMarkNotificationAsReadMutation()
  const markAllMutation = useMarkAllNotificationsAsReadMutation()
  const updateSettingsMutation = useUpdateNotificationSettingsMutation()
  const notifications = notificationsQuery.data?.items ?? []
  const settings = settingsQuery.data ?? []
  const detail = notifications.find((item) => String(item.notificationId) === notificationId)
  const hasUnread = notifications.some((item) => item.read !== true && item.notificationId != null)

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

  const handleMarkAll = async () => {
    try {
      setActionError('')
      await markAllMutation.mutateAsync()
    } catch {
      setActionError('알림을 모두 읽음 처리하지 못했습니다.')
    }
  }

  const handleSettingToggle = async (type?: NotificationType) => {
    if (type == null) return
    try {
      setActionError('')
      await updateSettingsMutation.mutateAsync({
        settings: settings.flatMap((setting) => setting.type == null ? [] : [{
          enabled: setting.type === type ? setting.enabled !== true : setting.enabled === true,
          type: setting.type,
        }]),
      })
    } catch {
      setActionError('알림 설정을 저장하지 못했습니다.')
    }
  }

  return {
    actionError,
    activeTab,
    detail,
    handleMarkAll,
    handleMarkRead,
    handleNotificationClick,
    handleSettingToggle,
    hasUnread,
    markAllMutation,
    markReadMutation,
    navigate,
    notifications,
    notificationsQuery,
    paths,
    setActiveTab,
    settings,
    settingsQuery,
    updateSettingsMutation,
  }
}
