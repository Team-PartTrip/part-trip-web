import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { paths } from '@shared/config'
import { Button as PartTripButton, Tab as PartTripTab, Tabs as PartTripTabs } from '@shared/ui/parttrip'
import { AppShell } from '@widgets/app-shell'

import * as S from './NotificationPage.styles'

type Mode = 'list' | 'detail' | 'settings'

export function NotificationPage() { return <NotificationFlow mode="list" /> }
export function NotificationDetailPage() { return <NotificationFlow mode="detail" /> }
export function NotificationSettingsPage() { return <NotificationFlow mode="settings" /> }

function NotificationFlow({ mode }: { mode: Mode }) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('전체')
  const [settings, setSettings] = useState({ group: true, record: true, tripCard: false, vote: true, country: false })
  const updateSetting = (key: keyof typeof settings) => setSettings((current) => ({ ...current, [key]: !current[key] }))

  return (
    <AppShell>
      <S.Page>
        <S.Header><div><S.Title>{mode === 'settings' ? '알림 설정' : mode === 'detail' ? '알림 상세' : '알림'}</S.Title><S.Subtitle>{mode === 'settings' ? '받고 싶은 알림을 선택하세요.' : '여행과 기록에 대한 소식을 확인하세요.'}</S.Subtitle></div>{mode !== 'list' ? <S.BackButton type="button" onClick={() => navigate(paths.notifications)}>알림 목록</S.BackButton> : null}</S.Header>
        {mode === 'list' ? <><PartTripTabs>{['전체', '플래너', '기록'].map((tab) => <PartTripTab key={tab} type="button" $active={activeTab === tab} onClick={() => setActiveTab(tab)}>{tab}</PartTripTab>)}<S.ReadAll type="button" disabled>모두 읽음</S.ReadAll></PartTripTabs><S.List><S.Empty><strong>알림 API가 아직 연결되지 않았습니다.</strong><span>백엔드 알림 계약이 추가되면 읽음 상태와 목록을 이 화면에 연결합니다.</span></S.Empty></S.List></> : null}
        {mode === 'detail' ? <S.Detail><S.StatusDot /><h2>알림 상세 화면</h2><p>알림 API 계약이 없어 실제 알림 내용과 읽음 처리를 아직 조회할 수 없습니다.</p><S.ActionRow><PartTripButton type="button" disabled>읽음 처리</PartTripButton><PartTripButton type="button" $variant="secondary" onClick={() => navigate(paths.notifications)}>목록으로</PartTripButton></S.ActionRow></S.Detail> : null}
        {mode === 'settings' ? <S.SettingsCard>{([['vote', '투표', '그룹원이 투표하거나 마감이 다가올 때'], ['record', '기록', '촬영한 사진 정리가 끝났을 때'], ['country', '국가 획득', '새로운 국가를 획득했을 때'], ['tripCard', '여행카드', '여행카드가 만들어졌을 때'], ['group', '그룹', '초대가 수락되거나 새 멤버가 들어왔을 때']] as const).map(([key, label, description]) => <S.SettingRow key={key}><div><strong>{label}</strong><span>{description}</span></div><S.Toggle type="button" aria-pressed={settings[key]} $active={settings[key]} onClick={() => updateSetting(key)}>{settings[key] ? '켜짐' : '꺼짐'}</S.Toggle></S.SettingRow>)}</S.SettingsCard> : null}
      </S.Page>
    </AppShell>
  )
}
