import { useState } from 'react'
import { useUserProfileQuery } from '@/entities/user'
import { figmaHomeHero, figmaTripPlanning } from '@/shared/assets'
import { paths } from '@/shared/config'
import { Button as PartTripButton, Input as PartTripInput } from '@/shared/ui/parttrip'
import { formatDate } from '@/shared/utils'
import { AppShell } from '@/widgets/app-shell'

import { usePlannerFlow } from '../model/usePlannerFlow'
import type { PlannerStep } from '../model/types'
import * as S from './PlannerPage.styles'

export type { PlannerStep } from '../model/types'

type Props = { step: PlannerStep }
type PlannerTab = 'active' | 'completed'

function dateRange(startDate?: string, endDate?: string) {
  const start = formatDate(startDate)
  const end = formatDate(endDate)
  return start.slice(0, 7) === end.slice(0, 7) ? `${start} – ${end.slice(5)}` : `${start} – ${end}`
}

function statusKey(status?: string): 'active' | 'planned' | 'completed' {
  const value = status?.toLocaleLowerCase() ?? ''
  if (value.includes('완료') || value.includes('complete') || value.includes('done')) return 'completed'
  if (value.includes('진행') || value.includes('active') || value.includes('progress')) return 'active'
  return 'planned'
}

function statusLabel(status?: string) {
  const key = statusKey(status)
  return key === 'completed' ? '완료' : key === 'active' ? '진행 중' : '예정'
}

function Header({ plan, step, voteCategory }: { plan?: { cityName?: string; countryName?: string; startDate?: string; endDate?: string }; step: PlannerStep; voteCategory: string }) {
  const destination = plan?.cityName || plan?.countryName || '오사카'
  const copy: Record<PlannerStep, [string, string]> = {
    list: ['여행 플래너', '함께 만드는 여행 계획을 관리하세요.'],
    create: ['새 여행 만들기', '여행의 기본 정보를 입력하고 멤버와 함께 계획을 시작하세요.'],
    group: ['그룹 만들기', '함께 여행할 친구를 초대하세요.'],
    destination: ['여행 정보 설정', '다음 여행의 목적지와 기간을 설정하면 D-day와 일정이 업데이트됩니다.'],
    explore: ['장소 둘러보기', `${destination} · ${dateRange(plan?.startDate, plan?.endDate)} · 카테고리별로 후보를 담아보세요.`],
    vote: [`${voteCategory} 투표`, '3 / 4명 참여 · 오늘 21:00 마감 · 카테고리별로 후보를 정해요.'],
    lineup: ['선택한 장소', '투표에 담긴 장소를 확인하고 다음 단계로 이동하세요.'],
    progress: [`${destination} 4박 5일 · 투표 진행 중`, '카테고리별 확정 현황과 멤버 응답을 확인하세요.'],
    final: ['최종 확인', '모든 선택을 확인하고 여행 계획을 저장하세요.'],
    place: ['장소 상세', '후보 장소의 정보와 설명을 확인하세요.'],
  }
  const [title, subtitle] = copy[step]
  return <S.Header><div><S.Title>{title}</S.Title><S.Subtitle>{subtitle}</S.Subtitle></div></S.Header>
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
  const { data: profile } = useUserProfileQuery()
  const [plannerTab, setPlannerTab] = useState<PlannerTab>('active')
  const [selectedPlannerId, setSelectedPlannerId] = useState<number>()
  const [travelStyle, setTravelStyle] = useState('맛집')
  const {
    activeVote,
    castBallotMutation,
    closeVoteMutation,
    confirmedPlaces,
    countries,
    continueTo,
    createVoteMutation,
    errorMessage,
    handleCastBallot,
    handleCloseVote,
    handleConfirmPlan,
    handleCreateVote,
    handleJoinPlanner,
    handleRandomLineup,
    handleRemoveFromLineup,
    handleSelectPlanner,
    hasError,
    inviteCode,
    isConfirmed,
    isLoading,
    isSaving,
    isSolo,
    joinPlannerMutation,
    lineupChoice,
    memberCount,
    members,
    navigate,
    place,
    places,
    plan,
    plannerCategories: categories,
    plannerDetail,
    planners,
    saveDestination,
    saveGroupSettings,
    selected,
    selectedCityName,
    selectedCountryInfoId,
    selectedEndDate,
    selectedHeadcount,
    selectedPlaces,
    selectedStartDate,
    setCityName,
    setCountryInfoId,
    setEndDate,
    setHeadcount,
    setInviteCode,
    setIsSolo,
    setLineupChoice,
    setMemberCount,
    setSelected,
    setStartDate,
    setCountryName,
    setVoteCategory,
    voteCategory,
    votes,
  } = usePlannerFlow(step)
  const flowNavigate = navigate

  const availablePlanners = planners.filter((planner) => plannerTab === 'completed' ? statusKey(planner.status) === 'completed' : statusKey(planner.status) !== 'completed')
  const selectedPlanner = planners.find((planner) => planner.plannerId === selectedPlannerId) ?? availablePlanners[0] ?? planners[0]
  const currentUserName = profile?.name || '민수'
  const currentUserInitial = currentUserName.slice(0, 2).toUpperCase() || 'MS'
  const voteOptions = activeVote?.options?.length
    ? activeVote.options.map((option) => ({ address: option.address, optionId: option.optionId, placeName: option.placeName, rating: option.rating, voteCount: option.voteCount }))
    : places.map((item) => ({ address: item.address, optionId: item.tourPlaceId, placeName: item.placeName, rating: item.rating, voteCount: undefined }))
  const confirmedCount = votes.filter((vote) => vote.confirmedOptionId != null || vote.status?.toLocaleLowerCase().includes('confirm') === true).length
  const votingCount = votes.filter((vote) => vote.confirmedOptionId == null && vote.status?.toLocaleLowerCase().includes('complete') !== true).length
  const finalPlaces = confirmedPlaces.length ? confirmedPlaces : selectedPlaces.map(({ item }) => ({ category: item.category, categoryLabel: item.category, placeName: item.placeName, voteCount: undefined }))

  const nextVoteCategory = () => {
    const index = categories.indexOf(voteCategory)
    setVoteCategory(categories[(index + 1) % categories.length])
    setSelected([])
  }

  return (
    <AppShell>
      <S.Page>
        <Header plan={plan} step={step} voteCategory={voteCategory} />
        {errorMessage || hasError ? <S.Error role="alert">{errorMessage || '플래너 정보를 불러오지 못했습니다.'}</S.Error> : null}
        {isLoading && step !== 'destination' ? <S.State aria-busy="true">플래너 정보를 불러오는 중입니다.</S.State> : null}

        {step === 'list' ? (
          <>
            <S.HeaderActions><PartTripButton type="button" onClick={() => continueTo(paths.plannerCreate)}>새 여행</PartTripButton></S.HeaderActions>
            <S.PlannerTabs aria-label="여행 계획 상태"><button type="button" className={plannerTab === 'active' ? 'active' : ''} onClick={() => setPlannerTab('active')}>진행 중 / 예정 여행</button><button type="button" className={plannerTab === 'completed' ? 'active' : ''} onClick={() => setPlannerTab('completed')}>완료</button></S.PlannerTabs>
            <S.PlannerListLayout>
              <S.PlanListPanel>
                <h2>{plannerTab === 'active' ? '진행 중 / 예정 여행' : '완료된 여행'}</h2>
                {availablePlanners.map((planner, index) => <S.PlanRow key={planner.plannerId ?? index} type="button" $selected={selectedPlanner?.plannerId === planner.plannerId} onClick={() => setSelectedPlannerId(planner.plannerId)}><S.PlanMarker $state={statusKey(planner.status)} /><S.PlanDetails><strong>{planner.title || `${planner.cityName || planner.countryName || '여행'} 여행`}</strong><span>{dateRange(planner.startDate, planner.endDate)}</span></S.PlanDetails><S.PlanStatus $state={statusKey(planner.status)}>{statusLabel(planner.status)}</S.PlanStatus></S.PlanRow>)}
                {!isLoading && availablePlanners.length === 0 ? <S.Empty>등록된 여행 계획이 없습니다.</S.Empty> : null}
              </S.PlanListPanel>
              {selectedPlanner ? <S.SelectedPlanPanel><img src={selectedPlanner.status && statusKey(selectedPlanner.status) === 'completed' ? figmaTripPlanning : figmaHomeHero} alt="" /><div><h2>{selectedPlanner.title || `${selectedPlanner.cityName || selectedPlanner.countryName || '여행'} 여행`}</h2><p>멤버 {selectedPlanner.joinedMemberCount ?? selectedPlanner.memberCount ?? '-'}명 · 투표 {confirmedCount || '-'}</p><S.ProgressTrack><S.ProgressBar $progress={selectedPlanner.joinedMemberCount && selectedPlanner.memberCount ? Math.round((selectedPlanner.joinedMemberCount / selectedPlanner.memberCount) * 100) : 40} /></S.ProgressTrack><small>여행 준비 진행률</small><S.MemberAvatars><S.Avatar>MS</S.Avatar><S.Avatar>JH</S.Avatar><S.Avatar>AY</S.Avatar></S.MemberAvatars><PartTripButton type="button" onClick={() => handleSelectPlanner(selectedPlanner.plannerId)}>상세 단계 보기</PartTripButton></div></S.SelectedPlanPanel> : null}
            </S.PlannerListLayout>
          </>
        ) : null}

        {step === 'create' ? <S.StepCard><S.StepNumber>01</S.StepNumber><h2>여행을 함께 계획해보세요.</h2><p>기존 여행 정보 설정을 재사용하거나 새로 시작할 수 있습니다.</p><S.ActionRow><PartTripButton type="button" onClick={() => continueTo(paths.plannerGroup)}>그룹 정하기</PartTripButton><PartTripButton type="button" $variant="secondary" onClick={() => continueTo(paths.travelSelect)}>여행지 설정</PartTripButton></S.ActionRow></S.StepCard> : null}

        {step === 'group' ? <S.TwoColumn><S.StepCard as="form" onSubmit={saveGroupSettings}><S.SectionTitle>여행 유형</S.SectionTitle><S.SegmentRow><S.SegmentButton type="button" $active={isSolo} onClick={() => setIsSolo(true)}>혼자 여행</S.SegmentButton><S.SegmentButton type="button" $active={!isSolo} onClick={() => setIsSolo(false)}>함께 여행</S.SegmentButton></S.SegmentRow><S.StepField><label htmlFor="planner-member-count">인원 수 (본인 포함)</label><S.Stepper><span>{isSolo ? 1 : memberCount}</span><button type="button" aria-label="인원 줄이기" onClick={() => setMemberCount(String(Math.max(1, Number(memberCount) - 1)))} disabled={isSolo}>−</button><button type="button" aria-label="인원 늘리기" onClick={() => setMemberCount(String(Math.min(30, Number(memberCount) + 1)))} disabled={isSolo}>+</button></S.Stepper></S.StepField><S.SectionTitle>참여 멤버</S.SectionTitle><S.MemberList><S.MemberRow><S.Avatar>{currentUserInitial}</S.Avatar><S.MemberDetails><strong>{currentUserName}</strong><span>호스트</span></S.MemberDetails><S.MemberState>호스트</S.MemberState></S.MemberRow>{members.map((member, index) => <S.MemberRow key={`${member.userId ?? member.nickName}-${index}`}><S.Avatar>{(member.nickName || member.userId || '멤버').slice(0, 2).toUpperCase()}</S.Avatar><S.MemberDetails><strong>{member.nickName || member.userId || '멤버'}</strong><span>멤버</span></S.MemberDetails><S.MemberState>{member.role || '참여 중'}</S.MemberState></S.MemberRow>)}{members.length === 0 && inviteCode ? <S.Empty>초대 링크로 참여할 멤버를 기다리고 있습니다.</S.Empty> : null}</S.MemberList><S.ActionRow><PartTripButton type="button" $variant="secondary" onClick={() => navigate({ to: paths.plannerCreate })}>이전</PartTripButton><PartTripButton type="submit">다음</PartTripButton></S.ActionRow></S.StepCard><S.InvitePanel><S.SectionTitle>초대 링크</S.SectionTitle><p>링크를 복사해 친구들에게 공유하세요.</p><S.InviteCode>{inviteCode || '여행 정보 저장 후 초대 링크가 생성됩니다.'}</S.InviteCode><PartTripButton type="button" $variant="secondary" disabled={!inviteCode} onClick={() => void navigator.clipboard?.writeText(inviteCode)}>초대 링크 복사</PartTripButton><S.InviteField><label htmlFor="planner-invite-code">초대 코드로 참여</label><PartTripInput id="planner-invite-code" value={inviteCode} onChange={(event) => setInviteCode(event.target.value)} placeholder="초대 코드" /></S.InviteField><PartTripButton type="button" $variant="ghost" disabled={joinPlannerMutation.isPending} onClick={() => void handleJoinPlanner()}>{joinPlannerMutation.isPending ? '참여 중' : '초대 코드로 참여'}</PartTripButton></S.InvitePanel></S.TwoColumn> : null}

        {step === 'destination' ? <S.SettingsLayout><S.StepCard as="form" onSubmit={(event) => void saveDestination(event)}><S.SectionTitle>여행 기본 정보</S.SectionTitle><S.StepField><label htmlFor="planner-departure">출발 국가</label><PartTripInput id="planner-departure" value="대한민국" readOnly /></S.StepField><S.StepField><label htmlFor="planner-city">여행지</label><PartTripInput id="planner-city" value={selectedCityName} onChange={(event) => setCityName(event.target.value)} placeholder="도시 또는 국가를 입력하세요" /></S.StepField><S.StepField><label>인기 여행지</label><S.PopularGrid>{countries.slice(0, 4).map((country) => <S.PopularButton type="button" key={country.countryInfoId ?? `${country.countryName}-${country.cityName}`} $active={String(country.countryInfoId) === selectedCountryInfoId} onClick={() => { setCountryInfoId(String(country.countryInfoId ?? '')); setCountryName(country.countryName ?? ''); setCityName(country.cityName ?? '') }}><strong>{country.cityName || country.countryName}</strong><span>{country.countryName}</span></S.PopularButton>)}</S.PopularGrid></S.StepField><S.StepField><label>여행 기간</label><S.DateRange><PartTripInput type="date" value={selectedStartDate} onChange={(event) => setStartDate(event.target.value)} /><span>–</span><PartTripInput type="date" value={selectedEndDate} onChange={(event) => setEndDate(event.target.value)} /></S.DateRange></S.StepField><S.StepField><label htmlFor="planner-headcount">인원</label><S.Stepper><span>{selectedHeadcount}</span><button type="button" aria-label="인원 줄이기" onClick={() => setHeadcount(String(Math.max(1, Number(selectedHeadcount) - 1)))}>−</button><button type="button" aria-label="인원 늘리기" onClick={() => setHeadcount(String(Math.min(30, Number(selectedHeadcount) + 1)))}>+</button></S.Stepper></S.StepField><S.StepField><label>여행 스타일</label><S.ChipRow>{['휴양', '맛집', '액티비티', '문화'].map((style) => <S.StyleChip key={style} type="button" $active={travelStyle === style} onClick={() => setTravelStyle(style)}>{style}</S.StyleChip>)}</S.ChipRow></S.StepField><S.ActionRow><PartTripButton type="submit" disabled={isSaving}>{isSaving ? '저장 중' : '후보 저장'}</PartTripButton></S.ActionRow></S.StepCard><S.PreviewPanel><S.SectionTitle>미리보기</S.SectionTitle><S.PreviewCard><img src={figmaHomeHero} alt="" /><div><h2>{selectedCityName || '오사카'}</h2><p>{selectedStartDate && selectedEndDate ? dateRange(selectedStartDate, selectedEndDate) : '여행 기간 미설정'}</p><small>예정 여행 <b>D-3</b></small></div></S.PreviewCard></S.PreviewPanel></S.SettingsLayout> : null}

        {step === 'explore' ? <><S.CategoryChips aria-label="장소 카테고리">{categories.map((category) => <S.CategoryChip key={category} type="button" $active={voteCategory === category} onClick={() => { setVoteCategory(category); setSelected([]) }}>{category}</S.CategoryChip>)}</S.CategoryChips><S.PlaceBody><S.PlaceListPanel><h2>{voteCategory} {places.length}곳</h2>{places.map((item, index) => <S.PlaceRow key={`${item.placeName}-${index}`}><S.PlaceThumb $imageUrl={item.imageUrl} /><S.PlaceDetails><strong>{item.placeName || '장소'}</strong><span>★ {item.rating ?? '-'} · {item.address || '상세 정보'}</span></S.PlaceDetails><S.PlaceAction type="button" $active={selected.includes(index)} onClick={() => setSelected((current) => current.includes(index) ? current.filter((value) => value !== index) : [...current, index])}>{selected.includes(index) ? '✓ 담김' : '담기'}</S.PlaceAction></S.PlaceRow>)}{places.length === 0 ? <S.Empty>연동된 장소 후보가 없습니다.</S.Empty> : null}</S.PlaceListPanel><S.SelectedPanel><h2>선택한 장소 {selected.length}</h2>{selectedPlaces.map(({ index, item }) => <S.SelectedRow key={`${item.placeName}-${index}`}><span>{item.placeName || '장소'}</span><button type="button" aria-label={`${item.placeName || '장소'} 선택 취소`} onClick={() => handleRemoveFromLineup(index)}>×</button></S.SelectedRow>)}{selected.length === 0 ? <S.Empty>장소를 담아보세요.</S.Empty> : null}<S.PanelActions><PartTripButton type="button" disabled={createVoteMutation.isPending || selected.length === 0} onClick={() => void handleCreateVote()}>{createVoteMutation.isPending ? '투표 준비 중' : '투표 시작하기'}</PartTripButton><PartTripButton type="button" $variant="secondary" onClick={() => flowNavigate({ to: paths.plannerExplore })}>장소 더 찾기</PartTripButton></S.PanelActions></S.SelectedPanel></S.PlaceBody></> : null}

        {step === 'vote' ? <><S.CategoryChips aria-label="투표 카테고리">{categories.map((category) => <S.CategoryChip key={category} type="button" $active={voteCategory === category} onClick={() => { setVoteCategory(category); setSelected([]) }}>{category}</S.CategoryChip>)}</S.CategoryChips><S.VoteBody><S.CandidatePanel><h2>{voteCategory} 후보 {voteOptions.length}곳</h2>{voteOptions.map((option, index) => <S.CandidateRow key={`${option.placeName}-${index}`}><S.PlaceThumb /><S.PlaceDetails><strong>{option.placeName || '장소'}</strong><span>{option.address || '상세 정보'}</span></S.PlaceDetails><S.VoteMeta><span>{option.voteCount ?? 0}표</span><button type="button" aria-pressed={selected.includes(index)} disabled={castBallotMutation.isPending} onClick={() => { setSelected([index]); void handleCastBallot(option.optionId) }}>{selected.includes(index) ? '투표함' : '투표'}</button></S.VoteMeta></S.CandidateRow>)}{voteOptions.length === 0 ? <S.Empty>투표 후보가 없습니다.</S.Empty> : null}</S.CandidatePanel><S.VoteSummary><h2>투표 현황</h2><S.Deadline>오늘 21:00 마감<small>마감 후 최다 득표 장소가 자동 확정돼요.</small></S.Deadline><strong>참여 멤버 {activeVote?.votedMemberCount ?? 0} / {activeVote?.eligibleMemberCount ?? 0}</strong><S.MemberAvatars><S.Avatar>MS</S.Avatar><S.Avatar>JH</S.Avatar><S.Avatar>AY</S.Avatar><S.Avatar>SY</S.Avatar></S.MemberAvatars><S.ProgressTrack><S.ProgressBar $progress={activeVote?.eligibleMemberCount ? Math.round(((activeVote.votedMemberCount ?? 0) / activeVote.eligibleMemberCount) * 100) : 0} /></S.ProgressTrack><small>멤버 응답을 기다리는 중</small><S.PanelActions><PartTripButton type="button" onClick={nextVoteCategory}>다음 카테고리</PartTripButton><PartTripButton type="button" $variant="secondary" onClick={() => void handleCreateVote()}>투표 제출</PartTripButton></S.PanelActions></S.VoteSummary></S.VoteBody></> : null}

        {step === 'lineup' ? <S.TwoColumn><S.StepCard><S.SectionTitle>선택한 장소 {selectedPlaces.length}개</S.SectionTitle><S.SelectedPlaces>{selectedPlaces.map(({ index, item }) => <S.SelectedPlaceRow key={`${item.placeName}-${index}`}><S.PlaceMarker /><S.PlaceDetails><strong>{item.placeName || '장소'}</strong><span>{plan?.cityName || plan?.countryName || '오사카'} · {item.category || '장소'}</span></S.PlaceDetails><small>{index + 1} votes</small></S.SelectedPlaceRow>)}</S.SelectedPlaces>{selectedPlaces.length === 0 ? <S.Empty>투표 화면에서 장소를 선택하세요.</S.Empty> : null}</S.StepCard><S.NextPanel><S.SectionTitle>다음 단계</S.SectionTitle><p>선택한 장소를 바탕으로 멤버 투표를 시작합니다.</p><label>선택 방식</label><S.SegmentRow><S.SegmentButton type="button" $active={lineupChoice !== null} onClick={() => setLineupChoice(selectedPlaces[0]?.index ?? null)}>직접 선택</S.SegmentButton><S.SegmentButton type="button" $active={lineupChoice === null} onClick={handleRandomLineup}>랜덤 뽑기</S.SegmentButton></S.SegmentRow><S.Notice>고르기 어렵다면?<br />남은 장소 중에서 하나를 랜덤으로 뽑아 드려요. 소수 인원일 때 사용하세요.</S.Notice><S.ActionRow><PartTripButton type="button" onClick={() => void handleCreateVote()}>투표 진행</PartTripButton><PartTripButton type="button" $variant="secondary" onClick={() => flowNavigate({ to: paths.plannerExplore })}>장소 더 찾기</PartTripButton></S.ActionRow></S.NextPanel></S.TwoColumn> : null}

        {step === 'progress' ? <><S.ProgressStats><S.ProgressStat><strong>{confirmedCount}</strong><span>확정</span></S.ProgressStat><S.ProgressStat><strong>{votingCount}</strong><span>투표 중</span></S.ProgressStat><S.ProgressStat><strong>{Math.max(0, categories.length - votes.length)}</strong><span>미정</span></S.ProgressStat></S.ProgressStats><S.ProgressBody><S.CategoryStatusPanel><S.SectionTitle>카테고리별 현황</S.SectionTitle>{categories.map((category) => { const vote = votes.find((item) => item.category === category || item.categoryLabel === category); const confirmed = vote?.confirmedOptionId != null || vote?.status?.toLocaleLowerCase().includes('confirm') === true; const confirmedPlace = vote?.options?.find((option) => option.optionId === vote.confirmedOptionId)?.placeName; return <S.StatusLine key={category}><span>{category}</span><strong>{confirmed ? confirmedPlace || '확정' : vote ? `투표 중 · ${vote.votedMemberCount ?? 0}/${vote.eligibleMemberCount ?? 0}` : '후보 없음'}</strong><small>{confirmed ? '확정' : vote ? '진행' : '미정'}</small></S.StatusLine> })}</S.CategoryStatusPanel><S.MemberResponses><S.SectionTitle>멤버 응답</S.SectionTitle>{(members.length ? members : [{ nickName: currentUserName, userId: currentUserInitial, role: '완료' }]).map((member, index) => <S.ResponseRow key={`${member.userId ?? member.nickName}-${index}`}><S.Avatar>{(member.nickName || member.userId || '멤버').slice(0, 2).toUpperCase()}</S.Avatar><strong>{member.nickName || member.userId || '멤버'}</strong><span>{member.role || '대기 중'}</span></S.ResponseRow>)}<S.ActionRow><PartTripButton type="button" disabled={closeVoteMutation.isPending} onClick={() => void handleCloseVote()}>{closeVoteMutation.isPending ? '마감 중' : '투표 마감하기'}</PartTripButton><PartTripButton type="button" $variant="secondary">재촉 알림 보내기</PartTripButton></S.ActionRow></S.MemberResponses></S.ProgressBody></> : null}

        {step === 'final' ? <S.FinalBody><S.FinalPlan><S.SectionTitle>확정할 여행</S.SectionTitle><S.FinalTripCard><img src={figmaHomeHero} alt="" /><div><h2>{plannerDetail?.title || plannerDetail?.cityName || plan?.cityName || '오사카'} 여행</h2><p>{dateRange(plannerDetail?.startDate || plan?.startDate, plannerDetail?.endDate || plan?.endDate)}</p><small>확정 예정 <b>D-3</b></small></div></S.FinalTripCard><S.SectionTitle>확정된 일정</S.SectionTitle><S.FinalPlaceList>{finalPlaces.map((item, index) => <S.FinalPlaceRow key={`${item.placeName}-${index}`}><small>{item.categoryLabel || item.category || '장소'}</small><strong>{item.placeName || '장소'}</strong><span>{item.voteCount ?? '-'}표</span></S.FinalPlaceRow>)}{finalPlaces.length === 0 ? <S.Empty>확정된 장소가 없습니다.</S.Empty> : null}</S.FinalPlaceList></S.FinalPlan><S.FinalConfirmPanel><S.SectionTitle>저장 전 확인</S.SectionTitle><p>그룹 멤버에게 확정된 여행 정보가 공유됩니다.</p><S.Badge>{isConfirmed ? 'Saved' : 'Ready to save'}</S.Badge><S.ActionRow><PartTripButton type="button" disabled={!isConfirmed} onClick={() => navigate({ to: paths.main })}>여행 시작하기</PartTripButton><PartTripButton type="button" $variant="secondary" onClick={() => void handleConfirmPlan()} disabled={isConfirmed}>일정 공유하기</PartTripButton></S.ActionRow></S.FinalConfirmPanel></S.FinalBody> : null}

        {step === 'place' ? <S.PlaceDetailLayout>{place ? <><S.PlaceImage src={place.imageUrl || figmaTripPlanning} alt="" /><S.StepCard><S.Badge>추천 장소</S.Badge><h2>{place.placeName}</h2><p>{place.description || '장소 설명이 없습니다.'}</p><PartTripButton type="button" onClick={() => navigate({ to: paths.plannerVote })}>투표 후보에 추가</PartTripButton></S.StepCard></> : <S.Empty>장소 정보를 찾을 수 없습니다.</S.Empty>}</S.PlaceDetailLayout> : null}
      </S.Page>
    </AppShell>
  )
}
