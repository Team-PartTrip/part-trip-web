import type { NotificationResponseDto } from '@/entities/notification'
import { Button as PartTripButton } from '@/shared/ui/parttrip'

import {
  categoryTone,
  detailTimestamp,
  isToday,
  relativeTime,
  sectionLabel,
  settingCopy,
  getNotificationDetailState,
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
  const firstUnreadTodayIndex = notifications.findIndex((item) => isToday(item.createdAt) && item.read !== true)

  return (
    <>
      <S.NotificationTabs aria-label="알림 종류">
        {tabs.map((tab) => <button key={tab.value} type="button" className={activeTab === tab.value ? 'active' : ''} aria-pressed={activeTab === tab.value} onClick={() => onTabChange(tab.value)}>{tab.label}</button>)}
      </S.NotificationTabs>
      {isLoading ? <S.LoadingList aria-busy="true" aria-label="알림 로딩 중"><S.LoadingRow /><S.LoadingRow /><S.LoadingRow /><S.LoadingRow /><S.LoadingRow /></S.LoadingList> : null}
      {!isLoading && isError ? <S.List><S.Empty><strong>알림을 불러오지 못했습니다.</strong></S.Empty></S.List> : null}
      {!isLoading && !isError ? <S.List>{notifications.length ? notifications.map((notification, index) => {
        const section = sectionLabel(notifications, index, todayUnreadCount, firstUnreadTodayIndex)
        const [categoryLabel] = settingCopy(notification.type, notification.category)
        const isRead = notification.read === true
        const title = notification.title || '새 알림'

        return (
          <div key={notification.notificationId ?? index}>
            {section ? <S.SectionLabel>{section}</S.SectionLabel> : null}
            <S.NotificationItem
              type="button"
              $read={isRead}
              aria-label={`${isRead ? '읽은' : '읽지 않은'} 알림: ${title}`}
              onClick={() => onNotificationClick(notification)}
            >
              <S.StatusDot $read={isRead} />
              <S.NotificationCopy $read={isRead}>
                <strong>{title}</strong>
                <span>{relativeTime(notification.createdAt)} · {isRead ? '읽음' : '읽지 않음'}</span>
              </S.NotificationCopy>
              <S.NotificationCategory $tone={categoryTone(notification.type)}>
                {categoryLabel}
              </S.NotificationCategory>
            </S.NotificationItem>
          </div>
        )
      }) : <S.Empty><strong>새로운 알림이 없습니다.</strong><span>새로운 활동이 생기면 이곳에서 확인할 수 있습니다.</span></S.Empty>}{hasNextPage ? <S.LoadMore type="button" disabled={isFetchingNextPage} onClick={onLoadMore}>{isFetchingNextPage ? '불러오는 중' : '이전 알림 더 보기'}</S.LoadMore> : null}</S.List> : null}
    </>
  )
}

export function NotificationDetailView({
  actionLabel,
  content,
  detail,
  isError,
  isLoading,
  isMarkReadPending,
  isMarkReadSuccess,
  onAction,
  onBack,
}: {
  actionLabel?: string
  content?: { body: string; title: string }
  detail?: NotificationResponseDto
  isError: boolean
  isLoading: boolean
  isMarkReadPending: boolean
  isMarkReadSuccess: boolean
  onAction: () => void
  onBack: () => void
}) {
  const state = getNotificationDetailState({
    hasNotification: Boolean(detail),
    isError,
    isLoading,
  })
  if (state === 'loading') return <S.LoadingDetail aria-busy="true" aria-label="알림 상세 로딩 중" />
  if (state === 'error') return <S.Detail><p role="alert">알림을 불러오지 못했습니다.</p><S.ActionRow><PartTripButton type="button" $variant="secondary" onClick={onBack}>알림 목록으로</PartTripButton></S.ActionRow></S.Detail>
  if (state === 'empty' || !detail || !content) return <S.Detail><p role="status">알림을 찾을 수 없습니다.</p><S.ActionRow><PartTripButton type="button" $variant="secondary" onClick={onBack}>알림 목록으로</PartTripButton></S.ActionRow></S.Detail>

  return <S.Detail><S.DetailCategory $tone={categoryTone(detail.type)}>{settingCopy(detail.type, detail.category)[0]}</S.DetailCategory><h2>{content.title}</h2><p>{content.body}</p><S.DetailMeta>{detailTimestamp(detail.createdAt)}</S.DetailMeta>{detail.read === true || isMarkReadSuccess ? <S.ReadState>✓ 읽음 처리</S.ReadState> : null}<S.DetailMeta>이 알림은 열람 시 자동으로 읽음 처리됩니다.</S.DetailMeta><S.DetailMeta>목록에서 [모두 읽음]으로 일괄 처리할 수도 있어요.</S.DetailMeta><S.ActionRow>{actionLabel ? <PartTripButton type="button" disabled={isMarkReadPending} onClick={onAction}>{actionLabel}</PartTripButton> : null}<PartTripButton type="button" $variant="secondary" onClick={onBack}>알림 목록으로</PartTripButton></S.ActionRow></S.Detail>
}
