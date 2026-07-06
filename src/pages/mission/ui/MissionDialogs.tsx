import { useEffect, useRef, useState } from 'react'

import type { Mission } from './missionData'
import * as S from './MissionPage.styles'

type DialogShellProps = {
  children: React.ReactNode
  labelledBy: string
  onClose: () => void
}

function DialogShell({ children, labelledBy, onClose }: DialogShellProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeButtonRef.current?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <S.DialogDimmer
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <S.Dialog role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
        <S.DialogClose ref={closeButtonRef} type="button" onClick={onClose} aria-label="닫기">×</S.DialogClose>
        {children}
      </S.Dialog>
    </S.DialogDimmer>
  )
}

const weekDays = ['일', '월', '화', '수', '목', '금', '토']
const may2026Days = [
  ...Array.from({ length: 5 }, () => null),
  ...Array.from({ length: 31 }, (_, index) => index + 1),
  ...Array.from({ length: 6 }, () => null),
]

type CalendarDialogProps = {
  onClose: () => void
}

export function CalendarDialog({ onClose }: CalendarDialogProps) {
  const [selectedDay, setSelectedDay] = useState(12)
  const [attendedDays, setAttendedDays] = useState(() => new Set([8, 9, 10, 11]))
  const isAttended = attendedDays.has(selectedDay)

  const handleAttendance = () => {
    setAttendedDays((current) => new Set(current).add(selectedDay))
  }

  return (
    <DialogShell labelledBy="mission-calendar-title" onClose={onClose}>
      <S.CalendarContent>
        <S.CalendarHeading>
          <div>
            <S.DialogTitle id="mission-calendar-title">2026년 5월 <small>▾</small></S.DialogTitle>
            <S.Streak>연속출석 <strong>{attendedDays.size}일째</strong></S.Streak>
          </div>
          <S.CalendarLegend><span>□ 오늘</span><span>■ 출석</span></S.CalendarLegend>
        </S.CalendarHeading>
        <S.CalendarGrid>
          {weekDays.map((day) => <S.WeekDay key={day}>{day}</S.WeekDay>)}
          {may2026Days.map((day, index) => day === null
            ? <span key={`empty-${index}`} />
            : (
              <S.CalendarDay
                key={day}
                type="button"
                $attended={attendedDays.has(day)}
                $selected={selectedDay === day}
                onClick={() => setSelectedDay(day)}
                aria-label={`5월 ${day}일${attendedDays.has(day) ? ', 출석 완료' : ''}`}
              >
                {day}
              </S.CalendarDay>
            ))}
        </S.CalendarGrid>
        <S.AttendanceButton type="button" onClick={handleAttendance} disabled={isAttended}>
          {isAttended ? '출석 체크 완료' : '출석 체크하고 포인트받기'}
        </S.AttendanceButton>
      </S.CalendarContent>
    </DialogShell>
  )
}

type CompletedMissionDialogProps = {
  completedMissions: Mission[]
  onClose: () => void
}

export function CompletedMissionDialog({ completedMissions, onClose }: CompletedMissionDialogProps) {
  return (
    <DialogShell labelledBy="completed-mission-title" onClose={onClose}>
      <S.CompletedContent>
        <S.DialogTitle id="completed-mission-title">완료된 미션</S.DialogTitle>
        {completedMissions.length > 0 ? (
          <S.CompletedList>
            {completedMissions.map((mission) => (
              <S.CompletedCard key={mission.id}>
                <small>{mission.category}</small>
                <h3>{mission.title} {mission.emoji}</h3>
                <p>{mission.description}</p>
              </S.CompletedCard>
            ))}
          </S.CompletedList>
        ) : (
          <S.EmptyCompleted>
            <strong>아직 완료한 미션이 없어요.</strong>
            <span>미션을 하나씩 완료하면 이곳에서 확인할 수 있어요.</span>
          </S.EmptyCompleted>
        )}
      </S.CompletedContent>
    </DialogShell>
  )
}

type MissionDetailDialogProps = {
  isCompleted: boolean
  isPending: boolean
  mission: Mission
  onClose: () => void
  onComplete: () => void
}

export function MissionDetailDialog({ isCompleted, isPending, mission, onClose, onComplete }: MissionDetailDialogProps) {
  return (
    <DialogShell labelledBy="mission-detail-title" onClose={onClose}>
      <S.DetailContent>
        <small>{mission.category}</small>
        <S.DialogTitle id="mission-detail-title">{mission.title} {mission.emoji}</S.DialogTitle>
        <p>{mission.description}</p>
        <S.AttendanceButton type="button" onClick={onComplete} disabled={isCompleted || isPending}>
          {isCompleted ? '완료한 미션' : isPending ? '저장 중' : '미션 완료하기'}
        </S.AttendanceButton>
      </S.DetailContent>
    </DialogShell>
  )
}
