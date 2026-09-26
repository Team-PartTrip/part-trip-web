import type { NotificationType } from '@/entities/notification'
import { isInCurrentCalendarWeek } from '@/shared/utils'

export type NotificationViewFilter = 'ALL' | 'SCHEDULE' | 'PHOTO' | 'GROUP'

export function matchesNotificationFilter(notification: { type?: string; category?: string }, filter: NotificationViewFilter) {
  if (filter === 'ALL') return true
  const category = notification.category?.toUpperCase()
  const type = notification.type?.toUpperCase() ?? ''
  if (category === filter || type.includes(filter)) return true
  if (filter === 'GROUP') return type === 'GROUP_INVITED' || type === 'GROUP_INVITE_ACCEPTED'
  if (filter === 'PHOTO') return type === 'PHOTO_ORGANIZED'
  return false
}

export function settingCopy(type?: NotificationType, category?: string) {
  if (category === 'SCHEDULE') return ['일정', '여행 시작과 오늘 일정 알림']
  if (category === 'PHOTO') return ['사진', '여행 사진 관련 알림']
  if (category === 'GROUP') return ['그룹', '여행 그룹 초대와 연결 알림']
  if (type === 'VOTE_PARTICIPATED' || type === 'VOTE_DEADLINE' || type === 'VOTE_REMINDER') return ['지난 알림', '기존 여행 투표 알림']
  if (type === 'PHOTO_ORGANIZED') return ['사진', '여행 사진 관련 알림']
  if (type === 'TRIP_CARD_CREATED') return ['기록', '여행 기록 알림']
  if (type === 'GROUP_INVITED' || type === 'GROUP_INVITE_ACCEPTED') return ['그룹', '여행 그룹 초대와 연결 알림']
  return ['알림', '여행 소식']
}

export function categoryTone(type?: NotificationType) {
  if (type === 'PHOTO_ORGANIZED') return 'accent' as const
  if (type === 'GROUP_INVITED' || type === 'GROUP_INVITE_ACCEPTED') return 'success' as const
  return 'primary' as const
}

export function relativeTime(value?: string) {
  const date = parsedDate(value)
  if (!date) return '방금 전'
  const timestamp = date.getTime()
  const minutes = Math.max(1, Math.floor((Date.now() - timestamp) / 60000))
  if (minutes < 60) return `${minutes}분 전`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`
  return `${Math.floor(hours / 24)}일 전`
}

function timestampLabel(value?: string) {
  const date = parsedDate(value)
  if (!date) return ''
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

export function detailTimestamp(value?: string) {
  if (!value) return '방금 전'
  const absolute = timestampLabel(value)
  return absolute ? `${absolute} · ${relativeTime(value)}` : relativeTime(value)
}

export function normalizeNotificationLinkType(linkType?: string) {
  return linkType?.trim().toUpperCase()
}

export function detailCopy(notification: { linkType?: string; title?: string; body?: string }) {
  const linkType = normalizeNotificationLinkType(notification.linkType)
  let fallback: [string, string]
  if (linkType === 'TRIP_CARD') {
    fallback = ['여행카드가 만들어졌어요', '여행의 기록을 카드로 확인해보세요.']
  } else if (linkType === 'GROUP' || linkType === 'GROUP_INVITATION') {
    fallback = ['여행 그룹 소식이 있어요', '여행 그룹의 새로운 소식을 확인하세요.']
  } else {
    fallback = ['지난 알림', '이전에 받은 알림을 확인할 수 있어요.']
  }
  return { body: notification.body || fallback[1], title: notification.title || fallback[0] }
}

export function detailActionLabel(notification: { linkType?: string; linkId?: number }) {
  const linkType = normalizeNotificationLinkType(notification.linkType)
  if (linkType === 'TRIP_CARD' && notification.linkId != null) return '여행카드 보러가기'
  if (linkType === 'GROUP' && notification.linkId != null) return '그룹 보러가기'
  if (linkType === 'GROUP_INVITATION' && notification.linkId != null) return '초대 확인하기'
  return undefined
}

function parsedDate(value?: string) {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

export function isToday(value?: string) {
  const date = parsedDate(value)
  const today = new Date()
  return Boolean(date && date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate())
}

export function sectionLabel(
  notifications: Array<{ createdAt?: string; read?: boolean }>,
  index: number,
  todayUnreadCount: number,
  firstUnreadTodayIndex: number,
) {
  const notification = notifications[index]
  const previous = notifications[index - 1]
  const notificationIsToday = isToday(notification.createdAt)
  const unreadToday = notificationIsToday && notification.read !== true
  if (unreadToday && index === firstUnreadTodayIndex) return `오늘 · 읽지 않음 ${todayUnreadCount}`
  const thisWeek = isInCurrentCalendarWeek(notification.createdAt) && !notificationIsToday
  const previousThisWeek = previous && isInCurrentCalendarWeek(previous.createdAt) && !isToday(previous.createdAt)
  return thisWeek && !previousThisWeek ? '이번 주' : undefined
}
