import { useEffect, useRef, useState } from 'react'
import {
  usePlannerScheduleCandidatesQuery,
  type PlannerScheduleCandidateDto,
  type PlannerSchedulePlaceDto,
} from '@/entities/planner'
import { useMoreTourPlacesQuery, type TourPlaceResponseDto } from '@/entities/travel'
import { Button, Input, Select } from '@/shared/ui/parttrip'
import { formatDate } from '@/shared/utils'
import type { EditableScheduleDay } from '../model/schedule-edit'
import * as S from './PlannerAiFlow.styles'

export type Position = { dayIndex: number; slotIndex: number }
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

function speechRecognitionConstructor() {
  const browser = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }
  return browser.SpeechRecognition ?? browser.webkitSpeechRecognition
}

export function PlannerPlacePicker({
  canEdit,
  cityName,
  days,
  isPending,
  plannerId,
  position,
  onClose,
  onSelect,
}: {
  canEdit: boolean
  cityName?: string
  days: EditableScheduleDay[]
  isPending: boolean
  plannerId: number
  position: Position
  onClose: () => void
  onSelect: (place: PlannerSchedulePlaceDto) => void
}) {
  const [searchText, setSearchText] = useState('')
  const [submittedSearch, setSubmittedSearch] = useState('')
  const [moreCategory, setMoreCategory] = useState('')
  const [showMore, setShowMore] = useState(false)
  const [voiceMessage, setVoiceMessage] = useState('')
  const [listening, setListening] = useState(false)
  const candidateListRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognitionLike | undefined>(undefined)
  const selectedDay = days[position.dayIndex]
  const candidatesQuery = usePlannerScheduleCandidatesQuery(
    plannerId,
    selectedDay?.date ?? '',
    submittedSearch,
    Boolean(canEdit && selectedDay?.date),
  )
  const candidates = candidatesQuery.data ?? []
  const categories = [...new Set(candidates.map((place) => place.category).filter((value): value is string => Boolean(value)))]
  const category = categories.includes(moreCategory) ? moreCategory : categories[0] ?? ''
  const moreQuery = useMoreTourPlacesQuery(
    '대한민국',
    cityName ?? '',
    category,
    Boolean(canEdit && showMore && category),
  )
  const fetchMorePlaces = moreQuery.fetchNextPage
  const hasMorePlaces = moreQuery.hasNextPage
  const isFetchingMorePlaces = moreQuery.isFetchingNextPage
  const morePlaces = moreQuery.data?.pages.flatMap((page) => page.places ?? []) ?? []
  const usedPlaceIds = new Set(days.flatMap((day) => day.slots
    .map((slot) => slot.tourPlaceId ?? slot.place?.tourPlaceId)
    .filter((id): id is number => Number.isSafeInteger(id))))
  const selectedPlaceId = currentPlaceId(selectedDay, position.slotIndex)
  if (selectedPlaceId != null) usedPlaceIds.delete(selectedPlaceId)
  const seen = new Set<number>(usedPlaceIds)
  const availablePlaces = [...candidates, ...morePlaces].flatMap((place) => {
    const option = schedulePlace(place)
    if (!option?.tourPlaceId || seen.has(option.tourPlaceId)) return []
    seen.add(option.tourPlaceId)
    return [option]
  })
  const speechSupported = Boolean(speechRecognitionConstructor())

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
  }, [availablePlaces.length, fetchMorePlaces, hasMorePlaces, isFetchingMorePlaces, showMore])

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

  return (
    <S.Picker aria-label="일정 장소 선택">
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
        <Button type="button" $variant="secondary" onClick={onClose}>닫기</Button>
      </S.PickerActions>
      {candidatesQuery.isLoading ? <p role="status" aria-busy="true">장소 후보를 불러오는 중이에요.</p> : candidatesQuery.isError ? <S.EditorFeedback $error role="alert">장소를 찾지 못했어요. 다시 검색해주세요.</S.EditorFeedback> : null}
      {showMore && moreQuery.isLoading ? <p role="status" aria-busy="true">장소를 더 불러오는 중이에요.</p> : null}
      {showMore && moreQuery.isError ? <S.EditorFeedback $error role="alert">추가 장소를 불러오지 못했어요. 다시 시도해주세요.</S.EditorFeedback> : null}
      <S.CandidateList ref={candidateListRef} aria-label="장소 검색 결과">
        {availablePlaces.map((place) => <S.CandidateButton key={place.tourPlaceId} type="button" disabled={isPending} onClick={() => onSelect(place)}>
          <span><strong>{place.name}</strong><small>{[place.categoryLabel || place.category, place.address].filter(Boolean).join(' · ')}</small></span><b aria-hidden="true">추가</b>
        </S.CandidateButton>)}
        {!candidatesQuery.isLoading && !moreQuery.isLoading && availablePlaces.length === 0 ? <p>추가할 수 있는 장소가 없습니다.</p> : null}
        {showMore && hasMorePlaces ? <div data-next-page>
          {isFetchingMorePlaces ? <p role="status" aria-busy="true">장소를 더 불러오는 중이에요.</p> : <Button type="button" $variant="secondary" onClick={() => void fetchMorePlaces()}>다음 장소 불러오기</Button>}
        </div> : null}
        {showMore && moreQuery.data && !moreQuery.hasNextPage ? <p role="status">더 불러올 장소가 없습니다.</p> : null}
      </S.CandidateList>
    </S.Picker>
  )
}
