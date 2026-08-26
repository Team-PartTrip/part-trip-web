import { apiClient } from '@/shared/libs/api-client'

export const notificationTypes = [
  'VOTE_PARTICIPATED',
  'VOTE_DEADLINE',
  'GROUP_INVITE_ACCEPTED',
  'PHOTO_ORGANIZED',
  'COUNTRY_ACQUIRED',
  'TRIP_CARD_CREATED',
] as const

export type NotificationType = (typeof notificationTypes)[number]
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

export type NotificationSettingResponseDto = {
  type?: NotificationType
  label?: string
  enabled?: boolean
}

export type NotificationSettingUpdateRequestDto = {
  settings: Array<{
    type: NotificationType
    enabled: boolean
  }>
}

export type UnreadCountResponseDto = {
  unreadCount?: number
}

const NOTIFICATION_API_PATHS = {
  base: '/notifications',
  read: (notificationId: number) => `/notifications/${notificationId}/read`,
  readAll: '/notifications/read-all',
  settings: '/notifications/settings',
  unreadCount: '/notifications/unread-count',
} as const

export async function getNotifications(params?: {
  category?: NotificationFilter
  cursor?: number
  size?: number
}): Promise<NotificationPageResponseDto> {
  const { data } = await apiClient.get<NotificationPageResponseDto>(NOTIFICATION_API_PATHS.base, { params })
  return data
}

export async function markNotificationAsRead(notificationId: number): Promise<void> {
  await apiClient.patch(NOTIFICATION_API_PATHS.read(notificationId))
}

export async function markAllNotificationsAsRead(): Promise<UnreadCountResponseDto> {
  const { data } = await apiClient.patch<UnreadCountResponseDto>(NOTIFICATION_API_PATHS.readAll)
  return data
}

export async function getNotificationSettings(): Promise<NotificationSettingResponseDto[]> {
  const { data } = await apiClient.get<NotificationSettingResponseDto[]>(NOTIFICATION_API_PATHS.settings)
  return data
}

export async function updateNotificationSettings(
  payload: NotificationSettingUpdateRequestDto,
): Promise<NotificationSettingResponseDto[]> {
  const { data } = await apiClient.put<NotificationSettingResponseDto[]>(NOTIFICATION_API_PATHS.settings, payload)
  return data
}

export async function getUnreadNotificationCount(): Promise<UnreadCountResponseDto> {
  const { data } = await apiClient.get<UnreadCountResponseDto>(NOTIFICATION_API_PATHS.unreadCount)
  return data
}
