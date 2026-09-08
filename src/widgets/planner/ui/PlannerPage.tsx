import { useState } from "react";
import { useUserProfileQuery } from "@/entities/user";
import { paths } from "@/shared/config";
import {
  Button as PartTripButton,
  Input as PartTripInput,
} from "@/shared/ui/parttrip";
import {
  formatDate,
  formatDateRange,
  formatTripDuration,
  getMonthCalendarDays,
} from "@/shared/utils";
import { AppShell } from "@/widgets/app-shell";

import {
  normalizeStatus,
  plannerStatusKey,
  plannerStatusLabel,
} from "../model/status";
import { usePlannerFlow } from "../model/usePlannerFlow";
import type { PlannerStep } from "../model/types";
import { PlannerHeader, PlannerMemberAvatars } from "./PlannerHeader";
import { PlannerFinalStep } from "./PlannerFinalStep";
import { PlannerGroupManagementPanel } from "./PlannerGroupManagementPanel";
import * as S from "./PlannerPage.styles";
import { PlannerPlaceStep } from "./PlannerPlaceStep";
import { PlannerProgressManagementPanel } from "./PlannerProgressManagementPanel";

export type { PlannerStep } from "../model/types";

type Props = { step: PlannerStep };
type PlannerTab = "active" | "planned" | "completed";

export function PlannerPage() {
  return <PlannerFlowPage step="list" />;
}
export function PlannerGroupPage() {
  return <PlannerFlowPage step="group" />;
}
export function PlannerDestinationPage() {
  return <PlannerFlowPage step="destination" />;
}
export function PlannerExplorePage() {
  return <PlannerFlowPage step="explore" />;
}
export function PlannerVotePage() {
  return <PlannerFlowPage step="vote" />;
}
export function PlannerLineupPage() {
  return <PlannerFlowPage step="lineup" />;
}
export function PlannerProgressPage() {
  return <PlannerFlowPage step="progress" />;
}
export function PlannerFinalPage() {
  return <PlannerFlowPage step="final" />;
}
export function PlannerPlacePage() {
  return <PlannerFlowPage step="place" />;
}

function PlannerFlowPage({ step }: Props) {
  const { data: profile } = useUserProfileQuery();
  const [plannerTab, setPlannerTab] = useState<PlannerTab>("active");
  const [travelStyle, setTravelStyle] = useState("맛집");
  const [isInviteOpen, setIsInviteOpen] = useState(() =>
    typeof window !== "undefined" &&
    Boolean(new URLSearchParams(window.location.search).get("inviteCode")),
  );
  const [inviteLinkFeedback, setInviteLinkFeedback] = useState("");
  const [inviteLinkError, setInviteLinkError] = useState("");
  const [shareError, setShareError] = useState("");
  const {
    addPlannerPlacesMutation,
    activeVote,
    candidateManagementError,
    castBallotMutation,
    canManageCandidates,
    canManagePlanner,
    canCloseVotes,
    closeVoteMutation,
    confirmedPlaces,
    countries,
    popularCities,
    confirmPlannerMutation,
    confirmVoteMutation,
    deletePlannerMutation,
    deleteVoteOptionMutation,
    errorMessage,
    handleAddPlaceCandidate,
    handleAcceptPlannerInvitation,
    handleCastBallot,
    handleCloseVote,
    handleConfirmPlan,
    handleConfirmVote,
    handleDeletePlanner,
    handleDeleteVoteOption,
    handleDestinationSelect,
    handleJoinPlanner,
    handleRemindMembers,
    handleCancelPlannerInvitation,
    handleRemovePlannerMember,
    handleRejectPlannerInvitation,
    handleSaveCandidates,
    handleRandomLineup,
    handleRemoveFromLineup,
    handleSelectPlanner,
    handleStartNewPlanner,
    hasError,
    hasActivePlanner,
    inviteCode,
    invitationError,
    invitationLoading,
    invitations,
    acceptPlannerInvitationMutation,
    rejectPlannerInvitationMutation,
    cancelPlannerInvitationMutation,
    removePlannerMemberMutation,
    isConfirmed,
    isLoading,
    isRemindAvailable,
    isSaving,
    isSolo,
    lineupChoice,
    lineupMode,
    memberCount,
    members,
    navigate,
    joinPlannerMutation,
    place,
    places,
    plan,
    plannerCategories: categories,
    plannerDetail,
    plannerInviteLink,
    planners,
    saveDestination,
    saveGroupSettings,
    selected,
    selectedPlaceCount,
    selectedCountryName,
    selectedCityName,
    selectedCountryInfoId,
    selectedEndDate,
    selectedHeadcount,
    selectedPlaces,
    selectedOptionId,
    selectedStartDate,
    remindFeedback,
    remindPlannerMembersMutation,
    selectRandomPlannerPlaceMutation,
    setCityName,
    setEndDate,
    setInviteCode,
    setHeadcount,
    setIsSolo,
    setLineupChoice,
    setLineupMode,
    setMemberCount,
    setSelected,
    setStartDate,
    setVoteCategory,
    voteCategory,
    votes,
    votesError,
  } = usePlannerFlow(step);
  const flowNavigate = navigate;
  const [calendarMonthOverride, setCalendarMonthOverride] = useState<Date>();
  const calendarMonth =
    calendarMonthOverride ??
    (() => {
      const baseDate = selectedStartDate
        ? new Date(`${selectedStartDate}T00:00:00`)
        : new Date();
      return Number.isNaN(baseDate.getTime())
        ? new Date()
        : new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
    })();
  const calendarDays = getMonthCalendarDays(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth(),
  );

  const availablePlanners = planners.filter(
    (planner) => plannerStatusKey(planner.status) === plannerTab,
  );
  const isDestinationSearch =
    selectedCityName.trim() !== "" &&
    selectedCityName.trim().toLocaleLowerCase() !==
      (plannerDetail?.cityName ?? "").trim().toLocaleLowerCase();
  const destinationKeyword = selectedCityName.trim().toLocaleLowerCase();
  const matchingCountries = countries.filter((country) =>
    [country.countryName, country.cityName].some((value) =>
      value?.trim().toLocaleLowerCase().includes(destinationKeyword),
    ),
  );
  const popularDestinations = popularCities.flatMap((city) => {
    if (!city.countryName || !city.cityName) return [];
    const country = countries.find(
      (item) =>
        item.countryName === city.countryName && item.cityName === city.cityName,
    );
    return [{
      countryInfoId: country?.countryInfoId,
      countryName: city.countryName,
      cityName: city.cityName,
      imageUrl: country?.imageUrl,
      summary: country?.summary,
    }];
  });
  const destinationResults = isDestinationSearch
    ? [...matchingCountries, ...popularDestinations.filter((popular) => {
        return [popular.countryName, popular.cityName].some((value) =>
          value?.trim().toLocaleLowerCase().includes(destinationKeyword),
        );
      })].filter((destination, index, all) => all.findIndex((item) =>
        item.countryName === destination.countryName && item.cityName === destination.cityName,
      ) === index)
    : popularDestinations;
  const currentUserName = profile?.name || "사용자";
  const currentUserInitial = currentUserName.slice(0, 2).toUpperCase() || "MS";
  const otherMembers = members.filter((member) =>
    profile?.id
      ? member.userId !== profile.id
      : member.nickName !== currentUserName,
  );
  const pendingInvitations = invitations.filter(
    (invitation) =>
      !["ACCEPTED", "REJECTED", "CANCELED", "CANCELLED"].includes(
        normalizeStatus(invitation.status),
      ),
  );
  const voteOptions = activeVote?.options ?? [];
  const confirmedCount = votes.filter(
    (vote) =>
      vote.confirmedOptionId != null || normalizeStatus(vote.status) === "CONFIRMED",
  ).length;
  const votingCount = votes.filter(
    (vote) => normalizeStatus(vote.status) === "OPEN",
  ).length;
  const hasOpenVote = votes.some(
    (vote) => normalizeStatus(vote.status) === "OPEN" && vote.voteId != null,
  );
  const canVote =
    normalizeStatus(activeVote?.status) === "OPEN" &&
    activeVote?.deadlinePassed !== true;
  const myVoteCount = voteOptions.some((option) => option.selectedByMe === true)
    ? 1
    : 0;
  const isSavingCandidates =
    addPlannerPlacesMutation.isPending ||
    selectRandomPlannerPlaceMutation.isPending;
  const isManagingMembers =
    acceptPlannerInvitationMutation.isPending ||
    rejectPlannerInvitationMutation.isPending ||
    cancelPlannerInvitationMutation.isPending ||
    removePlannerMemberMutation.isPending;
  const finalPlaces = confirmedPlaces.length
    ? confirmedPlaces
      : selectedPlaces.map(({ item }) => ({
        category: voteCategory,
        categoryLabel: voteCategory,
        placeName: item.placeName,
        voteCount: undefined,
      }));

  const requiresActivePlanner = !["list", "group"].includes(step);
  const handleCalendarDay = (day: number) => {
    const date = `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    if (!selectedStartDate || selectedEndDate) {
      setStartDate(date);
      setEndDate("");
      return;
    }
    if (date < selectedStartDate) {
      setStartDate(date);
      setEndDate(selectedStartDate);
      return;
    }
    setEndDate(date);
  };

  if (requiresActivePlanner && !hasActivePlanner) {
    return (
      <AppShell>
        <S.Page>
          <S.Header>
            <div>
              <S.Title>플래너</S.Title>
              <S.Subtitle>선택한 여행 계획이 없습니다.</S.Subtitle>
            </div>
          </S.Header>
          <S.State role="alert">먼저 플래너 목록에서 여행 계획을 선택해주세요.</S.State>
          <S.ActionRow>
            <PartTripButton type="button" onClick={() => flowNavigate({ to: paths.planner })}>
              플래너 목록
            </PartTripButton>
          </S.ActionRow>
        </S.Page>
      </AppShell>
    );
  }

  const nextVoteCategory = () => {
    const index = categories.indexOf(voteCategory);
    setVoteCategory(categories[(index + 1) % categories.length]);
  };
  const nextCategory = categories[(categories.indexOf(voteCategory) + 1) % categories.length];
  const handleSharePlan = async () => {
    if (!isConfirmed && !(await handleConfirmPlan())) return;
    try {
      if (!navigator.clipboard) throw new Error("clipboard is unavailable");
      await navigator.clipboard.writeText(window.location.href);
      setShareError("");
    } catch {
      setShareError("일정 공유 링크를 복사하지 못했습니다.");
    }
  };
  const handleCopyInviteLink = async () => {
    setInviteLinkFeedback("");
    setInviteLinkError("");
    if (!plannerInviteLink) {
      setInviteLinkError("초대 링크를 찾을 수 없습니다.");
      return;
    }
    try {
      if (!navigator.clipboard) throw new Error("clipboard is unavailable");
      await navigator.clipboard.writeText(plannerInviteLink);
      setInviteLinkFeedback("초대 링크를 복사했습니다.");
    } catch {
      setInviteLinkError("초대 링크를 복사하지 못했습니다.");
    }
  };

  return (
    <AppShell>
      <S.Page $wide={step === "destination" || step === "place"}>
        <PlannerHeader
          onNewTrip={handleStartNewPlanner}
          plan={plan}
          showNewTrip={step === "list"}
          wide={step === "destination" || step === "place"}
          step={step}
          voteCategory={voteCategory}
          vote={activeVote}
          memberCount={plannerDetail?.memberCount ?? members.length}
          isLoading={isLoading}
        />
        {errorMessage || hasError || votesError ? (
          <S.Error role="alert">
            {errorMessage || (votesError ? candidateManagementError : "플래너 정보를 불러오지 못했습니다.")}
          </S.Error>
        ) : null}

        {isLoading ? (
          <S.LoadingLayout aria-busy="true" aria-label="플래너 정보 로딩 중">
            <S.LoadingBody />
          </S.LoadingLayout>
        ) : hasError ? (
          <S.State>플래너 정보를 불러오지 못했습니다.</S.State>
        ) : (
          <>
            {step === "list" ? (
              <>
                <S.PlannerTabs aria-label="여행 계획 상태" role="tablist">
                  <button
                    aria-selected={plannerTab === "active"}
                    role="tab"
                    type="button"
                    className={plannerTab === "active" ? "active" : ""}
                    onClick={() => setPlannerTab("active")}
                  >
                    진행 중
                  </button>
                  <button
                    aria-selected={plannerTab === "planned"}
                    role="tab"
                    type="button"
                    className={plannerTab === "planned" ? "active" : ""}
                    onClick={() => setPlannerTab("planned")}
                  >
                    예정
                  </button>
                  <button
                    aria-selected={plannerTab === "completed"}
                    role="tab"
                    type="button"
                    className={plannerTab === "completed" ? "active" : ""}
                    onClick={() => setPlannerTab("completed")}
                  >
                    완료
                  </button>
                </S.PlannerTabs>
                <S.PlannerListLayout>
                  <S.PlanListPanel>
                    {availablePlanners.map((planner, index) => {
                      const title = planner.title || `${planner.cityName || planner.countryName || "여행"} 여행`;
                      return (
                        <S.PlanItem key={planner.plannerId ?? index}>
                          <S.PlanRow
                            type="button"
                            $state={plannerStatusKey(planner.status)}
                            onClick={() =>
                              void handleSelectPlanner(planner.plannerId)
                            }
                          >
                            <S.PlanContent>
                              <S.PlanDetails>
                                <strong>{title}</strong>
                                <span>
                                  {formatDateRange(planner.startDate, planner.endDate)}
                                </span>
                                <S.PlanStatusRow>
                                  <S.PlanStatus
                                    $state={plannerStatusKey(planner.status)}
                                  >
                                    {plannerStatusLabel(planner.status)}
                                  </S.PlanStatus>
                                  <S.PlanParticipation>
                                    {planner.joinedMemberCount ?? 0}/
                                    {planner.memberCount ?? 0}명 참여
                                  </S.PlanParticipation>
                                </S.PlanStatusRow>
                              </S.PlanDetails>
                              <S.PlanAside>
                                <PlannerMemberAvatars
                                  plannerId={planner.plannerId}
                                />
                                <S.RowArrow aria-hidden="true">›</S.RowArrow>
                              </S.PlanAside>
                            </S.PlanContent>
                          </S.PlanRow>
                        </S.PlanItem>
                      );
                    })}
                    {!isLoading && availablePlanners.length === 0 ? (
                      <S.Empty>등록된 여행 계획이 없습니다.</S.Empty>
                    ) : null}
                  </S.PlanListPanel>
                </S.PlannerListLayout>
              </>
            ) : null}

            {step === "group" ? (
              <S.GroupForm as="form" onSubmit={(event) => void saveGroupSettings(event)}>
                <S.GroupTypeRow>
                  <S.GroupTypeButton
                    type="button"
                    $active={isSolo}
                    onClick={() => setIsSolo(true)}
                  >
                    혼자 여행
                  </S.GroupTypeButton>
                  <S.GroupTypeButton
                    type="button"
                    $active={!isSolo}
                    onClick={() => setIsSolo(false)}
                  >
                    함께 여행
                  </S.GroupTypeButton>
                </S.GroupTypeRow>
                <S.CountRow>
                  <label htmlFor="planner-member-count">나를 포함한 인원</label>
                  <S.Stepper>
                    <button
                      type="button"
                      aria-label="인원 줄이기"
                      onClick={() =>
                        setMemberCount(
                          String(Math.max(1, Number(memberCount) - 1)),
                        )
                      }
                      disabled={isSolo}
                    >
                      −
                    </button>
                    <span id="planner-member-count">
                      {isSolo ? 1 : memberCount}
                    </span>
                    <button
                      type="button"
                      aria-label="인원 늘리기"
                      onClick={() =>
                        setMemberCount(
                          String(Math.min(30, Number(memberCount) + 1)),
                        )
                      }
                      disabled={isSolo}
                    >
                      +
                    </button>
                  </S.Stepper>
                </S.CountRow>
                {isInviteOpen ? (
                  <S.InvitePanel>
                    <S.SectionTitle>초대하기</S.SectionTitle>
                    {plannerInviteLink ? (
                      <S.InviteLinkRow>
                        <PartTripInput
                          aria-label="생성된 초대 링크"
                          value={plannerInviteLink}
                          readOnly
                        />
                        <PartTripButton
                          type="button"
                          $variant="secondary"
                          onClick={() => void handleCopyInviteLink()}
                        >
                          링크 복사
                        </PartTripButton>
                      </S.InviteLinkRow>
                    ) : (
                      <S.Notice>
                        플래너를 생성하면 멤버 초대 링크가 표시됩니다.
                      </S.Notice>
                    )}
                    <S.InviteCodeRow>
                      <S.StepField>
                        <label htmlFor="planner-invite-code">
                          초대 코드로 참여
                        </label>
                        <PartTripInput
                          id="planner-invite-code"
                          value={inviteCode}
                          onChange={(event) =>
                            setInviteCode(event.target.value)
                          }
                          placeholder="초대 코드를 입력하세요"
                        />
                      </S.StepField>
                      <PartTripButton
                        type="button"
                        $variant="secondary"
                        disabled={joinPlannerMutation.isPending}
                        onClick={() => void handleJoinPlanner()}
                      >
                        {joinPlannerMutation.isPending
                          ? "참여 중"
                          : "그룹 참여"}
                      </PartTripButton>
                    </S.InviteCodeRow>
                  </S.InvitePanel>
                ) : null}
                <S.MemberPanel>
                  <S.SectionTitle>함께할 사람</S.SectionTitle>
                  <S.MemberList>
                    <S.MemberRow>
                      <S.Avatar>{currentUserInitial.slice(0, 1)}</S.Avatar>
                      <S.MemberDetails>
                        <strong>{currentUserName}</strong>
                      </S.MemberDetails>
                      <S.MemberState>나</S.MemberState>
                    </S.MemberRow>
                    {otherMembers.map((member, index) => (
                      <S.MemberRow
                        key={`${member.userId ?? member.nickName}-${index}`}
                      >
                        <S.Avatar>
                          {(member.nickName || member.userId || "멤버")
                            .slice(0, 1)
                            .toUpperCase()}
                        </S.Avatar>
                        <S.MemberDetails>
                          <strong>
                            {member.nickName || member.userId || "멤버"}
                          </strong>
                        </S.MemberDetails>
                        <S.MemberState>
                          {member.role || "초대 대기"}
                        </S.MemberState>
                      </S.MemberRow>
                    ))}
                  </S.MemberList>
                </S.MemberPanel>
                <S.GroupActions>
                  <PartTripButton
                    type="button"
                    $variant="secondary"
                    onClick={() => setIsInviteOpen((current) => !current)}
                  >
                    {isInviteOpen ? "초대 닫기" : "+ 링크로 초대하기"}
                  </PartTripButton>
                  <PartTripButton type="submit" disabled={isSaving}>{isSaving ? "저장 중" : "다음: 여행지"}</PartTripButton>
                </S.GroupActions>
              </S.GroupForm>
            ) : null}

            {step === "group" && (plannerDetail || invitations.length > 0) ? (
              <PlannerGroupManagementPanel
                invitationLoading={invitationLoading}
                invitationError={invitationError}
                pendingInvitations={pendingInvitations}
                otherMembers={otherMembers}
                members={members}
                isManagingMembers={isManagingMembers}
                canManagePlanner={canManagePlanner}
                onAcceptInvitation={handleAcceptPlannerInvitation}
                onRejectInvitation={handleRejectPlannerInvitation}
                onCancelInvitation={handleCancelPlannerInvitation}
                onRemoveMember={handleRemovePlannerMember}
              />
            ) : null}

            {step === "destination" ? (
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
                      <PartTripInput
                        id="planner-departure"
                        value="대한민국"
                        readOnly
                      />
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
                        국가명 또는 도시명으로 검색할 수 있어요. 한글·영문 모두
                        지원합니다.
                      </S.FieldHint>
                    </S.StepField>
                    <S.StepField>
                      <span id="planner-destination-results-label">
                        {isDestinationSearch ? "검색 결과" : "인기 여행지"}
                      </span>
                      <S.PopularGrid role="group" aria-labelledby="planner-destination-results-label">
                        {destinationResults.map(
                          (country) => (
                            <S.PopularButton
                              type="button"
                              key={
                                country.countryInfoId ??
                                `${country.countryName}-${country.cityName}`
                              }
                              $active={
                                String(country.countryInfoId) === selectedCountryInfoId ||
                                (country.countryName === selectedCountryName &&
                                  country.cityName === selectedCityName)
                              }
                              onClick={() => handleDestinationSelect(country)}
                            >
                              <strong>
                                {country.cityName || country.countryName}
                              </strong>
                              <span>
                                {country.cityName ? country.countryName : "국가"}
                              </span>
                            </S.PopularButton>
                          ),
                        )}
                      </S.PopularGrid>
                      {isDestinationSearch && selectedCityName && destinationResults.length === 0 ? (
                        <S.SearchEmpty>
                          검색 결과가 없습니다. 국가명 또는 도시명을 다시
                          입력해주세요.
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
                          onClick={() =>
                            setHeadcount(
                              String(
                                Math.max(1, Number(selectedHeadcount) - 1),
                              ),
                            )
                          }
                        >
                          −
                        </button>
                        <button
                          type="button"
                          aria-label="인원 늘리기"
                          onClick={() =>
                            setHeadcount(
                              String(
                                Math.min(30, Number(selectedHeadcount) + 1),
                              ),
                            )
                          }
                        >
                          +
                        </button>
                      </S.Stepper>
                    </S.StepField>
                    <S.StepField>
                      <span id="planner-travel-style-label">여행 스타일</span>
                      <S.ChipRow role="group" aria-labelledby="planner-travel-style-label">
                        {["휴양", "맛집", "액티비티", "문화"].map((style) => (
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
                        {calendarMonth.getFullYear()}년{" "}
                        {calendarMonth.getMonth() + 1}월
                      </strong>
                      <span>
                        <button
                          type="button"
                          aria-label="이전 달"
                          onClick={() =>
                            setCalendarMonthOverride(
                              new Date(
                                calendarMonth.getFullYear(),
                                calendarMonth.getMonth() - 1,
                                1,
                              ),
                            )
                          }
                        >
                          ‹
                        </button>
                        <button
                          type="button"
                          aria-label="다음 달"
                          onClick={() =>
                            setCalendarMonthOverride(
                              new Date(
                                calendarMonth.getFullYear(),
                                calendarMonth.getMonth() + 1,
                                1,
                              ),
                            )
                          }
                        >
                          ›
                        </button>
                      </span>
                    </S.CalendarHeader>
                    <S.Weekdays>
                      {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                        <span key={day}>{day}</span>
                      ))}
                    </S.Weekdays>
                    <S.CalendarGrid>
                      {calendarDays.map((day, index) => {
                        const date =
                          day == null
                            ? ""
                            : `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                        return day ? (
                          <S.CalendarDay
                            key={day}
                            type="button"
                            $selected={
                              date === selectedStartDate ||
                              date === selectedEndDate
                            }
                            $range={Boolean(
                              selectedStartDate &&
                              selectedEndDate &&
                              date > selectedStartDate &&
                              date < selectedEndDate,
                            )}
                            onClick={() => handleCalendarDay(day)}
                          >
                            {day}
                          </S.CalendarDay>
                        ) : (
                          <span key={`empty-${index}`} />
                        );
                      })}
                    </S.CalendarGrid>
                    <S.CalendarSummary>
                      <strong>
                        {selectedStartDate && selectedEndDate
                          ? `${formatDate(selectedStartDate)} – ${formatDate(selectedEndDate)}`
                          : "날짜를 선택하세요"}
                      </strong>
                      {selectedStartDate && selectedEndDate ? (
                        <span>
                          {formatTripDuration(selectedStartDate, selectedEndDate)}
                        </span>
                      ) : null}
                    </S.CalendarSummary>
                  </S.CalendarPanel>
                </S.SettingsLayout>
                <S.FullWidthAction
                  type="submit"
                  form="planner-destination-form"
                  disabled={isSaving}
                >
                  {isSaving ? "저장 중" : "다음"}
                </S.FullWidthAction>
              </>
            ) : null}

            {step === "explore" ? (
              <>
                <S.CategoryChips aria-label="장소 카테고리">
                  {categories.map((category) => (
                    <S.CategoryChip
                      key={category}
                      type="button"
                      className={voteCategory === category ? "active" : ""}
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
                      <button
                        type="button"
                        disabled={!canManageCandidates}
                        onClick={() =>
                          setSelected(places.map((_, index) => index))
                        }
                      >
                        전체 후보 담기
                      </button>
                    </S.PlaceListHeader>
                    {places.map((item, index) => {
                      const isSelected = selected.includes(index);
                      return (
                        <S.PlaceRow key={index} $active={isSelected}>
                          <S.PlaceThumb $imageUrl={item.imageUrl}>
                            {!item.imageUrl ? "이미지 없음" : null}
                          </S.PlaceThumb>
                          <S.PlaceDetails>
                            <strong>{item.placeName || "장소"}</strong>
                            <span>
                              {item.category || voteCategory} · {item.address || "장소 정보"}
                            </span>
                          </S.PlaceDetails>
                          <S.PlaceAction
                            type="button"
                            $active={isSelected}
                            aria-pressed={isSelected}
                            disabled={!canManageCandidates}
                            onClick={() =>
                              setSelected((current) =>
                                isSelected
                                  ? current.filter((value) => value !== index)
                                  : [...current, index],
                              )
                            }
                          >
                            <span>{isSelected ? "후보 담김" : "담기"}</span>
                            <b aria-hidden="true">{isSelected ? "✓" : "+"}</b>
                          </S.PlaceAction>
                        </S.PlaceRow>
                      );
                    })}
                    {places.length === 0 ? (
                      <S.Empty>연동된 장소 후보가 없습니다.</S.Empty>
                    ) : null}
                  </S.PlaceListPanel>
                  <S.PanelActions>
                    <PartTripButton
                      type="button"
                      disabled={
                        isSavingCandidates ||
                        !canManageCandidates ||
                        selectedPlaceCount === 0
                      }
                      onClick={() => void handleSaveCandidates()}
                    >
                      {isSavingCandidates ? "후보 저장 중" : "투표 시작하기"}
                    </PartTripButton>
                  </S.PanelActions>
                </S.PlaceBody>
              </>
            ) : null}

            {step === "vote" ? (
              <>
                <S.VoteStatusRow>
                  <S.VoteStatus $active>진행 중</S.VoteStatus>
                  <S.VoteStatus>내 투표 {myVoteCount} / 1</S.VoteStatus>
                </S.VoteStatusRow>
                <S.VoteCategoryChips aria-label="투표 카테고리">
                  {categories.map((category) => (
                    <S.CategoryChip
                      key={category}
                      type="button"
                      className={voteCategory === category ? "active" : ""}
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
                        이 투표는{" "}
                        {activeVote.deadlinePassed === true
                          ? "마감"
                          : normalizeStatus(activeVote.status) === "CONFIRMED"
                            ? "확정"
                            : "마감"}
                        되어 참여할 수 없습니다.
                      </S.Notice>
                    ) : null}
                    {voteOptions.map((option, index) => {
                      const isSelected =
                        selectedOptionId === option.optionId ||
                        option.selectedByMe === true;
                      return (
                        <S.CandidateRow
                          key={option.optionId ?? index}
                          $selected={isSelected}
                        >
                          <S.PlaceDetails>
                            <strong>{option.placeName || "장소"}</strong>
                            <span>{option.voteCount ?? 0}표</span>
                            {(canManagePlanner || (profile?.id != null && option.addedByUserId === profile.id)) &&
                            normalizeStatus(activeVote?.status) === "OPEN" ? (
                              <S.DeleteOptionButton
                                type="button"
                                disabled={
                                  deleteVoteOptionMutation.isPending ||
                                  option.optionId == null
                                }
                                onClick={() => {
                                  if (window.confirm("이 후보를 삭제할까요?"))
                                    void handleDeleteVoteOption(option.optionId);
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
                              disabled={
                                !canVote ||
                                castBallotMutation.isPending ||
                                option.optionId == null
                              }
                              onClick={() =>
                                void handleCastBallot(option.optionId)
                              }
                            >
                              {isSelected ? "투표 완료" : "투표"}
                            </button>
                          </S.VoteMeta>
                        </S.CandidateRow>
                      );
                    })}
                    {!activeVote || voteOptions.length === 0 ? (
                      <S.Empty>아직 등록된 후보가 없습니다.</S.Empty>
                    ) : null}
                  </S.CandidatePanel>
                  <S.PanelActions>
                    <PartTripButton type="button" onClick={nextVoteCategory}>
                      다음: {nextCategory}
                    </PartTripButton>
                    <PartTripButton
                      type="button"
                      $variant="secondary"
                      disabled={!canCloseVotes || !canManagePlanner || closeVoteMutation.isPending}
                      onClick={() => void handleCloseVote()}
                    >
                      {closeVoteMutation.isPending
                        ? "투표 종료 중"
                        : canCloseVotes
                          ? "투표 종료하기"
                          : "모든 카테고리 투표 후 종료"}
                    </PartTripButton>
                  </S.PanelActions>
                </S.VoteBody>
              </>
            ) : null}

            {step === "lineup" ? (
              <>
                <S.LineupModeRow aria-label="장소 선택 방식">
                  <S.SegmentButton
                    type="button"
                    disabled={selectedPlaces.length === 0}
                    data-active={lineupMode === "direct"}
                    $active={lineupMode === "direct"}
                    onClick={() => {
                      setLineupMode("direct");
                      const first = selectedPlaces[0]?.index;
                      if (first != null) {
                        setLineupChoice(first);
                        setSelected([first]);
                      }
                    }}
                  >
                    직접 선택
                  </S.SegmentButton>
                    <S.SegmentButton
                      type="button"
                      disabled={
                        selectedPlaces.length === 0 ||
                        isSavingCandidates
                      }
                    data-active={lineupMode === "random"}
                    $active={lineupMode === "random"}
                    onClick={() => void handleRandomLineup()}
                  >
                    랜덤 뽑기
                  </S.SegmentButton>
                </S.LineupModeRow>
                <S.CartBody>
                  <S.SelectedPanel>
                    <S.SectionTitle>
                      담은 장소 {selectedPlaces.length}
                    </S.SectionTitle>
                    <S.SelectedPlaces>
                      {selectedPlaces.map(({ index, item }) => (
                        <S.SelectedPlaceRow key={`${item.placeName}-${index}`}>
                          <S.PlaceDetails>
                            <strong>{item.placeName || "장소"}</strong>
                            <span>{voteCategory}</span>
                          </S.PlaceDetails>
                          <button
                            type="button"
                            aria-label={`${item.placeName || "장소"} 후보 제거`}
                            onClick={() => handleRemoveFromLineup(index)}
                          >
                            {lineupChoice === index ? "✓" : "✕"}
                          </button>
                        </S.SelectedPlaceRow>
                      ))}
                    </S.SelectedPlaces>
                    {selectedPlaces.length === 0 ? (
                      <S.Empty>투표 화면에서 장소를 선택하세요.</S.Empty>
                    ) : null}
                  </S.SelectedPanel>
                  <S.NextPanel>
                    <S.SectionTitle>선택을 확정할까요?</S.SectionTitle>
                    <p>담은 장소 중 지금 고른 장소로 일정을 확정해요</p>
                    <S.ActionRow>
                      <PartTripButton
                        type="button"
                        disabled={
                          isSavingCandidates || selectedPlaces.length === 0
                        }
                        onClick={() => void handleSaveCandidates()}
                      >
                        선택 확정하기
                      </PartTripButton>
                    </S.ActionRow>
                  </S.NextPanel>
                </S.CartBody>
              </>
            ) : null}

            {step === "progress" ? (
              <>
                <S.ProgressStats>
                  <S.ProgressStat>
                    <strong>{confirmedCount}</strong>
                    <span>확정</span>
                  </S.ProgressStat>
                  <S.ProgressStat>
                    <strong>{votingCount}</strong>
                    <span>투표 중</span>
                  </S.ProgressStat>
                  <S.ProgressStat>
                    <strong>
                      {Math.max(0, categories.length - votes.length)}
                    </strong>
                    <span>미정</span>
                  </S.ProgressStat>
                </S.ProgressStats>
                <S.ProgressBody>
                  <S.CategoryStatusPanel>
                    <S.SectionTitle>카테고리별 현황</S.SectionTitle>
                    {categories.map((category) => {
                      const vote = votes.find(
                        (item) =>
                          item.categoryLabel === category ||
                          item.category === category,
                      );
                      const status = normalizeStatus(vote?.status);
                      const confirmed =
                        vote?.confirmedOptionId != null ||
                        status === "CONFIRMED";
                      const closed = status === "CLOSED";
                      const confirmedPlace = vote?.options?.find(
                        (option) =>
                          option.optionId === vote.confirmedOptionId ||
                          option.confirmed,
                      )?.placeName;
                      return (
                        <S.StatusLine key={category}>
                          <span>{category}</span>
                          <strong>
                            {confirmed
                              ? confirmedPlace || "확정"
                              : closed
                                ? "마감됨"
                                : vote
                                  ? "진행 중 · " +
                                    (vote.votedMemberCount ?? 0) +
                                    "/" +
                                    (vote.eligibleMemberCount ?? 0)
                                  : "후보 없음"}
                          </strong>
                        </S.StatusLine>
                      );
                    })}
                  </S.CategoryStatusPanel>
                  <S.MemberResponses>
                    <S.SectionTitle>멤버 응답</S.SectionTitle>
                    {(members.length
                      ? members
                      : [
                          {
                            nickName: currentUserName,
                            userId: currentUserInitial,
                            role: "완료",
                          },
                        ]
                    ).map((member, index) => (
                      <S.ResponseRow
                        key={member.userId ?? member.nickName ?? index}
                      >
                        <S.Avatar>
                          {(member.nickName || member.userId || "멤버")
                            .slice(0, 2)
                            .toUpperCase()}
                        </S.Avatar>
                        <strong>
                          {member.nickName || member.userId || "멤버"}
                        </strong>
                        <span>{member.role || "대기 중"}</span>
                      </S.ResponseRow>
                    ))}
                    <S.ActionRow>
                      {!isConfirmed ? (
                        <PartTripButton
                          type="button"
                          $variant="secondary"
                          disabled={!canManageCandidates}
                          onClick={() =>
                            flowNavigate({ to: paths.plannerExplore })
                          }
                        >
                          {votes.length ? "후보 장소 관리" : "장소 후보 추가"}
                        </PartTripButton>
                      ) : null}
                      <PartTripButton
                        type="button"
                        disabled={
                          !hasOpenVote ||
                          !canCloseVotes ||
                          !canManagePlanner ||
                          closeVoteMutation.isPending
                        }
                        onClick={() => void handleCloseVote()}
                      >
                        {closeVoteMutation.isPending
                          ? "마감 중"
                          : hasOpenVote
                            ? canCloseVotes
                              ? "투표 마감하기"
                              : "모든 카테고리 투표 후 마감"
                            : "마감할 투표 없음"}
                      </PartTripButton>
                      <PartTripButton
                        type="button"
                        $variant="secondary"
                        disabled={
                          !isRemindAvailable ||
                          remindPlannerMembersMutation.isPending
                        }
                        onClick={() => void handleRemindMembers()}
                      >
                        {remindPlannerMembersMutation.isPending
                          ? "알림 전송 중"
                          : "재촉 알림 보내기"}
                      </PartTripButton>
                      <PartTripButton
                        type="button"
                        $variant="secondary"
                        disabled={
                          !votes.length ||
                          hasOpenVote ||
                          !canManagePlanner ||
                          confirmPlannerMutation.isPending
                        }
                        onClick={() => void handleConfirmPlan().then((confirmed) => {
                          if (confirmed) flowNavigate({ to: paths.plannerFinal });
                        })}
                      >
                        일정 확정하기
                      </PartTripButton>
                      <PartTripButton
                        type="button"
                        $variant="secondary"
                        disabled={!plannerInviteLink}
                        onClick={() => void handleCopyInviteLink()}
                      >
                        초대링크 복사
                      </PartTripButton>
                      {canManagePlanner ? (
                        <S.DeletePlannerButton
                          type="button"
                          aria-label="현재 플래너 삭제"
                          disabled={deletePlannerMutation.isPending}
                          onClick={() => {
                            if (window.confirm("이 플래너를 삭제할까요?")) {
                              void handleDeletePlanner(plannerDetail?.plannerId);
                            }
                          }}
                        >
                          {deletePlannerMutation.isPending ? "삭제 중" : "삭제"}
                        </S.DeletePlannerButton>
                      ) : null}
                    </S.ActionRow>
                    {remindFeedback ? (
                      <S.ActionFeedback role="status">
                        {remindFeedback}
                      </S.ActionFeedback>
                    ) : null}
                    {inviteLinkFeedback ? (
                      <S.ActionFeedback role="status">
                        {inviteLinkFeedback}
                      </S.ActionFeedback>
                    ) : null}
                    {inviteLinkError ? (
                      <S.Error role="alert">{inviteLinkError}</S.Error>
                    ) : null}
                  </S.MemberResponses>
                </S.ProgressBody>
                <PlannerProgressManagementPanel
                  closedVotes={votes.filter((vote) => normalizeStatus(vote.status) === "CLOSED")}
                  canManagePlanner={canManagePlanner}
                  confirmVotePending={confirmVoteMutation.isPending}
                  onConfirmVote={handleConfirmVote}
                  onOpenGroupManagement={() => flowNavigate({ to: paths.plannerGroup })}
                />
              </>
            ) : null}

            {step === "final" ? (
              <PlannerFinalStep
                cityName={plannerDetail?.cityName || plan?.cityName}
                endDate={plannerDetail?.endDate || plan?.endDate}
                finalPlaces={finalPlaces}
                isConfirmed={isConfirmed}
                members={members}
                onShare={() => void handleSharePlan()}
                onStart={() => navigate({ to: paths.main })}
                shareError={shareError}
                startDate={plannerDetail?.startDate || plan?.startDate}
                userInitial={currentUserInitial}
                userName={currentUserName}
              />
            ) : null}

            {step === "place" ? (
              <PlannerPlaceStep
                canManageCandidates={canManageCandidates}
                isSaving={addPlannerPlacesMutation.isPending}
                onAdd={() => void handleAddPlaceCandidate()}
                place={place}
              />
            ) : null}
          </>
        )}
      </S.Page>
    </AppShell>
  );
}
