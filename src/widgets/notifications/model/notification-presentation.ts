import type { NotificationType } from '@/entities/notification'
import { isInCurrentCalendarWeek } from '@/shared/utils'

export function settingCopy(type?: NotificationType) {
  if (type === 'VOTE_PARTICIPATED' || type === 'VOTE_DEADLINE' || type === 'VOTE_REMINDER') return ['투표', '그룹원이 투표하거나 마감이 다가올 때']
  if (type === 'PHOTO_ORGANIZED') return ['기록', '촬영한 사진 정리가 끝났을 때']
  if (type === 'COUNTRY_ACQUIRED') return ['국가', '새로운 국가를 획득했을 때']
  if (type === 'TRIP_CARD_CREATED') return ['여행카드', '여행카드가 만들어졌을 때']
  return ['그룹', '초대가 수락되거나 새 멤버가 들어왔을 때']
}

export function categoryTone(type?: NotificationType) {
  if (type === 'PHOTO_ORGANIZED') return 'accent' as const
  if (type === 'COUNTRY_ACQUIRED') return 'success' as const
  return 'primary' as const
}

export function relativeTime(value?: string) {
  if (!value) return '방금 전'
  const timestamp = Date.parse(value)
  if (Number.isNaN(timestamp)) return '방금 전'
  const minutes = Math.max(1, Math.floor((Date.now() - timestamp) / 60000))
  if (minutes < 60) return `${minutes}분 전`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`
  return `${Math.floor(hours / 24)}일 전`
}

function timestampLabel(value?: string) {
  const date = value ? new Date(value) : undefined
  if (!date || Number.isNaN(date.getTime())) return ''
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
  const fallback = linkType === 'TRIP_CARD'
    ? ['여행카드가 만들어졌어요', '여행의 기록을 카드로 확인해보세요.']
    : linkType === 'WORLD_MAP'
      ? ['새로운 국가를 획득했어요', '세계지도에서 방문한 국가를 확인해보세요.']
      : linkType === 'GROUP' || linkType === 'GROUP_INVITATION'
        ? ['여행 그룹 소식이 있어요', '여행 그룹의 새로운 소식을 확인하세요.']
        : linkType === 'VOTE'
          ? ['투표에 참여해주세요', '그룹의 여행 후보를 확인하고 투표를 진행하세요.']
          : ['새 알림', '새로운 소식이 있어요.']
  return { body: notification.body || fallback[1], title: notification.title || fallback[0] }
}

export function detailActionLabel(notification: { linkType?: string; linkId?: number }, canNavigateToVote: boolean) {
  const linkType = normalizeNotificationLinkType(notification.linkType)
  if (linkType === 'TRIP_CARD' && notification.linkId != null) return '여행카드 보러가기'
  if ((linkType === 'GROUP' || linkType === 'GROUP_INVITATION') && notification.linkId != null) return linkType === 'GROUP_INVITATION' ? '초대 확인하기' : '그룹 보러가기'
  if (linkType === 'VOTE' && canNavigateToVote) return '투표 보러가기'
  if (linkType === 'WORLD_MAP') return '세계지도 보러가기'
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

export function sectionLabel(notifications: Array<{ createdAt?: string; read?: boolean }>, index: number, todayUnreadCount: number, firstUnreadTodayIndex = notifications.findIndex((item) => isToday(item.createdAt) && item.read !== true)) {
  const notification = notifications[index]
  const previous = notifications[index - 1]
  const unreadToday = isToday(notification.createdAt) && notification.read !== true
  if (unreadToday && index === firstUnreadTodayIndex) return `오늘 · 읽지 않음 ${todayUnreadCount}`
  const thisWeek = isInCurrentCalendarWeek(notification.createdAt) && !isToday(notification.createdAt)
  const previousThisWeek = previous && isInCurrentCalendarWeek(previous.createdAt) && !isToday(previous.createdAt)
  return thisWeek && !previousThisWeek ? '이번 주' : undefined
}
