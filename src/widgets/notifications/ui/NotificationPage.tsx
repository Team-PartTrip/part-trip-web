import { AppShell } from '@/widgets/app-shell'

import { detailActionLabel, detailCopy, isToday } from '../model/notification-presentation'
import { useNotificationFlow } from '../model/useNotificationFlow'
import { NotificationDetailView, NotificationListView } from './NotificationModeViews'
import * as S from './NotificationPage.styles'

export function NotificationPage() { return <NotificationFlow mode="list" /> }
export function NotificationDetailPage() { return <NotificationFlow mode="detail" /> }
export function NotificationSettingsPage() {
  return <AppShell><S.Page><S.Header><div><S.Title>알림 설정</S.Title><S.Subtitle>알림 설정 API는 아직 제공되지 않습니다.</S.Subtitle></div></S.Header><S.SettingsCard><S.Empty>최신 API 명세서에 알림 설정 endpoint가 없습니다.</S.Empty></S.SettingsCard></S.Page></AppShell>
}

function NotificationFlow({ mode }: { mode: 'list' | 'detail' }) {
  const {
    actionError,
    activeTab,
    canNavigateToVote,
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
  const actionLabel = detail ? detailActionLabel(detail, canNavigateToVote) : undefined
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
