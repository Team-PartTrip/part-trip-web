import type { NotificationResponseDto } from '@/entities/notification'
import { Button as PartTripButton } from '@/shared/ui/parttrip'

import {
  categoryTone,
  detailTimestamp,
  relativeTime,
  sectionLabel,
  settingCopy,
  type NotificationViewFilter,
} from '../model/notification-presentation'
import * as S from './NotificationPage.styles'

const tabs: Array<{ label: string; value: NotificationViewFilter }> = [
  { label: '전체', value: 'ALL' },
  { label: '일정', value: 'SCHEDULE' },
  { label: '사진', value: 'PHOTO' },
  { label: '그룹', value: 'GROUP' },
]

export function NotificationListView({
  activeTab,
  hasNextPage,
  isError,
  isFetchingNextPage,
  isLoading,
  notifications,
  onLoadMore,
  onNotificationClick,
  onTabChange,
  todayUnreadCount,
}: {
  activeTab: NotificationViewFilter
  hasNextPage: boolean
  isError: boolean
  isFetchingNextPage: boolean
  isLoading: boolean
  notifications: NotificationResponseDto[]
  onLoadMore: () => void
  onNotificationClick: (notification: NotificationResponseDto) => void
  onTabChange: (tab: NotificationViewFilter) => void
  todayUnreadCount: number
}) {
  return (
    <>
      <S.NotificationTabs aria-label="알림 종류">
        {tabs.map((tab) => <button key={tab.value} type="button" className={activeTab === tab.value ? 'active' : ''} aria-pressed={activeTab === tab.value} onClick={() => onTabChange(tab.value)}>{tab.label}</button>)}
      </S.NotificationTabs>
      {isLoading ? <S.LoadingList aria-busy="true" aria-label="알림 로딩 중"><S.LoadingRow /><S.LoadingRow /><S.LoadingRow /><S.LoadingRow /><S.LoadingRow /></S.LoadingList> : isError ? <S.List><S.Empty><strong>알림을 불러오지 못했습니다.</strong></S.Empty></S.List> : <S.List>{notifications.length ? notifications.map((notification, index) => <div key={notification.notificationId ?? index}>{sectionLabel(notifications, index, todayUnreadCount) ? <S.SectionLabel>{sectionLabel(notifications, index, todayUnreadCount)}</S.SectionLabel> : null}<S.NotificationItem type="button" $read={notification.read === true} aria-label={`${notification.read === true ? '읽은' : '읽지 않은'} 알림: ${notification.title || '새 알림'}`} onClick={() => onNotificationClick(notification)}><S.StatusDot $read={notification.read === true} /><S.NotificationCopy $read={notification.read === true}><strong>{notification.title || '새 알림'}</strong><span>{relativeTime(notification.createdAt)} · {notification.read === true ? '읽음' : '읽지 않음'}</span></S.NotificationCopy><S.NotificationCategory $tone={categoryTone(notification.type)}>{settingCopy(notification.type, notification.category)[0]}</S.NotificationCategory></S.NotificationItem></div>) : <S.Empty><strong>새로운 알림이 없습니다.</strong><span>새로운 활동이 생기면 이곳에서 확인할 수 있습니다.</span></S.Empty>}{hasNextPage ? <S.LoadMore type="button" disabled={isFetchingNextPage} onClick={onLoadMore}>{isFetchingNextPage ? '불러오는 중' : '이전 알림 더 보기'}</S.LoadMore> : null}</S.List>}
    </>
  )
}

export function NotificationDetailView({
  actionLabel,
  content,
  detail,
  isLoading,
  isMarkReadPending,
  isMarkReadSuccess,
  onAction,
  onBack,
}: {
  actionLabel?: string
  content?: { body: string; title: string }
  detail?: NotificationResponseDto
  isLoading: boolean
  isMarkReadPending: boolean
  isMarkReadSuccess: boolean
  onAction: () => void
  onBack: () => void
}) {
  if (isLoading) return <S.LoadingDetail aria-busy="true" aria-label="알림 상세 로딩 중" />
  if (!detail || !content) return <S.Detail><p>알림을 찾을 수 없습니다.</p></S.Detail>

  return <S.Detail><S.DetailCategory $tone={categoryTone(detail.type)}>{settingCopy(detail.type, detail.category)[0]}</S.DetailCategory><h2>{content.title}</h2><p>{content.body}</p><S.DetailMeta>{detailTimestamp(detail.createdAt)}</S.DetailMeta>{detail.read === true || isMarkReadSuccess ? <S.ReadState>✓ 읽음 처리</S.ReadState> : null}<S.DetailMeta>이 알림은 열람 시 자동으로 읽음 처리됩니다.</S.DetailMeta><S.DetailMeta>목록에서 [모두 읽음]으로 일괄 처리할 수도 있어요.</S.DetailMeta>{actionLabel ? <S.ActionRow><PartTripButton type="button" disabled={isMarkReadPending} onClick={onAction}>{actionLabel}</PartTripButton><PartTripButton type="button" $variant="secondary" onClick={onBack}>알림 목록으로</PartTripButton></S.ActionRow> : null}</S.Detail>
}
