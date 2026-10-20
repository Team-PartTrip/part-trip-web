import { NotificationDetailDialog } from './NotificationDetailDialog'
import { AppShell } from '@/widgets/app-shell'

import { detailActionLabel, detailCopy, isToday } from '../model/notification-presentation'
import { useNotificationDetail, useNotificationList } from '../model/useNotifications'
import { paths } from '@/shared/config'
import { NotificationDetailView, NotificationListView } from './NotificationModeViews'
import * as S from './NotificationPage.styles'

export function NotificationPage() {
  const { selectedNotification, setSelectedNotification, markReadMutation, actionError, activeTab, handleMarkAll, handleNotificationClick, hasUnread, markAllMutation, notifications, notificationsQuery, unreadCount, setActiveTab } = useNotificationList()
  const todayUnreadCount = unreadCount ?? notifications.filter((item) => isToday(item.createdAt) && item.read !== true).length
  return <AppShell>
    <S.Page>
      <S.Header>
        <div><S.Title>알림</S.Title></div>
        <S.ReadAll type="button" disabled={!hasUnread || markAllMutation.isPending} onClick={() => void handleMarkAll()}>{markAllMutation.isPending ? '처리 중' : '모두 읽음'}</S.ReadAll>
      </S.Header>
      {actionError ? <S.ErrorMessage role="alert">{actionError}</S.ErrorMessage> : null}
      <NotificationListView activeTab={activeTab} hasNextPage={Boolean(notificationsQuery.hasNextPage)} isError={notificationsQuery.isError} isFetchingNextPage={notificationsQuery.isFetchingNextPage} isLoading={notificationsQuery.isLoading} notifications={notifications} onLoadMore={() => void notificationsQuery.fetchNextPage()} onNotificationClick={(notification) => void handleNotificationClick(notification)} onTabChange={setActiveTab} todayUnreadCount={todayUnreadCount} />
    </S.Page>
    {selectedNotification ? <NotificationDetailDialog notification={selectedNotification} readError={actionError} isMarkReadPending={markReadMutation.isPending} onClose={() => setSelectedNotification(null)} /> : null}
  </AppShell>
}

export function NotificationDetailPage() {
  const { actionError, detail, handleNotificationAction, markReadMutation, navigate, notificationsQuery } = useNotificationDetail()
  const actionLabel = detail ? detailActionLabel(detail) : undefined
  const content = detail ? detailCopy(detail) : undefined
  return <AppShell>
    <S.Page>
      <S.Header><div><S.Title>알림 상세</S.Title></div></S.Header>
      {actionError ? <S.ErrorMessage role="alert">{actionError}</S.ErrorMessage> : null}
      <NotificationDetailView actionLabel={actionLabel} content={content} detail={detail} isError={notificationsQuery.isError} isLoading={notificationsQuery.isLoading} isMarkReadPending={markReadMutation.isPending} onAction={() => void handleNotificationAction()} onBack={() => navigate({ to: paths.notifications })} />
    </S.Page>
  </AppShell>
}
