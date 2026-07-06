import { useState } from 'react'
import { completeMissionMock } from '@shared/api'
import logoUrl from '@shared/assets/logo.png'
import missionCharacterUrl from '@shared/assets/mission-character.png'
import { MENUS, Sidebar } from '@widgets/sidebar'

import * as S from './MissionPage.styles'

const missions = [
  { category: '기본 미션', description: '준비해 칠리크랩 라면을 파는 가게가 있어요.\n한번 도전해보세요!', id: 'chili-crab', title: '칠리크랩 라면 먹기 🍜' },
  { category: '해설카메라 미션', description: '물을 뿜는 머라이언 사자와 특이한 사진 한장 어때요?', id: 'merlion', title: '머라이언 사자 보기 🦁' },
  { category: '해설카메라 미션', description: '동심의 세계로, 유니버셜 지구본과 함께 기념사진을 찍어요', id: 'universal', title: '유니버셜 지구본 찍기 🌏' },
  { category: '해설카메라 미션', description: '노래에 맞춰서 움직이는 라이트쇼, 우산은 챙기셨나요?', id: 'supertree', title: '슈퍼트리 라이트쇼 구경하기 💡' },
  { category: '해설카메라 미션', description: '플라이어를 이용하시려면 야경이 시작되는 시간을 확인하세요!', id: 'flyer', title: '밤의 플라이어 방문하기' },
] as const

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
    () => new Set(),
  )
  const [pendingMissionId, setPendingMissionId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const completedCount = completedMissionIds.size
  const progress = Math.round((completedCount / missions.length) * 100)
  const isAllCompleted = completedCount === missions.length

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
            <button type="button" aria-label="미션 일정 보기"><CalendarIcon /></button>
            <button type="button" aria-label="완료한 미션 보기"><CheckIcon /></button>
          </S.CardActions>
          <S.Speech>{isAllCompleted ? '모든 미션 완료!' : completedCount > 0 ? `${completedCount}개 완료했어!` : '나랑 놀자'}</S.Speech>
          <img src={missionCharacterUrl} alt="까미 캐릭터" />
          <S.CharacterName><small>알</small> 까미</S.CharacterName>
          <S.Progress aria-label={`미션 진행률 ${progress}%`}><span style={{ width: `${progress}%` }} /></S.Progress>
          <S.ProgressText>{completedCount} / {missions.length} 완료</S.ProgressText>
        </S.CharacterCard>
        <S.MissionPanel>
          <S.Title>미션 <span>{isAllCompleted ? 'Complete' : `${missions.length - completedCount} New`}</span></S.Title>
          {errorMessage ? <S.ErrorMessage role="alert">{errorMessage}</S.ErrorMessage> : null}
          <S.MissionList>
            {missions.map((mission) => {
              const isCompleted = completedMissionIds.has(mission.id)
              const isPending = pendingMissionId === mission.id
              return (
              <S.MissionCard key={mission.id} $completed={isCompleted}>
                <S.MissionCopy><small>{mission.category}</small><h2>{mission.title}</h2><p>{mission.description}</p></S.MissionCopy>
                <S.CompleteButton type="button" disabled={isCompleted || pendingMissionId !== null} onClick={() => void handleComplete(mission.id)}>
                  {isCompleted ? '완료 ✓' : isPending ? '저장 중' : '미션 완료'}
                </S.CompleteButton>
              </S.MissionCard>
              )
            })}
          </S.MissionList>
        </S.MissionPanel>
      </S.Content>
    </S.Page>
  )
}
