import { AppShell } from '@/widgets/app-shell'

import { detailActionLabel, detailCopy, isToday } from '../model/notification-presentation'
import { useNotificationFlow } from '../model/useNotificationFlow'
import { NotificationDetailView, NotificationListView } from './NotificationModeViews'
import * as S from './NotificationPage.styles'

export function NotificationPage() { return <NotificationFlow mode="list" /> }
export function NotificationDetailPage() { return <NotificationFlow mode="detail" /> }
export function NotificationSettingsPage() {
  return <AppShell><S.Page><S.Header><div><S.Title>알림 안내</S.Title><S.Subtitle>알림을 켜거나 끄는 기능은 아직 제공하지 않아요.</S.Subtitle></div></S.Header><S.SettingsCard>
    <S.SettingRow><div><strong>그룹 초대 수락</strong><span>여행 그룹 참여가 확인되면 알려드려요.</span></div></S.SettingRow>
    <S.SettingRow><div><strong>여행카드 생성</strong><span>여행 기록 카드가 만들어지면 알려드려요.</span></div></S.SettingRow>
    <S.SettingRow><div><strong>새 지역 방문</strong><span>새로운 지역 방문 기록이 생기면 알려드려요.</span></div></S.SettingRow>
    <S.SettingRow><div><strong>여행 하루 전</strong><span>여행 시작 하루 전에 알려드려요.</span></div></S.SettingRow>
    <S.SettingRow><div><strong>오늘 일정</strong><span>오늘의 여행 일정을 알려드려요.</span></div></S.SettingRow>
  </S.SettingsCard></S.Page></AppShell>
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
        {mode === 'detail' ? <NotificationDetailView actionLabel={actionLabel} content={content} detail={detail} isError={notificationsQuery.isError} isLoading={notificationsQuery.isLoading} isMarkReadPending={markReadMutation.isPending} isMarkReadSuccess={markReadMutation.isSuccess} onAction={() => void handleNotificationAction()} onBack={() => navigate({ to: paths.notifications })} /> : null}
      </S.Page>
    </AppShell>
  )
}
