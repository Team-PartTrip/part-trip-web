import { Fragment, useMemo, useState, type ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  type PlannerScheduleSlotDto,
  useSavePlannerScheduleMutation,
  type PlannerSchedulePlaceDto,
  type PlannerScheduleResponseDto,
} from '@/entities/planner'
import { tourPlacesQueryOptions } from '@/entities/travel'
import { Button } from '@/shared/ui/parttrip'
import { formatDate, getErrorMessage } from '@/shared/utils'
import {
  addEmptyScheduleSlot,
  getDayOrigin,
  getRouteFailureMessage,
  copyScheduleDays,
  moveScheduleSlot,
  removeScheduleSlot,
  setScheduleSlotPlace,
  swapScheduleSlots,
  toSaveScheduleRequest,
  type EditableScheduleDay,
} from '../model/schedule-edit'
import { PlannerPlacePicker, type Position } from './PlannerPlacePicker'
import { PlannerScheduleAttribution, PlannerScheduleDepartureIcon, PlannerScheduleRouteFallback, PlannerScheduleRouteLine } from './PlannerScheduleRoute'
import { PlannerPlaceAccessibility } from './PlannerPlaceAccessibility'
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
  onEditingChange,
}: {
  plannerId: number
  cityName?: string
  schedule: PlannerScheduleResponseDto
  canManage: boolean
  isConfirmed: boolean
  onEditingChange: (editing: boolean) => void
}) {
  const saveMutation = useSavePlannerScheduleMutation()
  const placesQuery = useQuery(tourPlacesQueryOptions('대한민국', cityName, undefined, Boolean(cityName)))
  const [draft, setDraft] = useState<EditableScheduleDay[]>()
  const [picker, setPicker] = useState<Position>()
  const [swapSource, setSwapSource] = useState<Position>()
  const [feedback, setFeedback] = useState('')
  const [feedbackError, setFeedbackError] = useState(false)

  const days = draft ?? copyScheduleDays(schedule.days)
  const original = useMemo(() => copyScheduleDays(schedule.days), [schedule.days])
  const changed = draft != null && serialized(draft) !== serialized(original)
  const resolveSlotPlace = (slot: PlannerScheduleSlotDto) => {
    const placeId = slot.tourPlaceId ?? slot.place?.tourPlaceId
    const apiPlace = placesQuery.data?.find((item) => item.tourPlaceId === placeId)
    if (!slot.place && !placeId) return undefined
    return {
      name: slot.place?.name ?? apiPlace?.placeName ?? (placeId ? `장소 ${placeId}` : undefined),
      category: slot.place?.category ?? apiPlace?.category ?? slot.place?.categoryLabel,
      latitude: slot.place?.latitude ?? apiPlace?.latitude,
      longitude: slot.place?.longitude ?? apiPlace?.longitude,
    }
  }
  const hasDailyQuotaReached = schedule.days?.some((day) =>
    day.slots?.some((slot) => slot.routeStatus === 'DAILY_QUOTA_REACHED'),
  ) ?? false
  const hasRouteApiError = schedule.days?.some((day) =>
    day.slots?.some((slot) => !slot.routeFromPrevious && slot.routeStatus !== 'DAILY_QUOTA_REACHED' && getRouteFailureMessage(slot.routeStatus)),
  ) ?? false
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
      onEditingChange(false)
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
    onEditingChange(false)
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
    closePicker()
    setFeedback('일정 카드를 서로 바꿨어요. 저장을 눌러 반영해주세요.')
  }

  const startEditing = () => {
    setDraft(copyScheduleDays(schedule.days))
    onEditingChange(true)
    setFeedback('')
  }

  const moveSlot = (dayIndex: number, slotIndex: number, direction: -1 | 1) => {
    setDraft((current) => current ? moveScheduleSlot(current, dayIndex, slotIndex, direction) : current)
    setSwapSource(undefined)
    closePicker()
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
    {hasDailyQuotaReached ? <S.RouteNotice role="status">오늘 이동 경로 조회 한도를 다 써서 경로를 못 불러왔어요.</S.RouteNotice> : null}
    {hasRouteApiError ? <S.RouteNotice role="alert">일정은 불러왔지만, 일부 장소 사이 경로를 찾지 못했어요. 칸마다 이유를 확인해 주세요.</S.RouteNotice> : null}
    <S.ScheduleDays>
      {days.map((day, dayIndex) => {
        const origin = getDayOrigin(days, dayIndex, schedule.departure, resolveSlotPlace)
        const originName = origin?.point.name?.trim() ?? ''
        const originKind = origin?.isLodging ? 'bed' : originName.includes('집') ? 'home' : originName.endsWith('역') ? 'train' : 'pin'
        return <S.ScheduleDay key={day.date || dayIndex}>
        <header><h2>{day.date ? formatDate(day.date) : `${dayIndex + 1}일차`}</h2>{draft ? <Button type="button" $variant="secondary" disabled={day.slots.length >= 50 || saveMutation.isPending}
          onClick={() => {
            setDraft((current) => current ? addEmptyScheduleSlot(current, dayIndex) : current)
            openPicker({ dayIndex, slotIndex: day.slots.length })
          }}>＋ 빈 일정 카드</Button> : null}</header>
        {origin ? <S.SchedulePlace>
          <b aria-hidden="true"><PlannerScheduleDepartureIcon kind={originKind} /></b>
          <div><small>0번째 · {origin.isLodging ? '숙소에서 출발' : '출발'}</small><strong>{originName || '출발지'}</strong></div>
        </S.SchedulePlace> : null}
        {day.slots.length ? day.slots.map((slot, slotIndex) => {
          const position = { dayIndex, slotIndex }
          const isSwapSource = swapSource?.dayIndex === dayIndex && swapSource.slotIndex === slotIndex
          const placeId = slot.tourPlaceId ?? slot.place?.tourPlaceId
          const place = slot.place
          const apiPlace = placesQuery.data?.find((item) => item.tourPlaceId === placeId)
          const routeOriginSlot = [...day.slots.slice(0, slotIndex)].reverse().find((previousSlot) => previousSlot.place || previousSlot.tourPlaceId)
          const routeOrigin = routeOriginSlot ? resolveSlotPlace(routeOriginSlot) : origin?.point
          const placeName = place?.name || apiPlace?.placeName || (placeId ? `장소 ${placeId}` : canEdit ? '장소를 선택해주세요' : '장소가 아직 정해지지 않았어요')
          let swapLabel = '바꾸기'
          if (swapSource && !isSwapSource) swapLabel = '이 카드와 바꾸기'
          if (isSwapSource) swapLabel = '교환 취소'
          return <Fragment key={`${day.date}-${slot.slotId ?? placeId ?? 'empty'}-${slotIndex}`}>
            {!changed && slot.routeFromPrevious ? <PlannerScheduleRouteLine
              route={slot.routeFromPrevious}
              placeName={place?.name ?? apiPlace?.placeName}
              latitude={place?.latitude ?? apiPlace?.latitude}
              longitude={place?.longitude ?? apiPlace?.longitude}
              origin={routeOrigin}
            /> : null}
            {!changed && !slot.routeFromPrevious && getRouteFailureMessage(slot.routeStatus) ? <PlannerScheduleRouteFallback
              message={getRouteFailureMessage(slot.routeStatus)!}
              placeName={place?.name ?? apiPlace?.placeName}
              latitude={place?.latitude ?? apiPlace?.latitude}
              longitude={place?.longitude ?? apiPlace?.longitude}
              origin={routeOrigin}
            /> : null}
            <S.SchedulePlace>
              <b aria-hidden="true">{slotIndex + 1}</b>
              <div style={{ minWidth: 0 }}><strong>{placeName}</strong>{place?.address || apiPlace?.address ? <small>{place?.address || apiPlace?.address}</small> : null}{placeId ? <PlannerPlaceAccessibility tourPlaceId={placeId} /> : null}</div>
              {draft ? <S.SlotTools>
                <Button type="button" $variant="secondary" aria-label={`${placeName} 위로 이동`} disabled={slotIndex === 0 || saveMutation.isPending}
                  onClick={() => moveSlot(dayIndex, slotIndex, -1)}>위로</Button>
                <Button type="button" $variant="secondary" aria-label={`${placeName} 아래로 이동`} disabled={slotIndex === day.slots.length - 1 || saveMutation.isPending}
                  onClick={() => moveSlot(dayIndex, slotIndex, 1)}>아래로</Button>
                <S.SwapButton type="button" $active={isSwapSource} disabled={saveMutation.isPending} onClick={() => {
                  if (swapSource && !isSwapSource) finishSwap(position)
                  else setSwapSource(isSwapSource ? undefined : position)
                }}>{swapLabel}</S.SwapButton>
                <Button type="button" $variant="secondary" disabled={saveMutation.isPending} onClick={() => openPicker(position)}>{placeId ? '장소 변경' : '＋ 장소 고르기'}</Button>
                <Button type="button" $variant="secondary" disabled={saveMutation.isPending} onClick={() => {
                  setDraft((current) => current ? removeScheduleSlot(current, dayIndex, slotIndex) : current)
                  setSwapSource(undefined)
                  closePicker()
                }}>삭제</Button>
              </S.SlotTools> : null}
            </S.SchedulePlace>
            {picker?.dayIndex === dayIndex && picker.slotIndex === slotIndex && draft ? <PlannerPlacePicker
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
          </Fragment>
        }) : <p>이 날짜에는 장소가 아직 정해지지 않았어요.</p>}
      </S.ScheduleDay>
      })}
    </S.ScheduleDays>
    {swapSource ? <S.EditorFeedback role="status">바꿀 카드를 선택해주세요.</S.EditorFeedback> : null}
    {feedback ? <S.EditorFeedback role={feedbackError ? 'alert' : 'status'} $error={feedbackError}>{feedback}</S.EditorFeedback> : null}
    {!changed && schedule.days?.some((day) => day.slots?.some((slot) => slot.routeFromPrevious?.transportMode === 'PUBLIC_TRANSIT')) ? <PlannerScheduleAttribution /> : null}
  </>
}
