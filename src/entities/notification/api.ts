import { apiClient } from '@/shared/libs/api-client'
export type NotificationType = string
export type NotificationFilter = 'ALL' | 'VOTE' | 'RECORD'

export type NotificationResponseDto = {
  notificationId?: number
  type?: NotificationType
  category?: Exclude<NotificationFilter, 'ALL'>
  title?: string
  body?: string
  linkType?: string
  linkId?: number
  read?: boolean
  createdAt?: string
}

export type NotificationPageResponseDto = {
  items?: NotificationResponseDto[]
  nextCursor?: number
  hasNext?: boolean
}

export type UnreadCountResponseDto = {
  unreadCount?: number
}

const NOTIFICATION_API_PATHS = {
  base: '/notifications',
  read: (notificationId: number) => `/notifications/${notificationId}/read`,
  readAll: '/notifications/read-all',
  unreadCount: '/notifications/unread-count',
} as const

export async function getNotifications(params?: {
  category?: NotificationFilter
  cursor?: number
  size?: number
}): Promise<NotificationPageResponseDto> {
  const { data } = await apiClient.get<NotificationPageResponseDto>(NOTIFICATION_API_PATHS.base, {
    params: { cursor: params?.cursor, size: params?.size, type: params?.category ?? 'ALL' },
  })
  return data
}

export async function markNotificationAsRead(notificationId: number): Promise<void> {
  await apiClient.patch(NOTIFICATION_API_PATHS.read(notificationId))
}

export async function markAllNotificationsAsRead(): Promise<UnreadCountResponseDto> {
  const { data } = await apiClient.patch<UnreadCountResponseDto>(NOTIFICATION_API_PATHS.readAll)
  return data
}

export async function getUnreadNotificationCount(): Promise<UnreadCountResponseDto> {
  const { data } = await apiClient.get<UnreadCountResponseDto>(NOTIFICATION_API_PATHS.unreadCount)
  return data
}
