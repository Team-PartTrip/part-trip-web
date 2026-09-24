import { useEffect, useMemo, useRef, useState } from 'react'
import {
  usePlannerScheduleCandidatesQuery,
  useSavePlannerScheduleMutation,
  type PlannerScheduleCandidateDto,
  type PlannerSchedulePlaceDto,
  type PlannerScheduleResponseDto,
} from '@/entities/planner'
import { useMoreTourPlacesQuery, type TourPlaceResponseDto } from '@/entities/travel'
import { Button, Input, Select } from '@/shared/ui/parttrip'
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
import * as S from './PlannerAiFlow.styles'

type Position = { dayIndex: number; slotIndex: number }
type PickerPlace = PlannerScheduleCandidateDto | TourPlaceResponseDto
type SpeechResults = { results: ArrayLike<ArrayLike<{ transcript: string }>> }
type SpeechRecognitionLike = {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  onresult: ((event: SpeechResults) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike

function schedulePlace(place: PickerPlace): PlannerSchedulePlaceDto | undefined {
  const name = 'name' in place ? place.name : place.placeName
  if (!Number.isSafeInteger(place.tourPlaceId) || !name) return undefined
  return {
    address: place.address,
    category: place.category,
    categoryLabel: 'categoryLabel' in place ? place.categoryLabel : place.category,
    imageUrl: place.imageUrl,
    latitude: place.latitude,
    longitude: place.longitude,
    name,
    rating: place.rating,
    tourPlaceId: place.tourPlaceId,
  }
}

function currentPlaceId(day?: EditableScheduleDay, slotIndex?: number) {
  if (!day || slotIndex == null) return undefined
  const slot = day.slots[slotIndex]
  return slot?.tourPlaceId ?? slot?.place?.tourPlaceId
}

function serialized(days: EditableScheduleDay[]) {
  try { return JSON.stringify(toSaveScheduleRequest(days)) } catch { return '' }
}

function speechRecognitionConstructor() {
  const browser = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
  return browser.SpeechRecognition ?? browser.webkitSpeechRecognition
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
  const [searchText, setSearchText] = useState('')
  const [submittedSearch, setSubmittedSearch] = useState('')
  const [moreCategory, setMoreCategory] = useState('')
  const [showMore, setShowMore] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [feedbackError, setFeedbackError] = useState(false)
  const [voiceMessage, setVoiceMessage] = useState('')
  const [listening, setListening] = useState(false)
  const candidateListRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognitionLike | undefined>(undefined)

  const days = draft ?? copyScheduleDays(schedule.days)
  const original = useMemo(() => copyScheduleDays(schedule.days), [schedule.days])
  const changed = draft != null && serialized(draft) !== serialized(original)
  const canEdit = canManage && !isConfirmed
  const selectedDay = picker ? days[picker.dayIndex] : undefined
  const candidatesQuery = usePlannerScheduleCandidatesQuery(
    plannerId,
    selectedDay?.date ?? '',
    submittedSearch,
    Boolean(canEdit && draft && picker && selectedDay?.date),
  )
  const candidates = candidatesQuery.data ?? []
  const categories = [...new Set(candidates.map((place) => place.category).filter((value): value is string => Boolean(value)))]
  const category = categories.includes(moreCategory) ? moreCategory : categories[0] ?? ''
  const moreQuery = useMoreTourPlacesQuery(
    '대한민국',
    cityName ?? '',
    category,
    Boolean(canEdit && draft && picker && showMore && category),
  )
  const morePlaces = moreQuery.data?.pages.flatMap((page) => page.places ?? []) ?? []
  const fetchMorePlaces = moreQuery.fetchNextPage
  const hasMorePlaces = moreQuery.hasNextPage
  const isFetchingMorePlaces = moreQuery.isFetchingNextPage
  const usedPlaceIds = new Set(days.flatMap((day) => day.slots.map((slot) => slot.tourPlaceId ?? slot.place?.tourPlaceId).filter((id): id is number => Number.isSafeInteger(id))))
  const selectedPlaceId = currentPlaceId(selectedDay, picker?.slotIndex)
  if (selectedPlaceId != null) usedPlaceIds.delete(selectedPlaceId)
  const seen = new Set<number>(usedPlaceIds)
  const availablePlaces = [...candidates, ...morePlaces].flatMap((place) => {
    const option = schedulePlace(place)
    if (!option?.tourPlaceId || seen.has(option.tourPlaceId)) return []
    seen.add(option.tourPlaceId)
    return [option]
  })

  useEffect(() => () => recognitionRef.current?.stop(), [])

  useEffect(() => {
    const root = candidateListRef.current
    if (!root || !showMore || !hasMorePlaces || isFetchingMorePlaces) return
    const sentinel = root.querySelector('[data-next-page]')
    if (!sentinel) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMorePlaces && !isFetchingMorePlaces) {
        void fetchMorePlaces()
      }
    }, { root, rootMargin: '24px' })
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [fetchMorePlaces, hasMorePlaces, isFetchingMorePlaces, showMore, availablePlaces.length])

  const openPicker = (position: Position) => {
    setPicker(position)
    setSearchText('')
    setSubmittedSearch('')
    setShowMore(false)
    setVoiceMessage('')
  }

  const closePicker = () => {
    recognitionRef.current?.stop()
    recognitionRef.current = undefined
    setListening(false)
    setPicker(undefined)
    setShowMore(false)
  }

  const startVoiceSearch = () => {
    const Constructor = speechRecognitionConstructor()
    if (!Constructor) {
      setVoiceMessage('이 브라우저는 음성 검색을 지원하지 않아요. 검색어를 입력해주세요.')
      return
    }
    try {
      const recognition = new Constructor()
      recognition.lang = 'ko-KR'
      recognition.interimResults = false
      recognition.maxAlternatives = 1
      recognition.onresult = (event) => {
        const text = event.results[0]?.[0]?.transcript.trim()
        if (!text) {
          setVoiceMessage('장소 이름을 듣지 못했어요. 다시 말하거나 입력해주세요.')
          return
        }
        setSearchText(text)
        setSubmittedSearch(text)
        setVoiceMessage(`“${text}” 장소를 찾고 있어요.`)
      }
      recognition.onerror = () => setVoiceMessage('음성 입력을 완료하지 못했어요. 검색어를 입력해주세요.')
      recognition.onend = () => {
        setListening(false)
        recognitionRef.current = undefined
      }
      recognitionRef.current = recognition
      setListening(true)
      setVoiceMessage('장소 이름을 말씀해주세요.')
      recognition.start()
    } catch {
      setListening(false)
      setVoiceMessage('음성 입력을 시작하지 못했어요. 검색어를 입력해주세요.')
    }
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

  const speechSupported = Boolean(speechRecognitionConstructor())

  return <>
    <S.EditorHeading>
      <div><p>{canEdit ? '날짜 안에서 순서를 바꾸고 장소를 추가·삭제할 수 있어요.' : isConfirmed ? '확정된 일정입니다.' : '리더만 일정을 수정할 수 있어요.'}</p></div>
      {canEdit ? draft ? <S.ButtonRow>
        <Button type="button" $variant="secondary" disabled={saveMutation.isPending} onClick={cancel}>취소</Button>
        <Button type="button" disabled={!changed || saveMutation.isPending || !draft.every((day) => /^\d{4}-\d{2}-\d{2}$/.test(day.date) && day.slots.length <= 50)} onClick={() => void save()}>
          {saveMutation.isPending ? '저장 중…' : '일정 저장'}
        </Button>
      </S.ButtonRow> : <Button type="button" onClick={() => {
        setDraft(copyScheduleDays(schedule.days))
        setFeedback('')
      }}>일정 편집</Button> : null}
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
              }}>{swapSource && !isSwapSource ? '이 카드와 바꾸기' : isSwapSource ? '교환 취소' : '바꾸기'}</S.SwapButton>
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
    {picker && draft ? <S.Picker aria-label="일정 장소 선택">
      <h3>{selectedDay?.date ? `${formatDate(selectedDay.date)} 장소 고르기` : '장소 고르기'}</h3>
      <S.PickerForm onSubmit={(event) => {
        event.preventDefault()
        const next = searchText.trim()
        if (next === submittedSearch) void candidatesQuery.refetch()
        else setSubmittedSearch(next)
      }}>
        <Input aria-label="장소 이름 검색" value={searchText} onChange={(event) => setSearchText(event.target.value)} placeholder="장소 이름을 입력하세요" />
        <Button type="submit" $variant="secondary" disabled={candidatesQuery.isFetching}>검색</Button>
        <Button type="button" $variant="secondary" aria-pressed={listening} disabled={!speechSupported || listening} onClick={startVoiceSearch}>음성으로 검색</Button>
      </S.PickerForm>
      {voiceMessage ? <S.EditorFeedback role="status">{voiceMessage}</S.EditorFeedback> : null}
      <S.PickerActions>
        {!showMore ? <Button type="button" $variant="secondary" disabled={!categories.length} onClick={() => setShowMore(true)}>장소 더 보기</Button> : <>
          {categories.length ? <Select aria-label="추가 장소 분류" value={category} onChange={(event) => setMoreCategory(event.target.value)}>
            {categories.map((value) => <option key={value} value={value}>{candidates.find((place) => place.category === value)?.categoryLabel || value}</option>)}
          </Select> : null}
          <Button type="button" $variant="secondary" onClick={() => setShowMore(false)}>더 보기 닫기</Button>
        </>}
        <Button type="button" $variant="secondary" onClick={closePicker}>닫기</Button>
      </S.PickerActions>
      {candidatesQuery.isLoading ? <p role="status" aria-busy="true">장소 후보를 불러오는 중이에요.</p> : candidatesQuery.isError ? <S.EditorFeedback $error role="alert">장소를 찾지 못했어요. 다시 검색해주세요.</S.EditorFeedback> : null}
      {showMore && moreQuery.isLoading ? <p role="status" aria-busy="true">장소를 더 불러오는 중이에요.</p> : null}
      {showMore && moreQuery.isError ? <S.EditorFeedback $error role="alert">추가 장소를 불러오지 못했어요. 다시 시도해주세요.</S.EditorFeedback> : null}
      <S.CandidateList ref={candidateListRef} aria-label="장소 검색 결과">
        {availablePlaces.map((place) => <S.CandidateButton key={place.tourPlaceId} type="button" disabled={saveMutation.isPending} onClick={() => choosePlace(place)}>
          <span><strong>{place.name}</strong><small>{[place.categoryLabel || place.category, place.address].filter(Boolean).join(' · ')}</small></span><b aria-hidden="true">추가</b>
        </S.CandidateButton>)}
        {!candidatesQuery.isLoading && !moreQuery.isLoading && availablePlaces.length === 0 ? <p>추가할 수 있는 장소가 없습니다.</p> : null}
        {showMore && moreQuery.hasNextPage ? <div data-next-page>
          {isFetchingMorePlaces ? <p role="status" aria-busy="true">장소를 더 불러오는 중이에요.</p> : <Button type="button" $variant="secondary" onClick={() => void fetchMorePlaces()}>다음 장소 불러오기</Button>}
        </div> : null}
        {showMore && moreQuery.data && !moreQuery.hasNextPage ? <p role="status">더 불러올 장소가 없습니다.</p> : null}
      </S.CandidateList>
    </S.Picker> : null}
    {feedback ? <S.EditorFeedback role={feedbackError ? 'alert' : 'status'} $error={feedbackError}>{feedback}</S.EditorFeedback> : null}
  </>
}
