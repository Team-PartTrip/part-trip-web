import type { NotificationFilter, NotificationType } from '@/entities/notification'
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

  return (
    <AppShell>
      <S.Page>
        <S.Header>
          <div><S.Title>{header[0]}</S.Title>{header[1] ? <S.Subtitle>{header[1]}</S.Subtitle> : null}</div>
          {mode === 'list' ? <S.ReadAll type="button" disabled={!hasUnread || markAllMutation.isPending} onClick={() => void handleMarkAll()}>{markAllMutation.isPending ? '처리 중' : '모두 읽음'}</S.ReadAll> : null}
        </S.Header>
        {actionError ? <S.ErrorMessage role="alert">{actionError}</S.ErrorMessage> : null}

        {mode === 'list' ? <><S.NotificationTabs aria-label="알림 종류">{tabs.map((tab) => <button key={tab.value} type="button" className={activeTab === tab.value ? 'active' : ''} aria-pressed={activeTab === tab.value} onClick={() => setActiveTab(tab.value)}>{tab.label}</button>)}</S.NotificationTabs>{notificationsQuery.isLoading ? <S.LoadingList aria-busy="true" aria-label="알림 로딩 중"><S.LoadingRow /><S.LoadingRow /><S.LoadingRow /><S.LoadingRow /><S.LoadingRow /></S.LoadingList> : notificationsQuery.isError ? <S.List><S.Empty><strong>알림을 불러오지 못했습니다.</strong></S.Empty></S.List> : <S.List>{notifications.length ? notifications.map((notification, index) => <div key={notification.notificationId ?? index}>{index === 0 ? <S.SectionLabel>오늘 · 읽지 않음 {notifications.filter((item) => item.isRead !== true).length}</S.SectionLabel> : null}{index === 3 ? <S.SectionLabel>이번 주</S.SectionLabel> : null}<S.NotificationItem type="button" $read={notification.isRead === true} onClick={() => void handleNotificationClick(notification)}><S.StatusDot $read={notification.isRead === true} /><S.NotificationCopy><strong>{notification.title || '새 알림'}</strong><span>{relativeTime(notification.createdAt)}</span></S.NotificationCopy><S.NotificationCategory>{settingCopy(notification.type)[0]}</S.NotificationCategory></S.NotificationItem></div>) : <S.Empty><strong>새로운 알림이 없습니다.</strong><span>새로운 활동이 생기면 이곳에서 확인할 수 있습니다.</span></S.Empty>}{notificationsQuery.hasNextPage ? <S.LoadMore type="button" disabled={notificationsQuery.isFetchingNextPage} onClick={() => void notificationsQuery.fetchNextPage()}>{notificationsQuery.isFetchingNextPage ? '불러오는 중' : '이전 알림 더 보기'}</S.LoadMore> : null}</S.List>}</> : null}

        {mode === 'detail' ? notificationsQuery.isLoading ? <S.LoadingDetail aria-busy="true" aria-label="알림 상세 로딩 중" /> : detail ? <S.Detail><h2>{detail.title || '오사카 여행 투표가 시작되었습니다'}</h2><p>{detail.body || '멤버들이 후보 장소를 등록했습니다. 투표에 참여하고 다음 여행지를 결정하세요.'}</p><S.Feedback><S.StatusDot $read={detail.isRead === true} /><span>{detail.isRead === true ? '읽은 알림입니다.' : '새로운 여행 단계가 시작되었습니다'}</span></S.Feedback><S.ActionRow><PartTripButton type="button" disabled={markReadMutation.isPending} onClick={() => void handleNotificationAction()}>보러가기</PartTripButton><PartTripButton type="button" $variant="secondary" onClick={() => navigate({ to: paths.notifications })}>알림 목록</PartTripButton></S.ActionRow></S.Detail> : <S.Detail><p>알림을 찾을 수 없습니다.</p></S.Detail> : null}

        {mode === 'settings' ? settingsQuery.isLoading ? <S.LoadingSettings aria-busy="true" aria-label="알림 설정 로딩 중" /> : settingsQuery.isError ? <S.SettingsCard><S.Empty><strong>알림 설정을 불러오지 못했습니다.</strong></S.Empty></S.SettingsCard> : <S.SettingsCard>{settings.length ? settings.map((setting, index) => { const [label, description] = settingCopy(setting.type); return <S.SettingRow key={setting.type ?? index}><div><strong>{label}</strong><span>{description}</span></div><S.Toggle type="button" aria-label={`${label} 알림 ${setting.enabled === true ? '끄기' : '켜기'}`} aria-pressed={setting.enabled === true} $active={setting.enabled === true} disabled={updateSettingsMutation.isPending} onClick={() => void handleSettingToggle(setting.type)} /></S.SettingRow> }) : <S.Empty>설정 가능한 알림이 없습니다.</S.Empty>}</S.SettingsCard> : null}
      </S.Page>
    </AppShell>
  )
}
