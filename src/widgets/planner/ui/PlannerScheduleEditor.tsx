import { Fragment, useMemo, useState, type ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  type PlannerScheduleRouteDto,
  type PlannerScheduleRouteStepDto,
  useSavePlannerScheduleMutation,
  type PlannerSchedulePlaceDto,
  type PlannerScheduleResponseDto,
} from '@/entities/planner'
import { tourPlacesQueryOptions } from '@/entities/travel'
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
import { PlannerPlaceAccessibility } from './PlannerPlaceAccessibility'
import * as S from './PlannerAiFlow.styles'

function serialized(days: EditableScheduleDay[]) {
  try { return JSON.stringify(toSaveScheduleRequest(days)) } catch { return '' }
}

const routeModeLabels = {
  PUBLIC_TRANSIT: '대중교통',
  CAR: '자동차',
  TAXI: '택시',
  WALKING: '도보',
} satisfies Record<NonNullable<PlannerScheduleRouteDto['transportMode']>, string>

function RouteModeIcon({ mode }: { mode?: PlannerScheduleRouteDto['transportMode'] }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {mode === 'PUBLIC_TRANSIT' ? <>
      <rect x="5" y="3" width="14" height="16" rx="2" />
      <path d="M5 7h14M7 19v2m10-2v2M8 13h.01M16 13h.01" />
    </> : mode === 'CAR' || mode === 'TAXI' ? <>
      {mode === 'TAXI' ? <path d="M9.5 3.5h5v2h-5z" /> : null}
      <path d="M4 16v-3.8c0-.7.5-1.2 1.1-1.4l1.6-3.7A1.6 1.6 0 0 1 8.2 6h7.6a1.6 1.6 0 0 1 1.5 1.1l1.6 3.7c.6.2 1.1.7 1.1 1.4V16H4Z" />
      <path d="M5 11h14M7 16v2m10-2v2M7.5 13.5h.01M16.5 13.5h.01" />
    </> : mode === 'WALKING' ? <>
      <circle cx="13" cy="4" r="2" />
      <path d="m11.5 7.5-2.3 5.2 3.2 2.1 1.2 5M11.3 8l4 1.2 1.4 3.3M9.2 12.7 6.5 16" />
    </> : <>
      <circle cx="6" cy="6" r="1.7" />
      <circle cx="18" cy="18" r="1.7" />
      <path d="M8 6h2a4 4 0 0 1 4 4v4a4 4 0 0 0 4 4" />
    </>}
  </svg>
}

function formatRouteStep(step: PlannerScheduleRouteStepDto) {
  const stops = step.boardingStop && step.alightingStop
    ? `${step.boardingStop} → ${step.alightingStop}`
    : step.boardingStop || step.alightingStop
  return [
    step.name?.trim() || step.type?.trim(),
    stops,
    typeof step.stopCount === 'number' && step.stopCount > 0 ? `${step.stopCount}정거장` : undefined,
    typeof step.durationMinutes === 'number' && step.durationMinutes > 0 ? `${step.durationMinutes}분` : undefined,
  ].filter(Boolean).join(' · ')
}

function getKakaoMapUrl(name?: string, latitude?: number, longitude?: number) {
  if (!name?.trim() || typeof latitude !== 'number' || !Number.isFinite(latitude)
    || typeof longitude !== 'number' || !Number.isFinite(longitude)) return undefined

  return `https://map.kakao.com/link/to/${encodeURIComponent(name.trim())},${latitude},${longitude}`
}

function PlannerRouteLine({
  route,
  placeName,
  latitude,
  longitude,
}: {
  route: PlannerScheduleRouteDto
  placeName?: string
  latitude?: number
  longitude?: number
}) {
  const modeLabel = route.transportMode ? routeModeLabels[route.transportMode] ?? '이동' : '이동'
  const summary = [
    typeof route.durationMinutes === 'number' && route.durationMinutes > 0 ? `${route.durationMinutes}분` : undefined,
    typeof route.walkingMinutes === 'number' && route.walkingMinutes > 0 ? `도보 ${route.walkingMinutes}분` : undefined,
  ].filter(Boolean).join(' · ')
  const steps = (route.steps ?? []).map(formatRouteStep).filter(Boolean)
  const kakaoMapUrl = getKakaoMapUrl(placeName, latitude, longitude)

  return <S.RouteLine>
    <S.RouteModeIcon><RouteModeIcon mode={route.transportMode} /></S.RouteModeIcon>
    <div>
      <S.RouteSummary>
        <strong>{modeLabel}</strong>
        {summary ? <span>{summary}</span> : null}
        {kakaoMapUrl ? <a href={kakaoMapUrl} target="_blank" rel="noopener noreferrer" aria-label={`${placeName} 카카오맵에서 길 안내 열기`}>길 안내</a> : null}
      </S.RouteSummary>
      {steps.length ? <details>
        <summary>경로 상세</summary>
        <ol>{steps.map((step, index) => <li key={`${step}-${index}`}>{step}</li>)}</ol>
      </details> : null}
    </div>
  </S.RouteLine>
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
  const placesQuery = useQuery(tourPlacesQueryOptions('대한민국', cityName, undefined, Boolean(cityName)))
  const [draft, setDraft] = useState<EditableScheduleDay[]>()
  const [picker, setPicker] = useState<Position>()
  const [swapSource, setSwapSource] = useState<Position>()
  const [feedback, setFeedback] = useState('')
  const [feedbackError, setFeedbackError] = useState(false)

  const days = draft ?? copyScheduleDays(schedule.days)
  const original = useMemo(() => copyScheduleDays(schedule.days), [schedule.days])
  const changed = draft != null && serialized(draft) !== serialized(original)
  const isEditingSchedule = draft != null || saveMutation.isPending
  const hasDailyQuotaReached = schedule.days?.some((day) =>
    day.slots?.some((slot) => slot.routeStatus === 'DAILY_QUOTA_REACHED'),
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
    {hasDailyQuotaReached ? <S.RouteNotice role="status">오늘 이동 경로 조회 한도를 다 써서 경로를 못 불러왔어요.</S.RouteNotice> : null}
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
          const place = slot.place
          const apiPlace = placesQuery.data?.find((item) => item.tourPlaceId === placeId)
          const placeName = place?.name || apiPlace?.placeName || (placeId ? `장소 ${placeId}` : canEdit ? '장소를 선택해주세요' : '장소가 아직 정해지지 않았어요')
          let swapLabel = '바꾸기'
          if (swapSource && !isSwapSource) swapLabel = '이 카드와 바꾸기'
          if (isSwapSource) swapLabel = '교환 취소'
          return <Fragment key={`${day.date}-${slot.slotId ?? placeId ?? 'empty'}-${slotIndex}`}>
            {slotIndex > 0 && !isEditingSchedule && slot.routeStatus === 'READY' && slot.routeFromPrevious ? <PlannerRouteLine
              route={slot.routeFromPrevious}
              placeName={place?.name ?? apiPlace?.placeName}
              latitude={place?.latitude ?? apiPlace?.latitude}
              longitude={place?.longitude ?? apiPlace?.longitude}
            /> : null}
            <S.SchedulePlace>
              <b aria-hidden="true">{slotIndex + 1}</b>
              <div style={{ minWidth: 0 }}><strong>{placeName}</strong>{place?.address || apiPlace?.address ? <small>{place?.address || apiPlace?.address}</small> : null}{placeId ? <PlannerPlaceAccessibility tourPlaceId={placeId} /> : null}</div>
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
      </S.ScheduleDay>)}
    </S.ScheduleDays>
    {swapSource ? <S.EditorFeedback role="status">바꿀 카드를 선택해주세요.</S.EditorFeedback> : null}
    {feedback ? <S.EditorFeedback role={feedbackError ? 'alert' : 'status'} $error={feedbackError}>{feedback}</S.EditorFeedback> : null}
  </>
}
