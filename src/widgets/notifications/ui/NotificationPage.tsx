import { AppShell } from '@/widgets/app-shell'

import { detailActionLabel, detailCopy, isToday } from '../model/notification-presentation'
import { useNotificationFlow } from '../model/useNotificationFlow'
import { NotificationDetailView, NotificationListView } from './NotificationModeViews'
import * as S from './NotificationPage.styles'

export function NotificationPage() { return <NotificationFlow mode="list" /> }
export function NotificationDetailPage() { return <NotificationFlow mode="detail" /> }
export function NotificationSettingsPage() {
  return <AppShell><S.Page><S.Header><div><S.Title>알림 설정</S.Title><S.Subtitle>여행에 필요한 소식을 앱에서 확인할 수 있어요.</S.Subtitle></div></S.Header><S.SettingsCard><S.SettingRow><strong>여행 하루 전</strong><span>여행 시작을 미리 알려드려요.</span></S.SettingRow><S.SettingRow><strong>오늘 일정</strong><span>오늘의 여행 일정을 알려드려요.</span></S.SettingRow><S.SettingRow><strong>가족이 사진을 확인했을 때</strong><span>가족이 여행 사진을 본 소식을 알려드려요.</span></S.SettingRow><S.SettingsNote>지난 투표 알림은 목록에서 기록으로 확인할 수 있어요.</S.SettingsNote></S.SettingsCard></S.Page></AppShell>
}

function NotificationFlow({ mode }: { mode: 'list' | 'detail' }) {
  const {
    actionError,
    activeTab,
    detail,
    handleMarkAll,
    handleNotificationClick,
    handleNotificationAction,
    hasUnread,
    markAllMutation,
    markReadMutation,
    navigate,
    notifications,
    notificationsQuery,
    unreadCount,
    paths,
    setActiveTab,
  } = useNotificationFlow(mode)

  const todayUnreadCount = unreadCount ?? notifications.filter((item) => isToday(item.createdAt) && item.read !== true).length
  const actionLabel = detail ? detailActionLabel(detail) : undefined
  const content = detail ? detailCopy(detail) : undefined

  return (
    <AppShell>
      <S.Page>
        <S.Header>
          <div><S.Title>{mode === 'detail' ? '알림 상세' : '알림'}</S.Title></div>
          {mode === 'list' ? <S.ReadAll type="button" disabled={!hasUnread || markAllMutation.isPending} onClick={() => void handleMarkAll()}>{markAllMutation.isPending ? '처리 중' : '모두 읽음'}</S.ReadAll> : null}
        </S.Header>
        {actionError ? <S.ErrorMessage role="alert">{actionError}</S.ErrorMessage> : null}
        {mode === 'list' ? <NotificationListView activeTab={activeTab} hasNextPage={Boolean(notificationsQuery.hasNextPage)} isError={notificationsQuery.isError} isFetchingNextPage={notificationsQuery.isFetchingNextPage} isLoading={notificationsQuery.isLoading} notifications={notifications} onLoadMore={() => void notificationsQuery.fetchNextPage()} onNotificationClick={(notification) => void handleNotificationClick(notification)} onTabChange={setActiveTab} todayUnreadCount={todayUnreadCount} /> : null}
        {mode === 'detail' ? <NotificationDetailView actionLabel={actionLabel} content={content} detail={detail} isLoading={notificationsQuery.isLoading} isMarkReadPending={markReadMutation.isPending} isMarkReadSuccess={markReadMutation.isSuccess} onAction={() => void handleNotificationAction()} onBack={() => navigate({ to: paths.notifications })} /> : null}
      </S.Page>
    </AppShell>
  )
}
