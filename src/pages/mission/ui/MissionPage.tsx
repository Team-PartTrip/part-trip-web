import { useEffect, useState } from 'react'
import {
  completeMission,
  getCompletedMissions,
  getMissions,
  type MissionResponseDto,
} from '@shared/api'
import missionCharacterUrl from '@shared/assets/mission-character.png'
import { AppShell } from '@widgets/app-shell'

import { CalendarDialog, CompletedMissionDialog, MissionDetailDialog } from './MissionDialogs'
import * as S from './MissionPage.styles'

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
  const [missions, setMissions] = useState<MissionResponseDto[]>([])
  const [completedMissions, setCompletedMissions] = useState<MissionResponseDto[]>([])
  const [activeDialog, setActiveDialog] = useState<'calendar' | 'completed' | null>(null)
  const [selectedMissionId, setSelectedMissionId] = useState<number | null>(null)
  const [pendingMissionId, setPendingMissionId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const completedMissionIds = new Set(
    completedMissions
      .map((mission) => mission.missionId)
      .filter((id): id is number => typeof id === 'number'),
  )
  const completedCount = completedMissionIds.size
  const progress = missions.length > 0 ? Math.round((completedCount / missions.length) * 100) : 0
  const isAllCompleted = missions.length > 0 && completedCount === missions.length
  const selectedMission = missions.find((mission) => mission.missionId === selectedMissionId) ?? null

  useEffect(() => {
    let ignore = false

    async function loadMissions() {
      try {
        setIsLoading(true)
        setErrorMessage('')
        const missionList = await getMissions()
        let completedMissionList = missionList.filter((mission) => mission.completed)
        console.log('missionList', missionList)
        try {
          completedMissionList = await getCompletedMissions()
        } catch {
          // 완료 목록 API가 실패해도 전체 미션 목록은 보여준다.
        }

        if (!ignore) {
          setMissions(missionList)
          setCompletedMissions(completedMissionList)
        }
      } catch {
        if (!ignore) setErrorMessage('미션 목록을 불러오지 못했습니다. 다시 시도해주세요.')
      } finally {
        if (!ignore) setIsLoading(false)
      }
    }

    void loadMissions()

    return () => {
      ignore = true
    }
  }, [])

  const handleComplete = async (missionId: number) => {
    if (completedMissionIds.has(missionId) || pendingMissionId) return

    try {
      setPendingMissionId(missionId)
      setErrorMessage('')
      await completeMission(missionId)
      const completedMissionList = await getCompletedMissions()
      setCompletedMissions(completedMissionList)
      setMissions((current) => current.map((mission) => (
        mission.missionId === missionId ? { ...mission, completed: true } : mission
      )))
    } catch {
      setErrorMessage('미션 완료 상태를 저장하지 못했습니다. 다시 시도해주세요.')
    } finally {
      setPendingMissionId(null)
    }
  }

  return (
    <AppShell>
      <S.Page>
      <S.Content>
        <S.CharacterCard>
          <S.CardActions>
            <button type="button" aria-label="미션 일정 보기" onClick={() => setActiveDialog('calendar')}><CalendarIcon /></button>
            <button type="button" aria-label="완료한 미션 보기" onClick={() => setActiveDialog('completed')}><CheckIcon /></button>
          </S.CardActions>
          <S.Speech>{isAllCompleted ? '모든 미션 완료!' : '나랑 놀자'}</S.Speech>
          <img src={missionCharacterUrl} alt="까미 캐릭터" />
          <S.CharacterName>까미</S.CharacterName>
          <S.Progress aria-label={`미션 진행률 ${progress}%`}><span style={{ width: `${progress}%` }} /></S.Progress>
          <S.ProgressText aria-live="polite">{completedCount} / {missions.length} 완료</S.ProgressText>
        </S.CharacterCard>
        <S.MissionPanel>
          <S.Title>미션 <span>{isAllCompleted ? 'Complete' : 'New'}</span></S.Title>
          {errorMessage ? <S.ErrorMessage role="alert">{errorMessage}</S.ErrorMessage> : null}
          {isLoading ? <S.StateMessage>미션을 불러오는 중입니다.</S.StateMessage> : null}
          {!isLoading && missions.length === 0 ? <S.StateMessage>진행할 미션이 없습니다.</S.StateMessage> : null}
          {!isLoading && missions.length > 0 ? (
            <S.MissionList>
              {missions.map((mission) => {
                const missionId = mission.missionId
                if (typeof missionId !== 'number') return null

                return (
                  <S.MissionCard key={missionId}>
                    <S.MissionCopy>
                      <small>{mission.missionCategory ?? mission.missionCountry ?? '미션'}</small>
                      <h2>{mission.missionTitle ?? '이름 없는 미션'}</h2>
                      <p>{mission.missionDescription ?? ''}</p>
                    </S.MissionCopy>
                    <S.CompleteButton type="button" onClick={() => setSelectedMissionId(missionId)}>
                      자세히 보기 <span>›</span>
                    </S.CompleteButton>
                  </S.MissionCard>
                )
              })}
            </S.MissionList>
          ) : null}
        </S.MissionPanel>
      </S.Content>
      {activeDialog === 'calendar' ? <CalendarDialog onClose={() => setActiveDialog(null)} /> : null}
      {activeDialog === 'completed' ? (
        <CompletedMissionDialog completedMissions={completedMissions} onClose={() => setActiveDialog(null)} />
      ) : null}
      {selectedMission ? (
        <MissionDetailDialog
          mission={selectedMission}
          isCompleted={selectedMission.completed === true || completedMissionIds.has(selectedMission.missionId ?? -1)}
          isPending={pendingMissionId === selectedMission.missionId}
          onClose={() => setSelectedMissionId(null)}
          onComplete={() => {
            if (typeof selectedMission.missionId === 'number') void handleComplete(selectedMission.missionId)
          }}
        />
      ) : null}
      </S.Page>
    </AppShell>
  )
}
