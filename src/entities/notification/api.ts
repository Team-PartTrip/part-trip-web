import { apiClient } from '@/shared/libs/api-client'
import { requestWithMockFallback } from '@/shared/libs/api-fallback'

export const notificationTypes = [
  'VOTE_PARTICIPATED',
  'VOTE_DEADLINE',
  'VOTE_REMINDER',
  'GROUP_INVITED',
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
  isRead?: boolean
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

let mockNotificationSettings: NotificationSettingResponseDto[] = notificationTypes.map((type) => ({ enabled: true, type }))

export async function getNotifications(params?: {
  category?: NotificationFilter
  cursor?: number
  size?: number
}): Promise<NotificationPageResponseDto> {
  const { data } = await apiClient.get<NotificationPageResponseDto>(NOTIFICATION_API_PATHS.base, {
    params: { cursor: params?.cursor, size: params?.size, type: params?.category ?? 'ALL' },
  })
  return {
    ...data,
    items: data.items?.map((item) => ({ ...item, isRead: item.isRead ?? item.read })),
  }
}

export async function markNotificationAsRead(notificationId: number): Promise<void> {
  await apiClient.patch(NOTIFICATION_API_PATHS.read(notificationId))
}

export async function markAllNotificationsAsRead(): Promise<UnreadCountResponseDto> {
  const { data } = await apiClient.patch<UnreadCountResponseDto>(NOTIFICATION_API_PATHS.readAll)
  return data
}

export async function getNotificationSettings(): Promise<NotificationSettingResponseDto[]> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.get<NotificationSettingResponseDto[]>(NOTIFICATION_API_PATHS.settings)
      return data
    },
    () => mockNotificationSettings,
  )
}

export async function updateNotificationSettings(
  payload: NotificationSettingUpdateRequestDto,
): Promise<NotificationSettingResponseDto[]> {
  return requestWithMockFallback(
    async () => {
      const { data } = await apiClient.put<NotificationSettingResponseDto[]>(NOTIFICATION_API_PATHS.settings, payload)
      return data
    },
    () => {
      const enabledByType = new Map(payload.settings.map((setting) => [setting.type, setting.enabled]))
      mockNotificationSettings = mockNotificationSettings.map((setting) => setting.type && enabledByType.has(setting.type)
        ? { ...setting, enabled: enabledByType.get(setting.type) }
        : setting)
      return mockNotificationSettings
    },
  )
}

export async function getUnreadNotificationCount(): Promise<UnreadCountResponseDto> {
  const { data } = await apiClient.get<UnreadCountResponseDto>(NOTIFICATION_API_PATHS.unreadCount)
  return data
}
