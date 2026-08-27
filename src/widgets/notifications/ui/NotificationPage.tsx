import type { NotificationFilter, NotificationType } from '@/entities/notification'
import { Button as PartTripButton, Tab as PartTripTab, Tabs as PartTripTabs } from '@/shared/ui/parttrip'
import { AppShell } from '@/widgets/app-shell'

import { useNotificationFlow } from '../model/useNotificationFlow'
import * as S from './NotificationPage.styles'

const tabs: Array<{ label: string; value: NotificationFilter }> = [
  { label: '전체', value: 'ALL' },
  { label: '투표', value: 'VOTE' },
  { label: '기록', value: 'RECORD' },
]

function settingCopy(type?: NotificationType) {
  if (type === 'VOTE_PARTICIPATED' || type === 'VOTE_DEADLINE') return ['투표', '그룹원이 투표하거나 마감이 다가올 때']
  if (type === 'PHOTO_ORGANIZED') return ['기록', '촬영한 사진 정리가 끝났을 때']
  if (type === 'COUNTRY_ACQUIRED') return ['국가 획득', '새로운 국가를 획득했을 때']
  if (type === 'TRIP_CARD_CREATED') return ['여행카드', '여행카드가 만들어졌을 때']
  return ['그룹', '초대가 수락되거나 새 멤버가 들어왔을 때']
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
    handleMarkRead,
    handleNotificationClick,
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
      ? ['알림 상세', '선택한 알림의 내용을 확인하세요.']
      : ['알림', '여행 계획의 중요한 변화를 확인하세요.']

  return (
    <AppShell>
      <S.Page>
        <S.Header><S.Title>{header[0]}</S.Title><S.Subtitle>{header[1]}</S.Subtitle></S.Header>
        {actionError ? <S.ErrorMessage role="alert">{actionError}</S.ErrorMessage> : null}

        {mode === 'list' ? <><PartTripTabs aria-label="알림 종류">{tabs.map((tab) => <PartTripTab key={tab.value} type="button" $active={activeTab === tab.value} aria-pressed={activeTab === tab.value} onClick={() => setActiveTab(tab.value)}>{tab.label}</PartTripTab>)}<S.ReadAll type="button" disabled={!hasUnread || markAllMutation.isPending} onClick={() => void handleMarkAll()}>{markAllMutation.isPending ? '처리 중' : '모두 읽음'}</S.ReadAll></PartTripTabs>{notificationsQuery.isLoading ? <S.List><S.Empty>알림을 불러오는 중입니다.</S.Empty></S.List> : notificationsQuery.isError ? <S.List><S.Empty><strong>알림을 불러오지 못했습니다.</strong></S.Empty></S.List> : <S.List>{notifications.length ? notifications.map((notification, index) => <S.NotificationItem key={notification.notificationId ?? index} type="button" $read={notification.read === true} onClick={() => void handleNotificationClick(notification)}><S.StatusDot $read={notification.read === true} /><S.NotificationCopy><strong>{notification.title || '새 알림'}</strong><span>{notification.body || '새로운 활동이 있습니다.'}</span></S.NotificationCopy><small>{notification.read === true ? '읽음' : '새 알림'}</small></S.NotificationItem>) : <S.Empty><strong>새로운 알림이 없습니다.</strong><span>새로운 활동이 생기면 이곳에서 확인할 수 있습니다.</span></S.Empty>}</S.List>}</> : null}

        {mode === 'detail' ? notificationsQuery.isLoading ? <S.Detail><p>알림을 불러오는 중입니다.</p></S.Detail> : detail ? <S.Detail><h2>{detail.title || '오사카 여행 투표가 시작되었습니다'}</h2><p>{detail.body || '멤버들이 후보 장소를 등록했습니다. 투표에 참여하고 다음 여행지를 결정하세요.'}</p><S.Feedback><S.StatusDot $read={detail.read === true} /><span>{detail.read === true ? '읽은 알림입니다.' : '새로운 여행 단계가 시작되었습니다'}</span></S.Feedback><S.ActionRow><PartTripButton type="button" disabled={detail.read === true || markReadMutation.isPending} onClick={() => void handleMarkRead(detail.notificationId)}>{detail.read === true ? '읽음 처리됨' : '투표 보러가기'}</PartTripButton><PartTripButton type="button" $variant="secondary" onClick={() => navigate({ to: paths.notifications })}>알림 목록</PartTripButton></S.ActionRow></S.Detail> : <S.Detail><p>알림을 찾을 수 없습니다.</p></S.Detail> : null}

        {mode === 'settings' ? settingsQuery.isLoading ? <S.SettingsCard><S.Empty>알림 설정을 불러오는 중입니다.</S.Empty></S.SettingsCard> : settingsQuery.isError ? <S.SettingsCard><S.Empty><strong>알림 설정을 불러오지 못했습니다.</strong></S.Empty></S.SettingsCard> : <S.SettingsCard>{settings.length ? settings.map((setting, index) => { const [label, description] = settingCopy(setting.type); return <S.SettingRow key={setting.type ?? index}><div><strong>{label}</strong><span>{description}</span></div><S.Toggle type="button" aria-label={`${label} 알림 ${setting.enabled === true ? '끄기' : '켜기'}`} aria-pressed={setting.enabled === true} $active={setting.enabled === true} disabled={updateSettingsMutation.isPending} onClick={() => void handleSettingToggle(setting.type)} /></S.SettingRow> }) : <S.Empty>설정 가능한 알림이 없습니다.</S.Empty>}</S.SettingsCard> : null}
      </S.Page>
    </AppShell>
  )
}
