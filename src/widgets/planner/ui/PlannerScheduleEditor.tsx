import { useMemo, useState, type ReactNode } from 'react'
import {
  useSavePlannerScheduleMutation,
  type PlannerSchedulePlaceDto,
  type PlannerScheduleResponseDto,
} from '@/entities/planner'
import { Button } from '@/shared/ui/parttrip'
import { formatDate, getErrorMessage } from '@/shared/utils'
import {
  addEmptyScheduleSlot,
  copyScheduleDays,
  moveScheduleSlot,
  removeScheduleSlot,
  setScheduleSlotPlace,
  swapScheduleSlots,
  toSaveScheduleRequest,
  type EditableScheduleDay,
} from '../model/schedule-edit'
import { PlannerPlacePicker, type Position } from './PlannerPlacePicker'
import * as S from './PlannerAiFlow.styles'

function serialized(days: EditableScheduleDay[]) {
  try { return JSON.stringify(toSaveScheduleRequest(days)) } catch { return '' }
}

export function PlannerScheduleEditor({
  plannerId,
  cityName,
  schedule,
  canManage,
  isConfirmed,
}: {
  plannerId: number
  cityName?: string
  schedule: PlannerScheduleResponseDto
  canManage: boolean
  isConfirmed: boolean
}) {
  const saveMutation = useSavePlannerScheduleMutation()
  const [draft, setDraft] = useState<EditableScheduleDay[]>()
  const [picker, setPicker] = useState<Position>()
  const [swapSource, setSwapSource] = useState<Position>()
  const [feedback, setFeedback] = useState('')
  const [feedbackError, setFeedbackError] = useState(false)

  const days = draft ?? copyScheduleDays(schedule.days)
  const original = useMemo(() => copyScheduleDays(schedule.days), [schedule.days])
  const changed = draft != null && serialized(draft) !== serialized(original)
  const canEdit = canManage && !isConfirmed
  let editorStatus = '리더만 일정을 수정할 수 있어요.'
  if (isConfirmed) editorStatus = '확정된 일정입니다.'
  if (canEdit) editorStatus = '날짜 안에서 순서를 바꾸고 장소를 추가·삭제할 수 있어요.'

  const openPicker = (position: Position) => {
    setPicker(position)
  }

  const closePicker = () => {
    setPicker(undefined)
  }

  const save = async () => {
    if (!draft || !changed || saveMutation.isPending) return
    try {
      setFeedback('')
      setFeedbackError(false)
      await saveMutation.mutateAsync({ plannerId, payload: toSaveScheduleRequest(draft) })
      setDraft(undefined)
      setPicker(undefined)
      setSwapSource(undefined)
      setFeedback('일정을 저장했습니다.')
    } catch (error) {
      setFeedback(`일정을 저장하지 못했어요. ${getErrorMessage(error)}`)
      setFeedbackError(true)
    }
  }

  const cancel = () => {
    if (changed && !window.confirm('저장하지 않은 일정을 취소할까요?')) return
    setDraft(undefined)
    setPicker(undefined)
    setSwapSource(undefined)
    setFeedback('')
  }

  const choosePlace = (place: PlannerSchedulePlaceDto) => {
    if (!draft || !picker) return
    setDraft((current) => current ? setScheduleSlotPlace(current, picker.dayIndex, picker.slotIndex, place) : current)
    closePicker()
    setFeedback('')
  }

  const finishSwap = (target: Position) => {
    if (!draft || !swapSource || (swapSource.dayIndex === target.dayIndex && swapSource.slotIndex === target.slotIndex)) return
    setDraft((current) => current ? swapScheduleSlots(current, swapSource.dayIndex, swapSource.slotIndex, target.dayIndex, target.slotIndex) : current)
    setSwapSource(undefined)
    setFeedback('일정 카드를 서로 바꿨어요. 저장을 눌러 반영해주세요.')
  }

  const startEditing = () => {
    setDraft(copyScheduleDays(schedule.days))
    setFeedback('')
  }

  let editorActions: ReactNode = null
  if (canEdit && draft) {
    editorActions = <S.ButtonRow>
      <Button type="button" $variant="secondary" disabled={saveMutation.isPending} onClick={cancel}>취소</Button>
      <Button type="button" disabled={!changed || saveMutation.isPending || !draft.every((day) => /^\d{4}-\d{2}-\d{2}$/.test(day.date) && day.slots.length <= 50)} onClick={() => void save()}>
        {saveMutation.isPending ? '저장 중…' : '일정 저장'}
      </Button>
    </S.ButtonRow>
  } else if (canEdit) {
    editorActions = <Button type="button" onClick={startEditing}>일정 편집</Button>
  }

  return <>
    <S.EditorHeading>
      <div><p>{editorStatus}</p></div>
      {editorActions}
    </S.EditorHeading>
    <S.ScheduleDays>
      {days.map((day, dayIndex) => <S.ScheduleDay key={day.date || dayIndex}>
        <header><h2>{day.date ? formatDate(day.date) : `${dayIndex + 1}일차`}</h2>{draft ? <Button type="button" $variant="secondary" disabled={day.slots.length >= 50 || saveMutation.isPending}
          onClick={() => {
            setDraft((current) => current ? addEmptyScheduleSlot(current, dayIndex) : current)
            openPicker({ dayIndex, slotIndex: day.slots.length })
          }}>＋ 빈 일정 카드</Button> : null}</header>
        {day.slots.length ? day.slots.map((slot, slotIndex) => {
          const position = { dayIndex, slotIndex }
          const isSwapSource = swapSource?.dayIndex === dayIndex && swapSource.slotIndex === slotIndex
          const placeId = slot.tourPlaceId ?? slot.place?.tourPlaceId
          const placeName = slot.place?.name || '장소 미정'
          let swapLabel = '바꾸기'
          if (swapSource && !isSwapSource) swapLabel = '이 카드와 바꾸기'
          if (isSwapSource) swapLabel = '교환 취소'
          return <S.SchedulePlace key={`${day.date}-${slot.slotId ?? placeId ?? 'empty'}-${slotIndex}`}>
            <b aria-hidden="true">{slotIndex + 1}</b>
            <span><strong>{placeName}</strong>{slot.place?.address ? <small>{slot.place.address}</small> : null}</span>
            {draft ? <S.SlotTools>
              <Button type="button" $variant="secondary" aria-label={`${placeName} 위로 이동`} disabled={slotIndex === 0 || saveMutation.isPending}
                onClick={() => setDraft((current) => current ? moveScheduleSlot(current, dayIndex, slotIndex, -1) : current)}>위로</Button>
              <Button type="button" $variant="secondary" aria-label={`${placeName} 아래로 이동`} disabled={slotIndex === day.slots.length - 1 || saveMutation.isPending}
                onClick={() => setDraft((current) => current ? moveScheduleSlot(current, dayIndex, slotIndex, 1) : current)}>아래로</Button>
              <S.SwapButton type="button" $active={isSwapSource} disabled={saveMutation.isPending} onClick={() => {
                if (swapSource && !isSwapSource) finishSwap(position)
                else setSwapSource(isSwapSource ? undefined : position)
              }}>{swapLabel}</S.SwapButton>
              <Button type="button" $variant="secondary" disabled={saveMutation.isPending} onClick={() => openPicker(position)}>{placeId ? '장소 변경' : '＋ 장소 고르기'}</Button>
              <Button type="button" $variant="secondary" disabled={saveMutation.isPending} onClick={() => {
                setDraft((current) => current ? removeScheduleSlot(current, dayIndex, slotIndex) : current)
                setSwapSource(undefined)
              }}>삭제</Button>
            </S.SlotTools> : null}
          </S.SchedulePlace>
        }) : <p>이 날짜에는 장소가 아직 정해지지 않았어요.</p>}
      </S.ScheduleDay>)}
    </S.ScheduleDays>
    {swapSource ? <S.EditorFeedback role="status">바꿀 카드를 선택해주세요.</S.EditorFeedback> : null}
    {picker && draft ? <PlannerPlacePicker
      key={`${picker.dayIndex}-${picker.slotIndex}`}
      canEdit={canEdit}
      plannerId={plannerId}
      cityName={cityName}
      days={days}
      position={picker}
      isPending={saveMutation.isPending}
      onClose={closePicker}
      onSelect={choosePlace}
    /> : null}
    {feedback ? <S.EditorFeedback role={feedbackError ? 'alert' : 'status'} $error={feedbackError}>{feedback}</S.EditorFeedback> : null}
  </>
}
