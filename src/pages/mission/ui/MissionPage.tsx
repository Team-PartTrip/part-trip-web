import { useState } from 'react'
import { completeMissionMock } from '@shared/api'
import logoUrl from '@shared/assets/logo.png'
import missionCharacterUrl from '@shared/assets/mission-character.png'
import { MENUS, Sidebar } from '@widgets/sidebar'

import { CalendarDialog, CompletedMissionDialog, MissionDetailDialog } from './MissionDialogs'
import * as S from './MissionPage.styles'
import { missions } from './missionData'

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3v3m10-3v3M4.5 9h15M6 5h12a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
      <path d="M8 13h2m4 0h2m-8 3h2m4 0h2" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16.5 9" />
    </svg>
  )
}

export function MissionPage() {
  const [completedMissionIds, setCompletedMissionIds] = useState<Set<string>>(
    () => new Set(['chili-crab', 'merlion', 'universal']),
  )
  const [activeDialog, setActiveDialog] = useState<'calendar' | 'completed' | null>(null)
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null)
  const [pendingMissionId, setPendingMissionId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const completedCount = completedMissionIds.size
  const progress = Math.round((completedCount / missions.length) * 100)
  const isAllCompleted = completedCount === missions.length
  const selectedMission = missions.find((mission) => mission.id === selectedMissionId) ?? null
  const completedMissions = missions.filter((mission) => completedMissionIds.has(mission.id))

  const handleComplete = async (missionId: string) => {
    if (completedMissionIds.has(missionId) || pendingMissionId) return

    try {
      setPendingMissionId(missionId)
      setErrorMessage('')
      const result = await completeMissionMock(missionId)
      setCompletedMissionIds((current) => new Set(current).add(result.missionId))
    } catch {
      setErrorMessage('미션 완료 상태를 저장하지 못했습니다. 다시 시도해주세요.')
    } finally {
      setPendingMissionId(null)
    }
  }

  return (
    <S.Page>
      <Sidebar logo={<S.Logo src={logoUrl} alt="PartTrip" />} menus={MENUS} />
      <S.Content>
        <S.CharacterCard>
          <S.CardActions>
            <button type="button" aria-label="미션 일정 보기" onClick={() => setActiveDialog('calendar')}><CalendarIcon /></button>
            <button type="button" aria-label="완료한 미션 보기" onClick={() => setActiveDialog('completed')}><CheckIcon /></button>
          </S.CardActions>
          <S.Speech>{isAllCompleted ? '모든 미션 완료!' : '나랑 놀자'}</S.Speech>
          <img src={missionCharacterUrl} alt="까미 캐릭터" />
          <S.CharacterName><small>알</small> 까미</S.CharacterName>
          <S.Progress aria-label={`미션 진행률 ${progress}%`}><span style={{ width: `${progress}%` }} /></S.Progress>
          <S.ProgressText aria-live="polite">{completedCount} / {missions.length} 완료</S.ProgressText>
        </S.CharacterCard>
        <S.MissionPanel>
          <S.Title>미션 <span>{isAllCompleted ? 'Complete' : 'New'}</span></S.Title>
          {errorMessage ? <S.ErrorMessage role="alert">{errorMessage}</S.ErrorMessage> : null}
          <S.MissionList>
            {missions.map((mission) => {
              return (
              <S.MissionCard key={mission.id}>
                <S.MissionCopy><small>{mission.category}</small><h2>{mission.title} {mission.emoji}</h2><p>{mission.description}</p></S.MissionCopy>
                <S.CompleteButton type="button" onClick={() => setSelectedMissionId(mission.id)}>
                  자세히 보기 <span>›</span>
                </S.CompleteButton>
              </S.MissionCard>
              )
            })}
          </S.MissionList>
        </S.MissionPanel>
      </S.Content>
      {activeDialog === 'calendar' ? <CalendarDialog onClose={() => setActiveDialog(null)} /> : null}
      {activeDialog === 'completed' ? (
        <CompletedMissionDialog completedMissions={completedMissions} onClose={() => setActiveDialog(null)} />
      ) : null}
      {selectedMission ? (
        <MissionDetailDialog
          mission={selectedMission}
          isCompleted={completedMissionIds.has(selectedMission.id)}
          isPending={pendingMissionId === selectedMission.id}
          onClose={() => setSelectedMissionId(null)}
          onComplete={() => void handleComplete(selectedMission.id)}
        />
      ) : null}
    </S.Page>
  )
}
