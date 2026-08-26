import { useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'

import { useNotificationsQuery, type NotificationFilter, type NotificationResponseDto } from '@/entities/notification'
import { paths } from '@/shared/config'
import { Button as PartTripButton, Tab as PartTripTab, Tabs as PartTripTabs } from '@/shared/ui/parttrip'
import { AppShell } from '@/widgets/app-shell'

import * as S from './NotificationPage.styles'

type Mode = 'list' | 'detail' | 'settings'

const tabs: Array<{ label: string; value: NotificationFilter }> = [
  { label: '전체', value: 'ALL' },
  { label: '투표', value: 'VOTE' },
  { label: '기록', value: 'RECORD' },
]

function notificationDate(value?: string) {
  return value ? new Date(value).toLocaleString('ko-KR') : '방금 전'
}

function notificationTypeLabel(notification: NotificationResponseDto) {
  if (notification.category === 'VOTE') return '투표'
  if (notification.category === 'RECORD') return '기록'
  return '알림'
}

export function NotificationPage() { return <NotificationFlow mode="list" /> }
export function NotificationDetailPage() { return <NotificationFlow mode="detail" /> }
export function NotificationSettingsPage() { return <NotificationFlow mode="settings" /> }

function NotificationFlow({ mode }: { mode: Mode }) {
  const navigate = useNavigate()
  const { notificationId = '' } = useParams({ strict: false })
  const [activeTab, setActiveTab] = useState<NotificationFilter>('ALL')
  const category = mode === 'list' ? activeTab : 'ALL'
  const notificationsQuery = useNotificationsQuery(category, mode === 'list' || mode === 'detail')
  const notifications = notificationsQuery.data?.items ?? []
  const detail = notifications.find((item) => String(item.notificationId) === notificationId)

  return (
    <AppShell>
      <S.Page>
        <S.Header><div><S.Title>{mode === 'settings' ? '알림 설정' : mode === 'detail' ? '알림 상세' : '알림'}</S.Title><S.Subtitle>{mode === 'settings' ? '받고 싶은 알림을 선택하세요.' : '여행과 기록에 대한 소식을 확인하세요.'}</S.Subtitle></div>{mode !== 'list' ? <S.BackButton type="button" onClick={() => navigate({ to: paths.notifications })}>알림 목록</S.BackButton> : null}</S.Header>
        {mode === 'list' ? <><PartTripTabs aria-label="알림 종류">{tabs.map((tab) => <PartTripTab key={tab.value} type="button" $active={activeTab === tab.value} aria-pressed={activeTab === tab.value} onClick={() => setActiveTab(tab.value)}>{tab.label}</PartTripTab>)}<S.ReadAll type="button" disabled>모두 읽음</S.ReadAll></PartTripTabs>{notificationsQuery.isLoading ? <S.List><S.Empty>알림을 불러오는 중입니다.</S.Empty></S.List> : notificationsQuery.isError ? <S.List><S.Empty><strong>알림을 불러오지 못했습니다.</strong></S.Empty></S.List> : notifications.length > 0 ? <S.List>{notifications.map((notification, index) => <S.NotificationItem key={notification.notificationId ?? index} type="button" $read={notification.read === true} onClick={() => notification.notificationId != null && navigate({ params: { notificationId: String(notification.notificationId) }, to: '/notifications/$notificationId' })}><strong>{notification.title || '새 알림'}</strong><span>{notification.body || '새로운 활동이 있습니다.'}</span><small>{notificationTypeLabel(notification)} · {notificationDate(notification.createdAt)}</small></S.NotificationItem>)}</S.List> : <S.List><S.Empty><strong>새로운 알림이 없습니다.</strong><span>새로운 활동이 생기면 이곳에서 확인할 수 있습니다.</span></S.Empty></S.List>}</> : null}
        {mode === 'detail' ? notificationsQuery.isLoading ? <S.Detail><p>알림을 불러오는 중입니다.</p></S.Detail> : detail ? <S.Detail><S.StatusDot /><small>{notificationTypeLabel(detail)} · {notificationDate(detail.createdAt)}</small><h2>{detail.title || '알림'}</h2><p>{detail.body || '알림 내용이 없습니다.'}</p><S.ActionRow><PartTripButton type="button" disabled>읽음 처리</PartTripButton><PartTripButton type="button" $variant="secondary" onClick={() => navigate({ to: paths.notifications })}>목록으로</PartTripButton></S.ActionRow></S.Detail> : <S.Detail><p>알림을 찾을 수 없습니다.</p></S.Detail> : null}
        {mode === 'settings' ? <S.SettingsCard><S.Empty><strong>알림 설정 API를 연결하는 중입니다.</strong><span>설정 항목을 불러오면 이 화면에서 저장할 수 있습니다.</span></S.Empty></S.SettingsCard> : null}
      </S.Page>
    </AppShell>
  )
}
