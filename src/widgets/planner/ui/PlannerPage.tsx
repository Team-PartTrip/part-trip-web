import { useMemo, useState } from "react";
import { usePlannerMembersQuery } from "@/entities/planner";
import { useUserProfileQuery } from "@/entities/user";
import { figmaTripPlanning } from "@/shared/assets";
import { paths } from "@/shared/config";
import {
  Button as PartTripButton,
  Input as PartTripInput,
} from "@/shared/ui/parttrip";
import { formatDate } from "@/shared/utils";
import { AppShell } from "@/widgets/app-shell";

import { plannerStatusKey, plannerStatusLabel } from "../model/status";
import { usePlannerFlow } from "../model/usePlannerFlow";
import type { PlannerStep } from "../model/types";
import * as S from "./PlannerPage.styles";

export type { PlannerStep } from "../model/types";

type Props = { step: PlannerStep };
type PlannerTab = "active" | "planned" | "completed";

function voteStatus(status?: string) {
  return status?.trim().toUpperCase() ?? "";
}

function dateRange(startDate?: string, endDate?: string) {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  return start.length >= 7 && end.length >= 7 && start.slice(0, 7) === end.slice(0, 7)
    ? `${start} – ${end.slice(5)}`
    : `${start} – ${end}`;
}

function shortDateRange(startDate?: string, endDate?: string) {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  return start.length >= 10 && end.length >= 10
    ? `${start.slice(5)} – ${end.slice(5)}`
    : dateRange(startDate, endDate);
}

function tripDuration(startDate?: string, endDate?: string) {
  if (!startDate || !endDate) return "";
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "";
  const nights = Math.max(
    0,
    Math.round((end.getTime() - start.getTime()) / 86_400_000),
  );
  return `${nights}박 ${nights + 1}일`;
}

function deadlineTime(deadline?: string) {
  const time = deadline?.slice(11, 16);
  return time && /^\d{2}:\d{2}$/.test(time) ? `${time} 마감` : "";
}

function PlannerMemberAvatars({ plannerId }: { plannerId?: number }) {
  const { data: members = [] } = usePlannerMembersQuery(
    plannerId ?? 0,
    plannerId != null,
  );
  const visibleMembers = members.slice(0, 4);
  if (!visibleMembers.length) return null;

  return (
    <S.PlanMemberAvatars aria-label={`${members.length}명 참여`}>
      {visibleMembers.map((member, index) => (
        <S.Avatar key={member.userId ?? member.nickName ?? index}>
          {(member.nickName || member.userId || "멤버")
            .slice(0, 1)
            .toUpperCase()}
        </S.Avatar>
      ))}
      {members.length > visibleMembers.length ? (
        <S.PlanMemberOverflow>
          +{members.length - visibleMembers.length}
        </S.PlanMemberOverflow>
      ) : null}
    </S.PlanMemberAvatars>
  );
}

function Header({
  onNewTrip,
  plan,
  showNewTrip,
  wide,
  step,
  voteCategory,
  vote,
  memberCount,
  isLoading,
}: {
  onNewTrip?: () => void;
  plan?: {
    cityName?: string;
    countryName?: string;
    startDate?: string;
    endDate?: string;
  };
  showNewTrip?: boolean;
  wide?: boolean;
  step: PlannerStep;
  voteCategory: string;
  vote?: {
    votedMemberCount?: number;
    eligibleMemberCount?: number;
    deadline?: string;
  };
  memberCount?: number;
  isLoading: boolean;
}) {
  const destination = plan?.cityName || plan?.countryName || "여행지";
  const duration = tripDuration(plan?.startDate, plan?.endDate);
  const voteMembers = vote
    ? `${vote.votedMemberCount ?? 0} / ${vote.eligibleMemberCount ?? memberCount ?? 0}명 참여`
    : "";
  const voteDeadline = deadlineTime(vote?.deadline);
  const isFinal = step === "final";
  const copy: Record<PlannerStep, [string, string]> = {
    list: ["플래너", ""],
    group: ["여행 그룹 정하기", "1 / 4 단계 · 여행 방식과 인원"],
    destination: ["여행지 & 기간", "2 / 4 단계 · 여행지와 날짜를 정해요"],
    explore: [
      "장소 둘러보기",
      `${destination} · ${shortDateRange(plan?.startDate, plan?.endDate)}`,
    ],
    vote: [
      `${voteCategory} 투표`,
      voteMembers
        ? `${voteMembers} · 카테고리별 1곳 선택${voteDeadline ? ` · ${voteDeadline}` : ""}`
        : "카테고리별 후보 중 1곳을 선택하세요.",
    ],
    lineup: [
      "장바구니",
      "소수 인원이라 투표 대신 직접 고르거나 랜덤으로 정할 수 있어요",
    ],
    progress: [
      duration ? `${destination} ${duration}` : `${destination} 여행`,
      `${shortDateRange(plan?.startDate, plan?.endDate)}${memberCount ? ` · ${memberCount}명` : ""}`,
    ],
    final: ["", ""],
    place: ["장소 상세", "후보 장소의 정보와 설명을 확인하세요."],
  };
  const [title, subtitle] = copy[step];
  const activeStep =
    step === "group"
      ? 1
      : step === "destination"
        ? 2
        : ["explore", "vote"].includes(step)
          ? 3
          : step === "final"
            ? 4
            : 0;
  return (
    <S.Header $final={isFinal} $hasSubtitle={Boolean(subtitle)} $wide={wide}>
      {isLoading ? (
        <S.LoadingHeader />
      ) : (
        <>
          {!isFinal ? (
            <div>
              <S.Title>{title}</S.Title>
              {subtitle ? <S.Subtitle>{subtitle}</S.Subtitle> : null}
            </div>
          ) : null}
          {showNewTrip ? (
            <PartTripButton type="button" onClick={onNewTrip}>
              + 생성
            </PartTripButton>
          ) : null}
          {activeStep > 0 ? (
            <S.FlowStepper $final={isFinal} aria-label="여행 플래너 진행 단계">
              {["그룹", "여행지·기간", "장소·투표", "확정"].map(
                (label, index) => (
                  <S.FlowStep
                    key={label}
                    $active={index + 1 === activeStep}
                    $complete={index + 1 < activeStep}
                  >
                    {index + 1} {label}
                  </S.FlowStep>
                ),
              )}
            </S.FlowStepper>
          ) : null}
        </>
      )}
    </S.Header>
  );
}

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
    castBallotMutation,
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
  const calendarDays = useMemo<Array<number | null>>(() => {
    const leadingDays = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth(),
      1,
    ).getDay();
    const daysInMonth = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth() + 1,
      0,
    ).getDate();
    return [
      ...Array(leadingDays).fill(null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];
  }, [calendarMonth]);

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
        voteStatus(invitation.status),
      ),
  );
  const voteOptions = activeVote?.options ?? [];
  const confirmedCount = votes.filter(
    (vote) =>
      vote.confirmedOptionId != null || voteStatus(vote.status) === "CONFIRMED",
  ).length;
  const votingCount = votes.filter(
    (vote) => voteStatus(vote.status) === "OPEN",
  ).length;
  const hasOpenVote = votes.some(
    (vote) => voteStatus(vote.status) === "OPEN" && vote.voteId != null,
  );
  const canVote =
    voteStatus(activeVote?.status) === "OPEN" &&
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

  const groupManagementPanel =
    step === "group" ? (
      <>
        {invitationLoading ? (
          <S.InvitationPanel>
            <S.SectionTitle>받은 플래너 초대</S.SectionTitle>
            <S.Notice>초대 정보를 불러오는 중입니다.</S.Notice>
          </S.InvitationPanel>
        ) : invitationError ? (
          <S.InvitationPanel>
            <S.SectionTitle>받은 플래너 초대</S.SectionTitle>
            <S.Notice>초대 정보를 불러오지 못했습니다.</S.Notice>
          </S.InvitationPanel>
        ) : pendingInvitations.length ? (
          <S.InvitationPanel>
            <S.SectionTitle>받은 플래너 초대</S.SectionTitle>
            {pendingInvitations.map((invitation, index) => (
              <S.InvitationRow key={invitation.invitationId ?? index}>
                <strong>
                  {invitation.plannerTitle ||
                    `플래너 #${invitation.plannerId ?? "-"}`}
                </strong>
                <span>{invitation.invitedByUserId || "그룹장"}님의 초대</span>
                <S.SmallActionButton
                  type="button"
                  disabled={isManagingMembers}
                  onClick={() =>
                    void handleAcceptPlannerInvitation(invitation.invitationId)
                  }
                >
                  수락
                </S.SmallActionButton>
                <S.SmallActionButton
                  type="button"
                  disabled={isManagingMembers}
                  onClick={() =>
                    void handleRejectPlannerInvitation(invitation.invitationId)
                  }
                >
                  거절
                </S.SmallActionButton>
              </S.InvitationRow>
            ))}
          </S.InvitationPanel>
        ) : null}
        {otherMembers.length ? (
          <S.InvitePanel>
            <S.SectionTitle>멤버 관리</S.SectionTitle>
            {members.length ? (
            <S.MemberList>
              {otherMembers.map((member, index) => {
                const memberStatus = voteStatus(member.status);
                const isPendingMember =
                  member.invitationId != null &&
                  !["ACCEPTED", "JOINED", "ACTIVE"].includes(memberStatus);
                return (
                  <S.MemberRow
                    key={`${member.userId ?? member.nickName}-${index}`}
                  >
                    <S.Avatar>
                      {(member.nickName || member.userId || "멤버")
                        .slice(0, 2)
                        .toUpperCase()}
                    </S.Avatar>
                    <S.MemberDetails>
                      <strong>
                        {member.nickName || member.userId || "멤버"}
                      </strong>
                      <span>{memberStatus || "상태 확인 중"}</span>
                    </S.MemberDetails>
                    {canManagePlanner && isPendingMember ? (
                      <S.SmallActionButton
                        type="button"
                        disabled={isManagingMembers}
                        onClick={() => {
                          if (window.confirm("이 초대를 취소할까요?"))
                            void handleCancelPlannerInvitation(
                              member.invitationId,
                            );
                        }}
                      >
                        초대 취소
                      </S.SmallActionButton>
                    ) : canManagePlanner && member.userId ? (
                      <S.SmallActionButton
                        type="button"
                        disabled={isManagingMembers}
                        onClick={() => {
                          if (window.confirm("이 멤버를 내보낼까요?"))
                            void handleRemovePlannerMember(member.userId);
                        }}
                      >
                        내보내기
                      </S.SmallActionButton>
                    ) : null}
                  </S.MemberRow>
                );
              })}
            </S.MemberList>
            ) : null}
          </S.InvitePanel>
        ) : null}
      </>
    ) : null;

  const closedVotes = votes.filter(
    (vote) => voteStatus(vote.status) === "CLOSED",
  );
  const progressManagementPanel =
    step === "progress" && closedVotes.length ? (
      <S.InvitePanel>
        <S.SectionTitle>마감 투표 확정</S.SectionTitle>
        {closedVotes.length ? (
          closedVotes.map((vote, index) => {
            const options = vote.options ?? [];
            const highestVoteCount = Math.max(
              ...options.map((option) => option.voteCount ?? 0),
              0,
            );
            const topOptions = options.filter(
              (option) => (option.voteCount ?? 0) === highestVoteCount,
            );
            return (
              <div key={vote.voteId ?? index}>
                <S.StatusLine>
                  <span>
                    {vote.categoryLabel || vote.category || "카테고리"}
                  </span>
                  <strong>
                    {vote.confirmedOptionId
                      ? "확정 후보 선택됨"
                      : "확정할 후보를 선택하세요"}
                  </strong>
                  <small>마감</small>
                </S.StatusLine>
                <S.ConfirmOptions>
                  {topOptions.map((option, optionIndex) => (
                    <S.ConfirmOptionButton
                      key={option.optionId ?? optionIndex}
                      type="button"
                      $confirmed={
                        option.optionId === vote.confirmedOptionId ||
                        option.confirmed === true
                      }
                      disabled={
                        !canManagePlanner ||
                        confirmVoteMutation.isPending ||
                        option.optionId == null ||
                        vote.confirmedOptionId != null
                      }
                      onClick={() =>
                        void handleConfirmVote(vote.voteId, option.optionId)
                      }
                    >
                      {option.placeName || "장소"} · {option.voteCount ?? 0}표
                    </S.ConfirmOptionButton>
                  ))}
                </S.ConfirmOptions>
              </div>
            );
          })
        ) : (
          <S.Notice>마감된 투표가 없습니다.</S.Notice>
        )}
        <S.ActionRow>
          <PartTripButton
            type="button"
            $variant="secondary"
            onClick={() => flowNavigate({ to: paths.plannerGroup })}
          >
            그룹 관리
          </PartTripButton>
        </S.ActionRow>
      </S.InvitePanel>
    ) : null;

  return (
    <AppShell>
      <S.Page $wide={step === "destination" || step === "place"}>
        <Header
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
        {errorMessage || hasError ? (
          <S.Error role="alert">
            {errorMessage || "플래너 정보를 불러오지 못했습니다."}
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
                                  {dateRange(planner.startDate, planner.endDate)}
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
                          onClick={() =>
                            void navigator.clipboard?.writeText(
                              plannerInviteLink,
                            )
                          }
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

            {step === "group" && (plannerDetail || invitations.length > 0)
              ? groupManagementPanel
              : null}

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
                          {tripDuration(selectedStartDate, selectedEndDate)}
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
                          : voteStatus(activeVote.status) === "CONFIRMED"
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
                            voteStatus(activeVote?.status) === "OPEN" ? (
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
                      const status = voteStatus(vote?.status);
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
                          disabled={votes.some((vote) => voteStatus(vote.status) !== "OPEN")}
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
                {progressManagementPanel}
              </>
            ) : null}

            {step === "final" ? (
              <S.FinalConfirmBody>
                <S.SuccessMark aria-hidden="true">✓</S.SuccessMark>
                <S.FinalTitle>여행 계획이 확정됐어요</S.FinalTitle>
                <S.FinalTripTitle>
                  {plannerDetail?.cityName || plan?.cityName || "여행"}{" "}
                  {tripDuration(
                    plannerDetail?.startDate || plan?.startDate,
                    plannerDetail?.endDate || plan?.endDate,
                  )}
                </S.FinalTripTitle>
                <S.FinalDate>
                  {dateRange(
                    plannerDetail?.startDate || plan?.startDate,
                    plannerDetail?.endDate || plan?.endDate,
                  )}
                </S.FinalDate>
                <S.FinalMembers aria-label="참여 멤버">
                  {(members.length
                    ? members
                    : [
                        {
                          nickName: currentUserName,
                          userId: currentUserInitial,
                        },
                      ]
                  ).map((member, index) => (
                    <S.Avatar key={member.userId ?? member.nickName ?? index}>
                      {(member.nickName || member.userId || "멤버")
                        .slice(0, 1)
                        .toUpperCase()}
                    </S.Avatar>
                  ))}
                </S.FinalMembers>
                <S.FinalMemberSummary>
                  {plannerDetail?.joinedMemberCount ?? members.length ?? "-"}명
                  모두 참여
                </S.FinalMemberSummary>
                <S.FinalSchedulePanel>
                  <S.SectionTitle>확정된 일정</S.SectionTitle>
                  <S.FinalPlaceList>
                    {finalPlaces.map((item, index) => (
                      <S.FinalPlaceRow key={`${item.placeName}-${index}`}>
                        <small>
                          {item.categoryLabel || item.category || "장소"}
                        </small>
                        <strong>{item.placeName || "장소"}</strong>
                        <span>{item.voteCount ?? "-"}표</span>
                      </S.FinalPlaceRow>
                    ))}
                    {finalPlaces.length === 0 ? (
                      <S.Empty>확정된 장소가 없습니다.</S.Empty>
                    ) : null}
                  </S.FinalPlaceList>
                </S.FinalSchedulePanel>
                <S.FinalActions>
                  <PartTripButton
                    type="button"
                    disabled={!isConfirmed}
                    onClick={() => navigate({ to: paths.main })}
                  >
                    여행 시작하기
                  </PartTripButton>
                  <PartTripButton
                    type="button"
                    $variant="secondary"
                    onClick={() => void handleSharePlan()}
                  >
                    일정 공유하기
                  </PartTripButton>
                </S.FinalActions>
                {shareError ? <S.Error role="alert">{shareError}</S.Error> : null}
                <S.FinalHint>
                  일정이 마음에 들지 않나요? 이전 단계에서 수정할 수 있어요
                </S.FinalHint>
              </S.FinalConfirmBody>
            ) : null}

            {step === "place" ? (
              <S.PlaceDetailLayout>
                {place ? (
                  <>
                    <S.PlaceImage
                      src={place.imageUrl || figmaTripPlanning}
                      alt=""
                    />
                    <S.StepCard>
                      <S.Badge>추천 장소</S.Badge>
                      <h2>{place.placeName}</h2>
                      <p>{place.description || "장소 설명이 없습니다."}</p>
                      <PartTripButton
                        type="button"
                        disabled={addPlannerPlacesMutation.isPending}
                        onClick={() => void handleAddPlaceCandidate()}
                      >
                        {addPlannerPlacesMutation.isPending
                          ? "후보 저장 중"
                          : "투표 후보에 추가"}
                      </PartTripButton>
                    </S.StepCard>
                  </>
                ) : (
                  <S.Empty>장소 정보를 찾을 수 없습니다.</S.Empty>
                )}
              </S.PlaceDetailLayout>
            ) : null}
          </>
        )}
      </S.Page>
    </AppShell>
  );
}
