import { useEffect, useState } from 'react'
import { useNavigate, useParams } from '@tanstack/react-router'
import { saveTravelPlan } from '@/entities/travel/api'
import { useCountriesQuery, useDdayQuery, useTourPlacesQuery } from '@/entities/travel'
import { figmaTripPlanning } from '@/shared/assets'
import { paths } from '@/shared/config'
import { useMyTrips } from '@/entities/trip-plan'
import { Button as PartTripButton, Input as PartTripInput } from '@/shared/ui/parttrip'
import { AppShell } from '@/widgets/app-shell'

import * as S from './PlannerPage.styles'

export type PlannerStep = 'list' | 'create' | 'group' | 'destination' | 'explore' | 'vote' | 'lineup' | 'progress' | 'final' | 'place'

type Props = { step: PlannerStep }

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

function usePlannerData() {
  const [overriddenPlan, setOverriddenPlan] = useState<ReturnType<typeof useDdayQuery>['data']>()
  const ddayQuery = useDdayQuery()
  const countriesQuery = useCountriesQuery()
  const plan = overriddenPlan ?? ddayQuery.data
  const placesQuery = useTourPlacesQuery(plan?.countryName)
  const { trips, isLoading: isTripsLoading } = useMyTrips()

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
  const { countries, isLoading, places, plan, setPlan, trips } = usePlannerData()
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
  const [errorMessage, setErrorMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    sessionStorage.setItem('parttrip:planner-selected', JSON.stringify(selected))
  }, [selected])

  const continueTo = (next: string) => navigate({ to: next as never })
  const selectedPlaces = places.filter((_, index) => selected.includes(index))
  const place = places[Number(placeId)] || places[0]

  const saveDestination = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const selectedCountry = countries.find((item) => String(item.countryInfoId) === countryInfoId)
    const nextCountry = selectedCountry?.countryName || countryName.trim()
    const nextCity = selectedCountry?.cityName || cityName.trim()
    if (!nextCountry || !nextCity || !startDate || !endDate || startDate > endDate) {
      setErrorMessage('여행지와 올바른 여행 기간을 입력해주세요.')
      return
    }
    try {
      setIsSaving(true)
      const nextPlan = await saveTravelPlan({ cityName: nextCity, countryName: nextCountry, endDate, startDate })
      setPlan(nextPlan)
      continueTo(paths.plannerProgress)
    } catch {
      setErrorMessage('여행 정보를 저장하지 못했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AppShell>
      <S.Page>
        <Header step={step} />
        {errorMessage ? <S.Error role="alert">{errorMessage}</S.Error> : null}
        {isLoading && step !== 'destination' ? <S.State aria-busy="true">플래너 정보를 불러오는 중입니다.</S.State> : null}

        {step === 'list' ? <S.CardGrid>{trips.map((trip, index) => <S.TripCard key={trip.tripId ?? index} type="button" onClick={() => navigate({ to: paths.plannerProgress as never })}><img src={trip.images?.[0] || figmaTripPlanning} alt="" /><strong>{trip.title || '여행 계획'}</strong><span>{dateLabel(trip.startDate)} – {dateLabel(trip.endDate)}</span><small>계획 중</small></S.TripCard>)}<S.AddCard type="button" onClick={() => continueTo(paths.plannerCreate)}>+ 새 여행 만들기</S.AddCard>{!isLoading && trips.length === 0 ? <S.Empty>아직 여행 계획이 없습니다.</S.Empty> : null}</S.CardGrid> : null}

        {step === 'create' ? <S.StepCard><S.StepNumber>01</S.StepNumber><h2>여행을 함께 계획해보세요.</h2><p>기존 여행 정보 설정을 재사용하거나 새로 시작할 수 있습니다.</p><S.ActionRow><PartTripButton type="button" onClick={() => continueTo(paths.plannerGroup)}>그룹 정하기</PartTripButton><PartTripButton type="button" $variant="secondary" onClick={() => continueTo(paths.travelSelect)}>여행지 설정으로 이동</PartTripButton></S.ActionRow></S.StepCard> : null}

        {step === 'group' ? <S.StepCard><S.StepNumber>02</S.StepNumber><h2>그룹 멤버를 확인하세요.</h2><S.MemberList><S.Member>나 <span>현재 사용자</span></S.Member><S.Member disabled>멤버 초대 API 미연동 <span>백엔드 계약 필요</span></S.Member></S.MemberList><S.ActionRow><PartTripButton type="button" $variant="secondary" onClick={() => navigate({ to: paths.plannerCreate as never })}>이전</PartTripButton><PartTripButton type="button" onClick={() => navigate({ to: paths.plannerDestination as never })}>다음</PartTripButton></S.ActionRow></S.StepCard> : null}

        {step === 'destination' ? <S.StepCard as="form" onSubmit={(event) => void saveDestination(event)}><S.StepNumber>03</S.StepNumber><S.FormGrid><S.Field><label htmlFor="planner-country">여행지</label><select id="planner-country" value={countryInfoId} onChange={(event) => { setCountryInfoId(event.target.value); const item = countries.find((country) => String(country.countryInfoId) === event.target.value); setCountryName(item?.countryName ?? ''); setCityName(item?.cityName ?? '') }}><option value="">여행지를 선택하세요</option>{countries.map((country) => <option key={country.countryInfoId ?? country.countryName} value={country.countryInfoId}>{country.cityName || country.countryName}</option>)}</select></S.Field><S.Field><label htmlFor="planner-city">도시</label><PartTripInput id="planner-city" value={cityName} onChange={(event) => setCityName(event.target.value)} placeholder="도시" /></S.Field><S.Field><label htmlFor="planner-start">시작일</label><PartTripInput id="planner-start" type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} /></S.Field><S.Field><label htmlFor="planner-end">종료일</label><PartTripInput id="planner-end" type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} /></S.Field></S.FormGrid><S.ActionRow><PartTripButton type="button" $variant="secondary" onClick={() => navigate({ to: paths.plannerGroup as never })}>이전</PartTripButton><PartTripButton type="submit" disabled={isSaving}>{isSaving ? '저장 중' : '여행 정보 저장'}</PartTripButton></S.ActionRow></S.StepCard> : null}

        {step === 'explore' ? <S.ExploreGrid>{['명소', '맛집', '카페'].map((category) => <S.CategoryCard key={category} type="button" onClick={() => navigate({ to: paths.plannerVote as never })}><strong>{category}</strong><span>후보 장소를 조회하고 선택하기</span><b>›</b></S.CategoryCard>)}</S.ExploreGrid> : null}

        {step === 'vote' ? <S.VoteCard><S.Notice>장소 투표 API 계약이 없어 선택 상태만 화면에서 관리됩니다.</S.Notice>{places.map((placeItem, index) => <S.VoteRow key={`${placeItem.placeName}-${index}`}><div><small>후보 장소</small><strong>{placeItem.placeName || '장소'}</strong></div><S.CheckButton type="button" aria-pressed={selected.includes(index)} $selected={selected.includes(index)} onClick={() => setSelected((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index])}>{selected.includes(index) ? '선택됨' : '선택'}</S.CheckButton></S.VoteRow>)}{places.length === 0 ? <S.Empty>연동된 장소 후보가 없습니다.</S.Empty> : null}<S.ActionRow><PartTripButton type="button" onClick={() => navigate({ to: paths.plannerLineup as never })}>선택한 장소 정리 ({selected.length})</PartTripButton></S.ActionRow></S.VoteCard> : null}

        {step === 'lineup' ? <S.StepCard><S.StepNumber>05</S.StepNumber><h2>라인업 및 장바구니</h2>{selectedPlaces.length ? <S.SelectedList>{selectedPlaces.map((item) => <li key={item.placeName}>{item.placeName}</li>)}</S.SelectedList> : <S.Empty>선택한 장소가 없습니다. 투표 화면에서 장소를 선택하세요.</S.Empty>}<S.ActionRow><PartTripButton type="button" $variant="secondary" onClick={() => navigate({ to: paths.plannerVote as never })}>장소 더 찾기</PartTripButton><PartTripButton type="button" onClick={() => navigate({ to: paths.plannerFinal as never })}>최종 계획 확인</PartTripButton></S.ActionRow></S.StepCard> : null}

        {step === 'progress' ? <S.ProgressLayout><S.StepCard><S.StepNumber>진행 중</S.StepNumber><h2>{plan?.cityName || '여행 계획'} 계획</h2><p>{dateLabel(plan?.startDate)} – {dateLabel(plan?.endDate)}</p><S.ProgressTrack><S.ProgressBar $progress={plan ? 60 : 0} /></S.ProgressTrack><S.StatusPill>여행지 정보 저장 완료</S.StatusPill><S.StatusPill $warning>플래너 투표 API 미연동</S.StatusPill><S.ActionRow><PartTripButton type="button" onClick={() => navigate({ to: paths.plannerExplore as never })}>장소 찾기</PartTripButton><PartTripButton type="button" $variant="secondary" onClick={() => navigate({ to: paths.plannerFinal as never })}>최종 계획</PartTripButton></S.ActionRow></S.StepCard><S.SideSummary><h2>해야 할 일</h2><p>장소 후보를 확인하고 투표를 이어가세요.</p><button type="button" onClick={() => navigate({ to: paths.plannerVote as never })}>투표 화면 열기 ›</button></S.SideSummary></S.ProgressLayout> : null}

        {step === 'final' ? <S.ProgressLayout><S.StepCard><S.StepNumber>확정 전</S.StepNumber><h2>최종 계획 확인</h2><p>{plan ? `${plan.cityName || plan.countryName} · ${dateLabel(plan.startDate)} – ${dateLabel(plan.endDate)}` : '저장된 여행 정보가 없습니다.'}</p><S.Notice>여행 계획 저장 API가 제공되면 이 단계에서 확정 동작을 연결합니다.</S.Notice><S.ActionRow><PartTripButton type="button" onClick={() => navigate({ to: paths.plannerProgress as never })}>진행 상태로 돌아가기</PartTripButton><PartTripButton type="button" $variant="secondary" onClick={() => navigate({ to: paths.tripCards as never })}>여행 카드 보기</PartTripButton></S.ActionRow></S.StepCard><S.SideSummary><h2>선택 장소</h2><p>{places.length ? `${places.length}곳의 후보 장소` : '장소 후보 없음'}</p></S.SideSummary></S.ProgressLayout> : null}

        {step === 'place' ? <S.PlaceLayout>{place ? <><S.PlaceImage src={place.imageUrl || figmaTripPlanning} alt="" /><S.StepCard><S.Badge>추천 장소</S.Badge><h2>{place.placeName}</h2><p>{place.description || '장소 설명이 없습니다.'}</p><PartTripButton type="button" onClick={() => navigate({ to: paths.plannerVote as never })}>투표 후보에 추가</PartTripButton></S.StepCard></> : <S.Empty>장소 정보를 찾을 수 없습니다.</S.Empty>}</S.PlaceLayout> : null}
      </S.Page>
    </AppShell>
  )
}
