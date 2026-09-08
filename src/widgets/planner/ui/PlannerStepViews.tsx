import type { CountryInfoResponseDto } from '@/entities/travel'
import { Button as PartTripButton, Input as PartTripInput } from '@/shared/ui/parttrip'
import { formatDate, formatTripDuration } from '@/shared/utils'

import { type usePlannerFlow } from '../model/usePlannerFlow'
import { normalizeStatus } from '../model/status'
import { PlannerProgressManagementPanel } from './PlannerProgressManagementPanel'
import * as S from './PlannerPage.styles'

type Flow = ReturnType<typeof usePlannerFlow>
type Destination = CountryInfoResponseDto
type VoteOption = Flow['votes'][number]['options'][number]

type DestinationProps = Pick<
  Flow,
  | 'handleDestinationSelect'
  | 'saveDestination'
  | 'selectedCityName'
  | 'selectedCountryInfoId'
  | 'selectedCountryName'
  | 'selectedEndDate'
  | 'selectedHeadcount'
  | 'selectedStartDate'
  | 'setCityName'
  | 'setEndDate'
  | 'setHeadcount'
  | 'setStartDate'
> & {
  calendarDays: Array<number | null>
  calendarMonth: Date
  destinationResults: Destination[]
  handleCalendarDay: (day: number) => void
  isDestinationSearch: boolean
  isSaving: boolean
  setCalendarMonthOverride: (month: Date) => void
  travelStyle: string
  setTravelStyle: (style: string) => void
}

export function PlannerDestinationStep({
  calendarDays,
  calendarMonth,
  destinationResults,
  handleCalendarDay,
  handleDestinationSelect,
  isDestinationSearch,
  isSaving,
  saveDestination,
  selectedCityName,
  selectedCountryInfoId,
  selectedCountryName,
  selectedEndDate,
  selectedHeadcount,
  selectedStartDate,
  setCalendarMonthOverride,
  setCityName,
  setEndDate,
  setHeadcount,
  setStartDate,
  setTravelStyle,
  travelStyle,
}: DestinationProps) {
  return (
    <>
      <S.SettingsLayout>
        <S.StepCard
          as="form"
          autoComplete="off"
          id="planner-destination-form"
          onSubmit={(event) => void saveDestination(event)}
        >
          <S.SectionTitle>여행 조건</S.SectionTitle>
          <S.StepField>
            <label htmlFor="planner-departure">출발 국가</label>
            <PartTripInput id="planner-departure" value="대한민국" readOnly />
          </S.StepField>
          <S.StepField>
            <label htmlFor="planner-city">여행지</label>
            <PartTripInput
              id="planner-city"
              autoComplete="off"
              aria-autocomplete="list"
              value={selectedCityName}
              onChange={(event) => setCityName(event.target.value)}
              placeholder="도시 또는 국가를 입력하세요"
            />
            <S.FieldHint>
              국가명 또는 도시명으로 검색할 수 있어요. 한글·영문 모두 지원합니다.
            </S.FieldHint>
          </S.StepField>
          <S.StepField>
            <span id="planner-destination-results-label">
              {isDestinationSearch ? '검색 결과' : '인기 여행지'}
            </span>
            <S.PopularGrid role="group" aria-labelledby="planner-destination-results-label">
              {destinationResults.map((country) => (
                <S.PopularButton
                  type="button"
                  key={country.countryInfoId ?? `${country.countryName}-${country.cityName}`}
                  $active={
                    String(country.countryInfoId) === selectedCountryInfoId ||
                    (country.countryName === selectedCountryName && country.cityName === selectedCityName)
                  }
                  onClick={() => handleDestinationSelect(country)}
                >
                  <strong>{country.cityName || country.countryName}</strong>
                  <span>{country.cityName ? country.countryName : '국가'}</span>
                </S.PopularButton>
              ))}
            </S.PopularGrid>
            {isDestinationSearch && selectedCityName && destinationResults.length === 0 ? (
              <S.SearchEmpty>
                검색 결과가 없습니다. 국가명 또는 도시명을 다시 입력해주세요.
              </S.SearchEmpty>
            ) : null}
          </S.StepField>
          <S.StepField>
            <span id="planner-date-range-label">여행 기간</span>
            <S.DateRange role="group" aria-labelledby="planner-date-range-label">
              <PartTripInput
                aria-label="출발일"
                type="date"
                value={selectedStartDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
              <span>–</span>
              <PartTripInput
                aria-label="도착일"
                type="date"
                value={selectedEndDate}
                onChange={(event) => setEndDate(event.target.value)}
              />
            </S.DateRange>
          </S.StepField>
          <S.StepField>
            <label htmlFor="planner-headcount">인원</label>
            <S.Stepper>
              <span>{selectedHeadcount}</span>
              <button
                type="button"
                aria-label="인원 줄이기"
                onClick={() => setHeadcount(String(Math.max(1, Number(selectedHeadcount) - 1)))}
              >
                −
              </button>
              <button
                type="button"
                aria-label="인원 늘리기"
                onClick={() => setHeadcount(String(Math.min(30, Number(selectedHeadcount) + 1)))}
              >
                +
              </button>
            </S.Stepper>
          </S.StepField>
          <S.StepField>
            <span id="planner-travel-style-label">여행 스타일</span>
            <S.ChipRow role="group" aria-labelledby="planner-travel-style-label">
              {['휴양', '맛집', '액티비티', '문화'].map((style) => (
                <S.StyleChip
                  key={style}
                  type="button"
                  $active={travelStyle === style}
                  onClick={() => setTravelStyle(style)}
                >
                  {style}
                </S.StyleChip>
              ))}
            </S.ChipRow>
          </S.StepField>
        </S.StepCard>
        <S.CalendarPanel>
          <S.SectionTitle>여행 기간</S.SectionTitle>
          <S.CalendarHeader>
            <strong>
              {calendarMonth.getFullYear()}년 {calendarMonth.getMonth() + 1}월
            </strong>
            <span>
              <button
                type="button"
                aria-label="이전 달"
                onClick={() => setCalendarMonthOverride(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="다음 달"
                onClick={() => setCalendarMonthOverride(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
              >
                ›
              </button>
            </span>
          </S.CalendarHeader>
          <S.Weekdays>
            {['일', '월', '화', '수', '목', '금', '토'].map((day) => <span key={day}>{day}</span>)}
          </S.Weekdays>
          <S.CalendarGrid>
            {calendarDays.map((day, index) => {
              const date = day == null
                ? ''
                : `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              return day ? (
                <S.CalendarDay
                  key={day}
                  type="button"
                  $selected={date === selectedStartDate || date === selectedEndDate}
                  $range={Boolean(selectedStartDate && selectedEndDate && date > selectedStartDate && date < selectedEndDate)}
                  onClick={() => handleCalendarDay(day)}
                >
                  {day}
                </S.CalendarDay>
              ) : <span key={`empty-${index}`} />
            })}
          </S.CalendarGrid>
          <S.CalendarSummary>
            <strong>
              {selectedStartDate && selectedEndDate
                ? `${formatDate(selectedStartDate)} – ${formatDate(selectedEndDate)}`
                : '날짜를 선택하세요'}
            </strong>
            {selectedStartDate && selectedEndDate ? <span>{formatTripDuration(selectedStartDate, selectedEndDate)}</span> : null}
          </S.CalendarSummary>
        </S.CalendarPanel>
      </S.SettingsLayout>
      <S.FullWidthAction type="submit" form="planner-destination-form" disabled={isSaving}>
        {isSaving ? '저장 중' : '다음'}
      </S.FullWidthAction>
    </>
  )
}

type ExploreProps = Pick<
  Flow,
  | 'canManageCandidates'
  | 'handleSaveCandidates'
  | 'places'
  | 'selected'
  | 'selectedPlaceCount'
  | 'setSelected'
  | 'setVoteCategory'
  | 'voteCategory'
  | 'plannerCategories'
> & {
  isSavingCandidates: boolean
}

export function PlannerExploreStep({
  canManageCandidates,
  handleSaveCandidates,
  isSavingCandidates,
  places,
  plannerCategories: categories,
  selected,
  selectedPlaceCount,
  setSelected,
  setVoteCategory,
  voteCategory,
}: ExploreProps) {
  return (
    <>
      <S.CategoryChips aria-label="장소 카테고리">
        {categories.map((category) => (
          <S.CategoryChip
            key={category}
            type="button"
            className={voteCategory === category ? 'active' : ''}
            $active={voteCategory === category}
            onClick={() => setVoteCategory(category)}
          >
            {category}
          </S.CategoryChip>
        ))}
      </S.CategoryChips>
      <S.PlaceBody>
        <S.PlaceListPanel>
          <S.PlaceListHeader>
            <span>선택한 장소 {selectedPlaceCount}</span>
            <button type="button" disabled={!canManageCandidates} onClick={() => setSelected(places.map((_, index) => index))}>
              전체 후보 담기
            </button>
          </S.PlaceListHeader>
          {places.map((item, index) => {
            const isSelected = selected.includes(index)
            return (
              <S.PlaceRow key={index} $active={isSelected}>
                <S.PlaceThumb $imageUrl={item.imageUrl}>{!item.imageUrl ? '이미지 없음' : null}</S.PlaceThumb>
                <S.PlaceDetails>
                  <strong>{item.placeName || '장소'}</strong>
                  <span>{item.category || voteCategory} · {item.address || '장소 정보'}</span>
                </S.PlaceDetails>
                <S.PlaceAction
                  type="button"
                  $active={isSelected}
                  aria-pressed={isSelected}
                  disabled={!canManageCandidates}
                  onClick={() => setSelected((current) => isSelected ? current.filter((value) => value !== index) : [...current, index])}
                >
                  <span>{isSelected ? '후보 담김' : '담기'}</span>
                  <b aria-hidden="true">{isSelected ? '✓' : '+'}</b>
                </S.PlaceAction>
              </S.PlaceRow>
            )
          })}
          {places.length === 0 ? <S.Empty>연동된 장소 후보가 없습니다.</S.Empty> : null}
        </S.PlaceListPanel>
        <S.PanelActions>
          <PartTripButton
            type="button"
            disabled={isSavingCandidates || !canManageCandidates || selectedPlaceCount === 0}
            onClick={() => void handleSaveCandidates()}
          >
            {isSavingCandidates ? '후보 저장 중' : '투표 시작하기'}
          </PartTripButton>
        </S.PanelActions>
      </S.PlaceBody>
    </>
  )
}

type VoteProps = Pick<
  Flow,
  | 'activeVote'
  | 'canCloseVotes'
  | 'canManagePlanner'
  | 'handleCastBallot'
  | 'handleCloseVote'
  | 'handleDeleteVoteOption'
  | 'setVoteCategory'
  | 'voteCategory'
  | 'plannerCategories'
> & {
  castBallotPending: boolean
  closeVotePending: boolean
  deleteVoteOptionPending: boolean
  nextCategory: Flow['voteCategory']
  onNextCategory: () => void
  profileId?: string
  selectedOptionId?: number
  voteOptions: VoteOption[]
}

export function PlannerVoteStep({
  activeVote,
  canCloseVotes,
  canManagePlanner,
  castBallotPending,
  closeVotePending,
  deleteVoteOptionPending,
  handleCastBallot,
  handleCloseVote,
  handleDeleteVoteOption,
  nextCategory,
  onNextCategory,
  plannerCategories: categories,
  profileId,
  selectedOptionId,
  setVoteCategory,
  voteCategory,
  voteOptions,
}: VoteProps) {
  const canVote = normalizeStatus(activeVote?.status) === 'OPEN' && activeVote?.deadlinePassed !== true

  return (
    <>
      <S.VoteStatusRow>
        <S.VoteStatus $active>진행 중</S.VoteStatus>
        <S.VoteStatus>내 투표 {voteOptions.some((option) => option.selectedByMe === true) ? 1 : 0} / 1</S.VoteStatus>
      </S.VoteStatusRow>
      <S.VoteCategoryChips aria-label="투표 카테고리">
        {categories.map((category) => (
          <S.CategoryChip
            key={category}
            type="button"
            className={voteCategory === category ? 'active' : ''}
            $active={voteCategory === category}
            onClick={() => setVoteCategory(category)}
          >
            {category}
          </S.CategoryChip>
        ))}
      </S.VoteCategoryChips>
      <S.VoteBody>
        <S.CandidatePanel>
          {activeVote && !canVote ? (
            <S.Notice>
              이 투표는 {activeVote.deadlinePassed === true ? '마감' : normalizeStatus(activeVote.status) === 'CONFIRMED' ? '확정' : '마감'}되어 참여할 수 없습니다.
            </S.Notice>
          ) : null}
          {voteOptions.map((option, index) => {
            const isSelected = selectedOptionId === option.optionId || option.selectedByMe === true
            return (
              <S.CandidateRow key={option.optionId ?? index} $selected={isSelected}>
                <S.PlaceDetails>
                  <strong>{option.placeName || '장소'}</strong>
                  <span>{option.voteCount ?? 0}표</span>
                  {(canManagePlanner || (profileId != null && option.addedByUserId === profileId)) && normalizeStatus(activeVote?.status) === 'OPEN' ? (
                    <S.DeleteOptionButton
                      type="button"
                      disabled={deleteVoteOptionPending || option.optionId == null}
                      onClick={() => {
                        if (window.confirm('이 후보를 삭제할까요?')) void handleDeleteVoteOption(option.optionId)
                      }}
                    >
                      후보 삭제
                    </S.DeleteOptionButton>
                  ) : null}
                </S.PlaceDetails>
                <S.VoteMeta $selected={isSelected}>
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    disabled={!canVote || castBallotPending || option.optionId == null}
                    onClick={() => void handleCastBallot(option.optionId)}
                  >
                    {isSelected ? '투표 완료' : '투표'}
                  </button>
                </S.VoteMeta>
              </S.CandidateRow>
            )
          })}
          {!activeVote || voteOptions.length === 0 ? <S.Empty>아직 등록된 후보가 없습니다.</S.Empty> : null}
        </S.CandidatePanel>
        <S.PanelActions>
          <PartTripButton type="button" onClick={onNextCategory}>다음: {nextCategory}</PartTripButton>
          <PartTripButton
            type="button"
            $variant="secondary"
            disabled={!canCloseVotes || !canManagePlanner || closeVotePending}
            onClick={() => void handleCloseVote()}
          >
            {closeVotePending ? '투표 종료 중' : canCloseVotes ? '투표 종료하기' : '모든 카테고리 투표 후 종료'}
          </PartTripButton>
        </S.PanelActions>
      </S.VoteBody>
    </>
  )
}

type LineupProps = Pick<
  Flow,
  | 'handleRandomLineup'
  | 'handleRemoveFromLineup'
  | 'handleSaveCandidates'
  | 'lineupChoice'
  | 'lineupMode'
  | 'selectedPlaces'
  | 'setLineupChoice'
  | 'setLineupMode'
  | 'setSelected'
  | 'voteCategory'
> & {
  isSavingCandidates: boolean
}

export function PlannerLineupStep({
  handleRandomLineup,
  handleRemoveFromLineup,
  handleSaveCandidates,
  isSavingCandidates,
  lineupChoice,
  lineupMode,
  selectedPlaces,
  setLineupChoice,
  setLineupMode,
  setSelected,
  voteCategory,
}: LineupProps) {
  return (
    <>
      <S.LineupModeRow aria-label="장소 선택 방식">
        <S.SegmentButton
          type="button"
          disabled={selectedPlaces.length === 0}
          data-active={lineupMode === 'direct'}
          $active={lineupMode === 'direct'}
          onClick={() => {
            setLineupMode('direct')
            const first = selectedPlaces[0]?.index
            if (first != null) {
              setLineupChoice(first)
              setSelected([first])
            }
          }}
        >
          직접 선택
        </S.SegmentButton>
        <S.SegmentButton
          type="button"
          disabled={selectedPlaces.length === 0 || isSavingCandidates}
          data-active={lineupMode === 'random'}
          $active={lineupMode === 'random'}
          onClick={() => void handleRandomLineup()}
        >
          랜덤 뽑기
        </S.SegmentButton>
      </S.LineupModeRow>
      <S.CartBody>
        <S.SelectedPanel>
          <S.SectionTitle>담은 장소 {selectedPlaces.length}</S.SectionTitle>
          <S.SelectedPlaces>
            {selectedPlaces.map(({ index, item }) => (
              <S.SelectedPlaceRow key={`${item.placeName}-${index}`}>
                <S.PlaceDetails>
                  <strong>{item.placeName || '장소'}</strong>
                  <span>{voteCategory}</span>
                </S.PlaceDetails>
                <button type="button" aria-label={`${item.placeName || '장소'} 후보 제거`} onClick={() => handleRemoveFromLineup(index)}>
                  {lineupChoice === index ? '✓' : '✕'}
                </button>
              </S.SelectedPlaceRow>
            ))}
          </S.SelectedPlaces>
          {selectedPlaces.length === 0 ? <S.Empty>투표 화면에서 장소를 선택하세요.</S.Empty> : null}
        </S.SelectedPanel>
        <S.NextPanel>
          <S.SectionTitle>선택을 확정할까요?</S.SectionTitle>
          <p>담은 장소 중 지금 고른 장소로 일정을 확정해요</p>
          <S.ActionRow>
            <PartTripButton
              type="button"
              disabled={isSavingCandidates || selectedPlaces.length === 0}
              onClick={() => void handleSaveCandidates()}
            >
              선택 확정하기
            </PartTripButton>
          </S.ActionRow>
        </S.NextPanel>
      </S.CartBody>
    </>
  )
}

type ProgressProps = Pick<
  Flow,
  | 'canCloseVotes'
  | 'canManageCandidates'
  | 'canManagePlanner'
  | 'handleCloseVote'
  | 'handleConfirmPlan'
  | 'handleConfirmVote'
  | 'handleDeletePlanner'
  | 'handleRemindMembers'
  | 'isRemindAvailable'
  | 'members'
  | 'plannerDetail'
  | 'plannerInviteLink'
  | 'votes'
  | 'plannerCategories'
> & {
  closeVotePending: boolean
  confirmPlannerPending: boolean
  confirmVotePending: boolean
  currentUserInitial: string
  currentUserName: string
  deletePlannerPending: boolean
  hasOpenVote: boolean
  inviteLinkError: string
  inviteLinkFeedback: string
  isConfirmed: boolean
  onCopyInviteLink: () => void
  onOpenExplore: () => void
  onOpenFinal: () => void
  onOpenGroupManagement: () => void
  remindFeedback: string
  remindPending: boolean
  confirmedCount: number
  votingCount: number
}

export function PlannerProgressStep({
  canCloseVotes,
  canManageCandidates,
  canManagePlanner,
  closeVotePending,
  confirmPlannerPending,
  confirmVotePending,
  currentUserInitial,
  currentUserName,
  deletePlannerPending,
  handleCloseVote,
  handleConfirmPlan,
  handleConfirmVote,
  handleDeletePlanner,
  handleRemindMembers,
  hasOpenVote,
  inviteLinkError,
  inviteLinkFeedback,
  isConfirmed,
  isRemindAvailable,
  members,
  onCopyInviteLink,
  onOpenExplore,
  onOpenFinal,
  onOpenGroupManagement,
  plannerDetail,
  plannerInviteLink,
  plannerCategories: categories,
  remindFeedback,
  remindPending,
  votes,
  confirmedCount,
  votingCount,
}: ProgressProps) {
  return (
    <>
      <S.ProgressStats>
        <S.ProgressStat><strong>{confirmedCount}</strong><span>확정</span></S.ProgressStat>
        <S.ProgressStat><strong>{votingCount}</strong><span>투표 중</span></S.ProgressStat>
        <S.ProgressStat><strong>{Math.max(0, categories.length - votes.length)}</strong><span>미정</span></S.ProgressStat>
      </S.ProgressStats>
      <S.ProgressBody>
        <S.CategoryStatusPanel>
          <S.SectionTitle>카테고리별 현황</S.SectionTitle>
          {categories.map((category) => {
            const vote = votes.find((item) => item.categoryLabel === category || item.category === category)
            const status = normalizeStatus(vote?.status)
            const confirmed = vote?.confirmedOptionId != null || status === 'CONFIRMED'
            const closed = status === 'CLOSED'
            const confirmedPlace = vote?.options?.find((option) => option.optionId === vote.confirmedOptionId || option.confirmed)?.placeName
            return (
              <S.StatusLine key={category}>
                <span>{category}</span>
                <strong>{confirmed ? confirmedPlace || '확정' : closed ? '마감됨' : vote ? `진행 중 · ${vote.votedMemberCount ?? 0}/${vote.eligibleMemberCount ?? 0}` : '후보 없음'}</strong>
              </S.StatusLine>
            )
          })}
        </S.CategoryStatusPanel>
        <S.MemberResponses>
          <S.SectionTitle>멤버 응답</S.SectionTitle>
          {(members.length ? members : [{ nickName: currentUserName, userId: currentUserInitial, role: '완료' }]).map((member, index) => (
            <S.ResponseRow key={member.userId ?? member.nickName ?? index}>
              <S.Avatar>{(member.nickName || member.userId || '멤버').slice(0, 2).toUpperCase()}</S.Avatar>
              <strong>{member.nickName || member.userId || '멤버'}</strong>
              <span>{member.role || '대기 중'}</span>
            </S.ResponseRow>
          ))}
          <S.ActionRow>
            {!isConfirmed ? (
              <PartTripButton type="button" $variant="secondary" disabled={!canManageCandidates} onClick={onOpenExplore}>
                {votes.length ? '후보 장소 관리' : '장소 후보 추가'}
              </PartTripButton>
            ) : null}
            <PartTripButton
              type="button"
              disabled={!hasOpenVote || !canCloseVotes || !canManagePlanner || closeVotePending}
              onClick={() => void handleCloseVote()}
            >
              {closeVotePending ? '마감 중' : hasOpenVote ? canCloseVotes ? '투표 마감하기' : '모든 카테고리 투표 후 마감' : '마감할 투표 없음'}
            </PartTripButton>
            <PartTripButton type="button" $variant="secondary" disabled={!isRemindAvailable || remindPending} onClick={() => void handleRemindMembers()}>
              {remindPending ? '알림 전송 중' : '재촉 알림 보내기'}
            </PartTripButton>
            <PartTripButton
              type="button"
              $variant="secondary"
              disabled={!votes.length || hasOpenVote || !canManagePlanner || confirmPlannerPending}
              onClick={() => void handleConfirmPlan().then((confirmed) => { if (confirmed) onOpenFinal() })}
            >
              일정 확정하기
            </PartTripButton>
            <PartTripButton type="button" $variant="secondary" disabled={!plannerInviteLink} onClick={onCopyInviteLink}>
              초대링크 복사
            </PartTripButton>
            {canManagePlanner ? (
              <S.DeletePlannerButton
                type="button"
                aria-label="현재 플래너 삭제"
                disabled={deletePlannerPending}
                onClick={() => { if (window.confirm('이 플래너를 삭제할까요?')) void handleDeletePlanner(plannerDetail?.plannerId) }}
              >
                {deletePlannerPending ? '삭제 중' : '삭제'}
              </S.DeletePlannerButton>
            ) : null}
          </S.ActionRow>
          {remindFeedback ? <S.ActionFeedback role="status">{remindFeedback}</S.ActionFeedback> : null}
          {inviteLinkFeedback ? <S.ActionFeedback role="status">{inviteLinkFeedback}</S.ActionFeedback> : null}
          {inviteLinkError ? <S.Error role="alert">{inviteLinkError}</S.Error> : null}
        </S.MemberResponses>
      </S.ProgressBody>
      <PlannerProgressManagementPanel
        closedVotes={votes.filter((vote) => normalizeStatus(vote.status) === 'CLOSED')}
        canManagePlanner={canManagePlanner}
        confirmVotePending={confirmVotePending}
        onConfirmVote={handleConfirmVote}
        onOpenGroupManagement={onOpenGroupManagement}
      />
    </>
  )
}
