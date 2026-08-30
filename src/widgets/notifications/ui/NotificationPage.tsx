import type { NotificationFilter, NotificationType } from '@/entities/notification'
import { isInCurrentCalendarWeek, isPositiveSafeInteger } from '@/shared/utils'
import { Button as PartTripButton } from '@/shared/ui/parttrip'
import { AppShell } from '@/widgets/app-shell'

import { useNotificationFlow } from '../model/useNotificationFlow'
import * as S from './NotificationPage.styles'

const tabs: Array<{ label: string; value: NotificationFilter }> = [
  { label: '전체', value: 'ALL' },
  { label: '투표', value: 'VOTE' },
  { label: '기록', value: 'RECORD' },
]

function settingCopy(type?: NotificationType) {
  if (type === 'VOTE_PARTICIPATED' || type === 'VOTE_DEADLINE' || type === 'VOTE_REMINDER') return ['투표', '그룹원이 투표하거나 마감이 다가올 때']
  if (type === 'PHOTO_ORGANIZED') return ['기록', '촬영한 사진 정리가 끝났을 때']
  if (type === 'COUNTRY_ACQUIRED') return ['국가', '새로운 국가를 획득했을 때']
  if (type === 'TRIP_CARD_CREATED') return ['여행카드', '여행카드가 만들어졌을 때']
  return ['그룹', '초대가 수락되거나 새 멤버가 들어왔을 때']
}

function categoryTone(type?: NotificationType) {
  if (type === 'PHOTO_ORGANIZED') return 'accent'
  if (type === 'COUNTRY_ACQUIRED') return 'success'
  return 'primary'
}

function relativeTime(value?: string) {
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

function detailTimestamp(value?: string) {
  if (!value) return '방금 전'
  const absolute = timestampLabel(value)
  return absolute ? `${absolute} · ${relativeTime(value)}` : relativeTime(value)
}

function notificationLinkType(notification: { linkType?: string }) {
  return notification.linkType?.trim().toUpperCase()
}

function detailCopy(notification: { linkType?: string; title?: string; body?: string; type?: NotificationType }) {
  const linkType = notificationLinkType(notification)
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

function detailActionLabel(notification: { linkType?: string; linkId?: number; plannerId?: number }) {
  const linkType = notificationLinkType(notification)
  if (linkType === 'TRIP_CARD' && notification.linkId != null) return '여행카드 보러가기'
  if ((linkType === 'GROUP' || linkType === 'GROUP_INVITATION') && notification.linkId != null) return linkType === 'GROUP_INVITATION' ? '초대 확인하기' : '그룹 보러가기'
  if (linkType === 'VOTE' && isPositiveSafeInteger(notification.linkId) && isPositiveSafeInteger(notification.plannerId)) return '투표 보러가기'
  if (linkType === 'WORLD_MAP') return '세계지도 보러가기'
  return undefined
}

function parsedDate(value?: string) {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

function isToday(value?: string) {
  const date = parsedDate(value)
  const today = new Date()
  return Boolean(date && date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate())
}

function sectionLabel(notifications: Array<{ createdAt?: string; isRead?: boolean }>, index: number, todayUnreadCount: number, firstUnreadTodayIndex = notifications.findIndex((item) => isToday(item.createdAt) && item.isRead !== true)) {
  const notification = notifications[index]
  const previous = notifications[index - 1]
  const unreadToday = isToday(notification.createdAt) && notification.isRead !== true
  if (unreadToday && index === firstUnreadTodayIndex) return `오늘 · 읽지 않음 ${todayUnreadCount}`
  const thisWeek = isInCurrentCalendarWeek(notification.createdAt) && !isToday(notification.createdAt)
  const previousThisWeek = previous && isInCurrentCalendarWeek(previous.createdAt) && !isToday(previous.createdAt)
  return thisWeek && !previousThisWeek ? '이번 주' : undefined
}

export function NotificationPage() { return <NotificationFlow mode="list" /> }
export function NotificationDetailPage() { return <NotificationFlow mode="detail" /> }
export function NotificationSettingsPage() { return <NotificationFlow mode="settings" /> }

function NotificationFlow({ mode }: { mode: 'list' | 'detail' | 'settings' }) {
  const {
    actionError,
    activeTab,
    detail,
    handleMarkAll,
    handleNotificationClick,
    handleNotificationAction,
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
  } = useNotificationFlow(mode)

  const header = mode === 'settings'
    ? ['알림 설정', '받고 싶은 알림만 켜두세요.']
    : mode === 'detail'
      ? ['알림 상세', '']
      : ['알림', '']
  const todayUnreadCount = notifications.filter((item) => isToday(item.createdAt) && item.isRead !== true).length
  const actionLabel = detail ? detailActionLabel(detail) : undefined
  const content = detail ? detailCopy(detail) : undefined

  return (
    <AppShell>
      <S.Page>
        <S.Header>
          <div><S.Title>{header[0]}</S.Title>{header[1] ? <S.Subtitle>{header[1]}</S.Subtitle> : null}</div>
          {mode === 'list' ? <S.ReadAll type="button" disabled={!hasUnread || markAllMutation.isPending} onClick={() => void handleMarkAll()}>{markAllMutation.isPending ? '처리 중' : '모두 읽음'}</S.ReadAll> : null}
        </S.Header>
        {actionError ? <S.ErrorMessage role="alert">{actionError}</S.ErrorMessage> : null}

        {mode === 'list' ? <><S.NotificationTabs aria-label="알림 종류">{tabs.map((tab) => <button key={tab.value} type="button" className={activeTab === tab.value ? 'active' : ''} aria-pressed={activeTab === tab.value} onClick={() => setActiveTab(tab.value)}>{tab.label}</button>)}</S.NotificationTabs>{notificationsQuery.isLoading ? <S.LoadingList aria-busy="true" aria-label="알림 로딩 중"><S.LoadingRow /><S.LoadingRow /><S.LoadingRow /><S.LoadingRow /><S.LoadingRow /></S.LoadingList> : notificationsQuery.isError ? <S.List><S.Empty><strong>알림을 불러오지 못했습니다.</strong></S.Empty></S.List> : <S.List>{notifications.length ? notifications.map((notification, index) => <div key={notification.notificationId ?? index}>{sectionLabel(notifications, index, todayUnreadCount) ? <S.SectionLabel>{sectionLabel(notifications, index, todayUnreadCount)}</S.SectionLabel> : null}<S.NotificationItem type="button" $read={notification.isRead === true} onClick={() => void handleNotificationClick(notification)}><S.StatusDot $read={notification.isRead === true} /><S.NotificationCopy $read={notification.isRead === true}><strong>{notification.title || '새 알림'}</strong><span>{relativeTime(notification.createdAt)}</span></S.NotificationCopy><S.NotificationCategory $tone={categoryTone(notification.type)}>{settingCopy(notification.type)[0]}</S.NotificationCategory></S.NotificationItem></div>) : <S.Empty><strong>새로운 알림이 없습니다.</strong><span>새로운 활동이 생기면 이곳에서 확인할 수 있습니다.</span></S.Empty>}{notificationsQuery.hasNextPage ? <S.LoadMore type="button" disabled={notificationsQuery.isFetchingNextPage} onClick={() => void notificationsQuery.fetchNextPage()}>{notificationsQuery.isFetchingNextPage ? '불러오는 중' : '이전 알림 더 보기'}</S.LoadMore> : null}</S.List>}</> : null}

        {mode === 'detail' ? notificationsQuery.isLoading ? <S.LoadingDetail aria-busy="true" aria-label="알림 상세 로딩 중" /> : detail && content ? <S.Detail><S.DetailCategory $tone={categoryTone(detail.type)}>{settingCopy(detail.type)[0]}</S.DetailCategory><h2>{content.title}</h2><p>{content.body}</p><S.DetailMeta>{detailTimestamp(detail.createdAt)}</S.DetailMeta>{detail.isRead === true || markReadMutation.isSuccess ? <S.ReadState>✓ 읽음 처리</S.ReadState> : null}<S.DetailMeta>이 알림은 열람 시 자동으로 읽음 처리됩니다.</S.DetailMeta><S.DetailMeta>목록에서 [모두 읽음]으로 일괄 처리할 수도 있어요.</S.DetailMeta>{actionLabel ? <S.ActionRow><PartTripButton type="button" disabled={markReadMutation.isPending} onClick={() => void handleNotificationAction()}>{actionLabel}</PartTripButton><PartTripButton type="button" $variant="secondary" onClick={() => navigate({ to: paths.notifications })}>알림 목록으로</PartTripButton></S.ActionRow> : null}</S.Detail> : <S.Detail><p>알림을 찾을 수 없습니다.</p></S.Detail> : null}

        {mode === 'settings' ? settingsQuery.isLoading ? <S.LoadingSettings aria-busy="true" aria-label="알림 설정 로딩 중" /> : settingsQuery.isError ? <S.SettingsCard><S.Empty><strong>알림 설정을 불러오지 못했습니다.</strong></S.Empty></S.SettingsCard> : <S.SettingsCard>{settings.length ? settings.map((setting, index) => { const [label, description] = settingCopy(setting.type); return <S.SettingRow key={setting.type ?? index}><div><strong>{label}</strong><span>{description}</span></div><S.Toggle type="button" aria-label={`${label} 알림 ${setting.enabled === true ? '끄기' : '켜기'}`} aria-pressed={setting.enabled === true} $active={setting.enabled === true} disabled={updateSettingsMutation.isPending} onClick={() => void handleSettingToggle(setting.type)} /></S.SettingRow> }) : <S.Empty>설정 가능한 알림이 없습니다.</S.Empty>}</S.SettingsCard> : null}
      </S.Page>
    </AppShell>
  )
}
