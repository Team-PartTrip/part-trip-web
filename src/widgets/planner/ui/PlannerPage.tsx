import { useEffect, useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { useCreatePlannerMutation, useCreateVoteMutation, useJoinPlannerMutation } from '@/entities/planner'
import { useCountriesQuery, useDdayQuery, useTourPlacesQuery } from '@/entities/travel'
import { figmaTripPlanning } from '@/shared/assets'
import { paths } from '@/shared/config'
import { useMyTrips } from '@/entities/trip-plan'
import { Button as PartTripButton, Input as PartTripInput, Select as PartTripSelect } from '@/shared/ui/parttrip'
import { AppShell } from '@/widgets/app-shell'

import * as S from './PlannerPage.styles'

export type PlannerStep = 'list' | 'create' | 'group' | 'destination' | 'explore' | 'vote' | 'lineup' | 'progress' | 'final' | 'place'

type Props = { step: PlannerStep }
type PlannerGroupSettings = { isSolo: boolean; memberCount: number }

const PLANNER_GROUP_SETTINGS_KEY = 'parttrip:planner-group-settings'
const ACTIVE_PLANNER_ID_KEY = 'parttrip:active-planner-id'
const plannerCategories = ['명소', '맛집', '카페'] as const

function readPlannerGroupSettings(): PlannerGroupSettings {
  try {
    const stored = JSON.parse(sessionStorage.getItem(PLANNER_GROUP_SETTINGS_KEY) ?? '{}')
    return {
      isSolo: stored.isSolo === true,
      memberCount: typeof stored.memberCount === 'number' ? stored.memberCount : 1,
    }
  } catch {
    return { isSolo: false, memberCount: 1 }
  }
}

function dateLabel(value?: string) { return value?.replaceAll('-', '.') ?? '-' }

function Header({ step }: { step: PlannerStep }) {
  const copy: Record<PlannerStep, [string, string]> = {
    list: ['여행 플래너', '함께 만드는 여행 계획을 관리하세요.'],
    create: ['새 여행 만들기', '여행의 기본 정보를 입력하고 멤버와 함께 계획을 시작하세요.'],
    group: ['여행 그룹 정하기', '함께 여행할 멤버를 확인하세요.'],
    destination: ['여행지 및 기간 정하기', '여행지와 날짜를 정하면 다음 단계로 넘어갑니다.'],
    explore: ['카테고리별 장소 조회', '여행지에서 갈 곳을 찾아 후보로 모아보세요.'],
    vote: ['카테고리별 투표', '멤버가 고른 장소를 확인하세요.'],
    lineup: ['라인업 및 장바구니', '선택한 장소를 일정 후보로 정리하세요.'],
    progress: ['진행 중인 계획 조회', '현재 여행 계획의 진행 상태입니다.'],
    final: ['최종 계획 확인', '확정 전 여행 정보를 마지막으로 확인하세요.'],
    place: ['장소 상세', '후보 장소를 확인하고 투표 목록에 추가하세요.'],
  }
  const [title, subtitle] = copy[step]
  return <S.Header><S.Title>{title}</S.Title><S.Subtitle>{subtitle}</S.Subtitle></S.Header>
}

function usePlannerData(step: PlannerStep) {
  const needsPlan = step !== 'list' && step !== 'create' && step !== 'group'
  const needsPlaces = step === 'explore' || step === 'vote' || step === 'lineup' || step === 'final' || step === 'place'
  const [overriddenPlan, setOverriddenPlan] = useState<ReturnType<typeof useDdayQuery>['data']>()
  const ddayQuery = useDdayQuery(needsPlan)
  const countriesQuery = useCountriesQuery(step === 'destination')
  const plan = overriddenPlan ?? ddayQuery.data
  const placesQuery = useTourPlacesQuery(plan?.countryName, plan?.cityName, undefined, needsPlaces)
  const { trips, isLoading: isTripsLoading } = useMyTrips(step === 'list')

  return {
    countries: countriesQuery.data ?? [],
    isLoading: ddayQuery.isLoading || countriesQuery.isLoading || placesQuery.isLoading || isTripsLoading,
    places: placesQuery.data ?? [],
    plan,
    setPlan: setOverriddenPlan,
    trips,
  }
}

export function PlannerPage() { return <PlannerFlowPage step="list" /> }
export function PlannerCreatePage() { return <PlannerFlowPage step="create" /> }
export function PlannerGroupPage() { return <PlannerFlowPage step="group" /> }
export function PlannerDestinationPage() { return <PlannerFlowPage step="destination" /> }
export function PlannerExplorePage() { return <PlannerFlowPage step="explore" /> }
export function PlannerVotePage() { return <PlannerFlowPage step="vote" /> }
export function PlannerLineupPage() { return <PlannerFlowPage step="lineup" /> }
export function PlannerProgressPage() { return <PlannerFlowPage step="progress" /> }
export function PlannerFinalPage() { return <PlannerFlowPage step="final" /> }
export function PlannerPlacePage() { return <PlannerFlowPage step="place" /> }

function PlannerFlowPage({ step }: Props) {
  const navigate = useNavigate()
  const { placeId } = useParams({ strict: false })
  const savedGroupSettings = readPlannerGroupSettings()
  const { countries, isLoading, places, plan, setPlan, trips } = usePlannerData(step)
  const [selected, setSelected] = useState<number[]>(() => {
    try {
      const saved = sessionStorage.getItem('parttrip:planner-selected')
      const parsed: unknown = saved ? JSON.parse(saved) : []
      return Array.isArray(parsed) && parsed.every((item): item is number => typeof item === 'number') ? parsed : []
    } catch {
      return []
    }
  })
  const [countryInfoId, setCountryInfoId] = useState('')
  const [startDate, setStartDate] = useState(plan?.startDate ?? '')
  const [endDate, setEndDate] = useState(plan?.endDate ?? '')
  const [countryName, setCountryName] = useState(plan?.countryName ?? '')
  const [cityName, setCityName] = useState(plan?.cityName ?? '')
  const [headcount, setHeadcount] = useState(String(plan?.headcount ?? savedGroupSettings.memberCount))
  const [plannerTitle, setPlannerTitle] = useState('나의 여행 계획')
  const [memberCount, setMemberCount] = useState(() => String(readPlannerGroupSettings().memberCount))
  const [isSolo, setIsSolo] = useState(() => readPlannerGroupSettings().isSolo)
  const [inviteCode, setInviteCode] = useState('')
  const [voteCategory, setVoteCategory] = useState<(typeof plannerCategories)[number]>('명소')
  const [lineupChoice, setLineupChoice] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState('')
  const createPlannerMutation = useCreatePlannerMutation()
  const createVoteMutation = useCreateVoteMutation()
  const joinPlannerMutation = useJoinPlannerMutation()
  const isSaving = createPlannerMutation.isPending

  useEffect(() => {
    sessionStorage.setItem('parttrip:planner-selected', JSON.stringify(selected))
  }, [selected])

  const continueTo = (next: string) => navigate({ to: next })
  const currentCountry = countries.find((country) =>
    country.countryName === plan?.countryName && country.cityName === plan?.cityName,
  )
  const selectedCountryInfoId = countryInfoId || String(currentCountry?.countryInfoId ?? '')
  const selectedCountryName = countryName || plan?.countryName || ''
  const selectedCityName = cityName || plan?.cityName || ''
  const selectedStartDate = startDate || plan?.startDate || ''
  const selectedEndDate = endDate || plan?.endDate || ''
  const selectedHeadcount = headcount || String(plan?.headcount ?? 1)
  const selectedPlaces = places.flatMap((item, index) => selected.includes(index) ? [{ index, item }] : [])
  const place = places[Number(placeId)] || places[0]

  const saveDestination = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const selectedCountry = countries.find((item) => String(item.countryInfoId) === selectedCountryInfoId)
    const nextCountry = selectedCountry?.countryName || selectedCountryName.trim()
    const nextCity = selectedCountry?.cityName || selectedCityName.trim()
    const nextHeadcount = Number(selectedHeadcount)
    if (!nextCountry || !nextCity || !selectedStartDate || !selectedEndDate || selectedStartDate > selectedEndDate) {
      setErrorMessage('여행지와 올바른 여행 기간을 입력해주세요.')
      return
    }
    if (!Number.isInteger(nextHeadcount) || nextHeadcount < 1 || nextHeadcount > 30) {
      setErrorMessage('여행 인원은 1명에서 30명 사이로 입력해주세요.')
      return
    }
    try {
      const groupSettings = readPlannerGroupSettings()
      const planner = await createPlannerMutation.mutateAsync({
        cityName: nextCity,
        countryName: nextCountry,
        endDate: selectedEndDate,
        isSolo: groupSettings.isSolo,
        memberCount: groupSettings.isSolo ? 1 : nextHeadcount,
        startDate: selectedStartDate,
        title: plannerTitle.trim() || `${nextCity} 여행 계획`,
      })
      if (planner.plannerId == null) throw new Error('plannerId is missing')
      sessionStorage.setItem(ACTIVE_PLANNER_ID_KEY, String(planner.plannerId))
      setPlan({
        cityName: planner.cityName ?? nextCity,
        countryName: planner.countryName ?? nextCountry,
        endDate: planner.endDate ?? selectedEndDate,
        headcount: planner.memberCount ?? nextHeadcount,
        startDate: planner.startDate ?? selectedStartDate,
      })
      continueTo(paths.plannerProgress)
    } catch {
      setErrorMessage('여행 정보를 저장하지 못했습니다.')
    }
  }

  const saveGroupSettings = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextMemberCount = isSolo ? 1 : Number(memberCount)
    if (!Number.isInteger(nextMemberCount) || nextMemberCount < 1 || nextMemberCount > 30) {
      setErrorMessage('여행 인원은 1명에서 30명 사이로 입력해주세요.')
      return
    }
    sessionStorage.setItem(PLANNER_GROUP_SETTINGS_KEY, JSON.stringify({ isSolo, memberCount: nextMemberCount }))
    setErrorMessage('')
    navigate({ to: paths.plannerDestination })
  }

  const handleJoinPlanner = async () => {
    if (!inviteCode.trim()) {
      setErrorMessage('초대 코드를 입력해주세요.')
      return
    }
    try {
      setErrorMessage('')
      const joined = await joinPlannerMutation.mutateAsync({ inviteCode: inviteCode.trim() })
      if (joined.plannerId == null) throw new Error('plannerId is missing')
      sessionStorage.setItem(ACTIVE_PLANNER_ID_KEY, String(joined.plannerId))
      navigate({ to: paths.plannerProgress })
    } catch {
      setErrorMessage('초대 코드로 여행 그룹에 참여하지 못했습니다.')
    }
  }

  const handleCreateVote = async () => {
    const plannerId = Number(sessionStorage.getItem(ACTIVE_PLANNER_ID_KEY))
    if (!Number.isInteger(plannerId)) {
      setErrorMessage('먼저 여행 계획을 저장해주세요.')
      return
    }
    try {
      setErrorMessage('')
      await createVoteMutation.mutateAsync({ plannerId, payload: { category: voteCategory } })
    } catch {
      setErrorMessage('투표를 만들지 못했습니다.')
    }
  }

  const handleRemoveFromLineup = (index: number) => {
    setSelected((current) => current.filter((item) => item !== index))
    if (lineupChoice === index) setLineupChoice(null)
  }

  const handleRandomLineup = () => {
    if (selectedPlaces.length === 0) {
      setErrorMessage('먼저 장바구니에 장소를 담아주세요.')
      return
    }
    const choice = selectedPlaces[Math.floor(Math.random() * selectedPlaces.length)]
    setLineupChoice(choice.index)
    setErrorMessage('')
  }

  return (
    <AppShell>
      <S.Page>
        <Header step={step} />
        {errorMessage ? <S.Error role="alert">{errorMessage}</S.Error> : null}
        {isLoading && step !== 'destination' ? <S.State aria-busy="true">플래너 정보를 불러오는 중입니다.</S.State> : null}

        {step === 'list' ? <S.CardGrid>{trips.map((trip, index) => <S.TripCard key={trip.tripId ?? index} type="button" onClick={() => navigate({ to: paths.plannerProgress })}><img src={trip.images?.[0] || figmaTripPlanning} alt="" /><strong>{trip.title || '여행 계획'}</strong><span>{dateLabel(trip.startDate)} – {dateLabel(trip.endDate)}</span><small>계획 중</small></S.TripCard>)}<S.AddCard type="button" onClick={() => continueTo(paths.plannerCreate)}>+ 새 여행 만들기</S.AddCard>{!isLoading && trips.length === 0 ? <S.Empty>아직 여행 계획이 없습니다.</S.Empty> : null}</S.CardGrid> : null}

        {step === 'create' ? <S.StepCard><S.StepNumber>01</S.StepNumber><h2>여행을 함께 계획해보세요.</h2><p>기존 여행 정보 설정을 재사용하거나 새로 시작할 수 있습니다.</p><S.ActionRow><PartTripButton type="button" onClick={() => continueTo(paths.plannerGroup)}>그룹 정하기</PartTripButton><PartTripButton type="button" $variant="secondary" onClick={() => continueTo(paths.travelSelect)}>여행지 설정으로 이동</PartTripButton></S.ActionRow></S.StepCard> : null}

        {step === 'group' ? <S.StepCard as="form" onSubmit={saveGroupSettings}><S.StepNumber>02</S.StepNumber><h2>여행 그룹을 정해보세요.</h2><S.MemberList><S.Member>나 <span>현재 사용자</span></S.Member><S.Member><label><input type="checkbox" checked={isSolo} onChange={(event) => setIsSolo(event.target.checked)} /> 혼자 여행</label><span>{isSolo ? '1명' : '그룹 여행'}</span></S.Member></S.MemberList>{!isSolo ? <S.Field><label htmlFor="planner-member-count">여행 인원</label><PartTripInput id="planner-member-count" type="number" min={1} max={30} value={memberCount} onChange={(event) => setMemberCount(event.target.value)} /></S.Field> : null}<S.Field><label htmlFor="planner-invite-code">초대 코드로 참여</label><PartTripInput id="planner-invite-code" value={inviteCode} onChange={(event) => setInviteCode(event.target.value)} maxLength={20} placeholder="초대 코드" /></S.Field><S.ActionRow><PartTripButton type="button" $variant="secondary" onClick={() => navigate({ to: paths.plannerCreate })}>이전</PartTripButton><PartTripButton type="button" $variant="secondary" disabled={joinPlannerMutation.isPending} onClick={() => void handleJoinPlanner()}>{joinPlannerMutation.isPending ? '참여 중' : '초대 코드로 참여'}</PartTripButton><PartTripButton type="submit">다음</PartTripButton></S.ActionRow></S.StepCard> : null}

        {step === 'destination' ? <S.StepCard as="form" onSubmit={(event) => void saveDestination(event)}><S.StepNumber>03</S.StepNumber><S.FormGrid><S.Field><label htmlFor="planner-title">여행 계획 이름</label><PartTripInput id="planner-title" value={plannerTitle} onChange={(event) => setPlannerTitle(event.target.value)} placeholder="예: 도쿄 주말 여행" /></S.Field><S.Field><label htmlFor="planner-country">여행지</label><PartTripSelect id="planner-country" value={selectedCountryInfoId} onChange={(event) => { setCountryInfoId(event.target.value); const item = countries.find((country) => String(country.countryInfoId) === event.target.value); setCountryName(item?.countryName ?? ''); setCityName(item?.cityName ?? '') }}><option value="">여행지를 선택하세요</option>{countries.map((country) => <option key={country.countryInfoId ?? country.countryName} value={country.countryInfoId}>{country.cityName || country.countryName}</option>)}</PartTripSelect></S.Field><S.Field><label htmlFor="planner-city">도시</label><PartTripInput id="planner-city" value={selectedCityName} onChange={(event) => setCityName(event.target.value)} placeholder="도시" /></S.Field><S.Field><label htmlFor="planner-start">시작일</label><PartTripInput id="planner-start" type="date" value={selectedStartDate} onChange={(event) => setStartDate(event.target.value)} /></S.Field><S.Field><label htmlFor="planner-end">종료일</label><PartTripInput id="planner-end" type="date" value={selectedEndDate} onChange={(event) => setEndDate(event.target.value)} /></S.Field><S.Field><label htmlFor="planner-headcount">여행 인원</label><PartTripInput id="planner-headcount" type="number" min={1} max={30} value={selectedHeadcount} onChange={(event) => setHeadcount(event.target.value)} /></S.Field></S.FormGrid><S.ActionRow><PartTripButton type="button" $variant="secondary" onClick={() => navigate({ to: paths.plannerGroup })}>이전</PartTripButton><PartTripButton type="submit" disabled={isSaving}>{isSaving ? '저장 중' : '여행 정보 저장'}</PartTripButton></S.ActionRow></S.StepCard> : null}

        {step === 'explore' ? <S.ExploreGrid>{plannerCategories.map((category) => <S.CategoryCard key={category} type="button" onClick={() => { setVoteCategory(category); setSelected([]); navigate({ to: paths.plannerVote }) }}><strong>{category}</strong><span>후보 장소를 조회하고 선택하기</span><b>›</b></S.CategoryCard>)}</S.ExploreGrid> : null}

        {step === 'vote' ? <S.VoteCard><S.Notice>{voteCategory} 카테고리의 후보를 선택하고 투표를 시작하세요.</S.Notice><S.VoteCategoryRow aria-label="투표 카테고리">{plannerCategories.map((category) => <S.VoteCategoryButton key={category} type="button" $active={voteCategory === category} aria-pressed={voteCategory === category} onClick={() => { setVoteCategory(category); setSelected([]); setLineupChoice(null) }}>{category}</S.VoteCategoryButton>)}</S.VoteCategoryRow>{places.map((placeItem, index) => <S.VoteRow key={`${placeItem.placeName}-${index}`}><div><small>{voteCategory}</small><strong>{placeItem.placeName || '장소'}</strong></div><S.CheckButton type="button" aria-pressed={selected.includes(index)} $selected={selected.includes(index)} onClick={() => { setSelected((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]); setLineupChoice(null) }}>{selected.includes(index) ? '선택됨' : '선택'}</S.CheckButton></S.VoteRow>)}{places.length === 0 ? <S.Empty>연동된 장소 후보가 없습니다.</S.Empty> : null}<S.ActionRow><PartTripButton type="button" $variant="secondary" disabled={createVoteMutation.isPending} onClick={() => void handleCreateVote()}>{createVoteMutation.isPending ? '투표 생성 중' : `${voteCategory} 투표 만들기`}</PartTripButton><PartTripButton type="button" onClick={() => navigate({ to: paths.plannerLineup })}>선택한 장소 정리 ({selected.length})</PartTripButton></S.ActionRow></S.VoteCard> : null}

        {step === 'lineup' ? <S.StepCard><S.StepNumber>05</S.StepNumber><h2>라인업 및 장바구니</h2>{selectedPlaces.length ? <S.SelectedList>{selectedPlaces.map(({ index, item }) => <S.CartItem key={`${item.placeName}-${index}`}><span>{item.placeName || '장소'}</span><span><S.CartChoiceButton type="button" $selected={lineupChoice === index} onClick={() => setLineupChoice(index)}>{lineupChoice === index ? '선택됨' : '직접 선택'}</S.CartChoiceButton><button type="button" onClick={() => handleRemoveFromLineup(index)}>빼기</button></span></S.CartItem>)}</S.SelectedList> : <S.Empty>선택한 장소가 없습니다. 투표 화면에서 장소를 선택하세요.</S.Empty>}{lineupChoice != null ? <S.Notice>이번 여행의 선택 장소: {places[lineupChoice]?.placeName || '장소'}</S.Notice> : null}<S.ActionRow><PartTripButton type="button" $variant="secondary" onClick={() => navigate({ to: paths.plannerVote })}>장소 더 찾기</PartTripButton><PartTripButton type="button" $variant="secondary" onClick={handleRandomLineup}>랜덤으로 정하기</PartTripButton><PartTripButton type="button" onClick={() => navigate({ to: paths.plannerFinal })}>최종 계획 확인</PartTripButton></S.ActionRow></S.StepCard> : null}

        {step === 'progress' ? <S.ProgressLayout><S.StepCard><S.StepNumber>진행 중</S.StepNumber><h2>{plan?.cityName || '여행 계획'} 계획</h2><p>{dateLabel(plan?.startDate)} – {dateLabel(plan?.endDate)}</p><S.ProgressTrack><S.ProgressBar $progress={plan ? 60 : 0} /></S.ProgressTrack><S.StatusPill>여행지 정보 저장 완료</S.StatusPill><S.StatusPill $warning>플래너 투표 API 미연동</S.StatusPill><S.ActionRow><PartTripButton type="button" onClick={() => navigate({ to: paths.plannerExplore })}>장소 찾기</PartTripButton><PartTripButton type="button" $variant="secondary" onClick={() => navigate({ to: paths.plannerFinal })}>최종 계획</PartTripButton></S.ActionRow></S.StepCard><S.SideSummary><h2>해야 할 일</h2><p>장소 후보를 확인하고 투표를 이어가세요.</p><button type="button" onClick={() => navigate({ to: paths.plannerVote })}>투표 화면 열기 ›</button></S.SideSummary></S.ProgressLayout> : null}

        {step === 'final' ? <S.ProgressLayout><S.StepCard><S.StepNumber>확정 전</S.StepNumber><h2>최종 계획 확인</h2><p>{plan ? `${plan.cityName || plan.countryName} · ${dateLabel(plan.startDate)} – ${dateLabel(plan.endDate)}` : '저장된 여행 정보가 없습니다.'}</p><S.Notice>여행 계획 저장 API가 제공되면 이 단계에서 확정 동작을 연결합니다.</S.Notice><S.ActionRow><PartTripButton type="button" onClick={() => navigate({ to: paths.plannerProgress })}>진행 상태로 돌아가기</PartTripButton><PartTripButton type="button" $variant="secondary" onClick={() => navigate({ to: paths.tripCards })}>여행 카드 보기</PartTripButton></S.ActionRow></S.StepCard><S.SideSummary><h2>선택 장소</h2><p>{places.length ? `${places.length}곳의 후보 장소` : '장소 후보 없음'}</p></S.SideSummary></S.ProgressLayout> : null}

        {step === 'place' ? <S.PlaceLayout>{place ? <><S.PlaceImage src={place.imageUrl || figmaTripPlanning} alt="" /><S.StepCard><S.Badge>추천 장소</S.Badge><h2>{place.placeName}</h2><p>{place.description || '장소 설명이 없습니다.'}</p><PartTripButton type="button" onClick={() => navigate({ to: paths.plannerVote })}>투표 후보에 추가</PartTripButton></S.StepCard></> : <S.Empty>장소 정보를 찾을 수 없습니다.</S.Empty>}</S.PlaceLayout> : null}
      </S.Page>
    </AppShell>
  )
}
