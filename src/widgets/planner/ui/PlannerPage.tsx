import { useState } from "react";
import { useUserProfileQuery } from "@/entities/user";
import { paths } from "@/shared/config";
import { getMonthCalendarDays } from "@/shared/utils";
import {
  Button as PartTripButton,
  Input as PartTripInput,
} from "@/shared/ui/parttrip";
import { AppShell } from "@/widgets/app-shell";

import { normalizeStatus } from "../model/status";
import { usePlannerFlow } from "../model/usePlannerFlow";
import type { PlannerStep } from "../model/types";
import { PlannerHeader } from "./PlannerHeader";
import { PlannerFinalStep } from "./PlannerFinalStep";
import { PlannerGroupManagementPanel } from "./PlannerGroupManagementPanel";
import { PlannerListStep, type PlannerTab } from "./PlannerListStep";
import * as S from "./PlannerPage.styles";
import { PlannerPlaceStep } from "./PlannerPlaceStep";
import {
  PlannerDestinationStep,
  PlannerExploreStep,
  PlannerLineupStep,
  PlannerProgressStep,
  PlannerVoteStep,
} from "./PlannerStepViews";

export type { PlannerStep } from "../model/types";

type Props = { step: PlannerStep };

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
              <PlannerListStep
                isLoading={isLoading}
                onSelectPlanner={handleSelectPlanner}
                onTabChange={setPlannerTab}
                plannerTab={plannerTab}
                planners={planners}
              />
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
              <PlannerDestinationStep
                calendarDays={calendarDays}
                calendarMonth={calendarMonth}
                destinationResults={destinationResults}
                handleCalendarDay={handleCalendarDay}
                handleDestinationSelect={handleDestinationSelect}
                isDestinationSearch={isDestinationSearch}
                isSaving={isSaving}
                saveDestination={saveDestination}
                selectedCityName={selectedCityName}
                selectedCountryInfoId={selectedCountryInfoId}
                selectedCountryName={selectedCountryName}
                selectedEndDate={selectedEndDate}
                selectedHeadcount={selectedHeadcount}
                selectedStartDate={selectedStartDate}
                setCalendarMonthOverride={setCalendarMonthOverride}
                setCityName={setCityName}
                setEndDate={setEndDate}
                setHeadcount={setHeadcount}
                setStartDate={setStartDate}
                setTravelStyle={setTravelStyle}
                travelStyle={travelStyle}
              />
            ) : null}

            {step === "explore" ? (
              <PlannerExploreStep
                canManageCandidates={canManageCandidates}
                handleSaveCandidates={handleSaveCandidates}
                isSavingCandidates={isSavingCandidates}
                places={places}
                plannerCategories={categories}
                selected={selected}
                selectedPlaceCount={selectedPlaceCount}
                setSelected={setSelected}
                setVoteCategory={setVoteCategory}
                voteCategory={voteCategory}
              />
            ) : null}

            {step === "vote" ? (
              <PlannerVoteStep
                activeVote={activeVote}
                canCloseVotes={canCloseVotes}
                canManagePlanner={canManagePlanner}
                castBallotPending={castBallotMutation.isPending}
                closeVotePending={closeVoteMutation.isPending}
                deleteVoteOptionPending={deleteVoteOptionMutation.isPending}
                handleCastBallot={handleCastBallot}
                handleCloseVote={handleCloseVote}
                handleDeleteVoteOption={handleDeleteVoteOption}
                nextCategory={nextCategory}
                onNextCategory={nextVoteCategory}
                plannerCategories={categories}
                profileId={profile?.id}
                selectedOptionId={selectedOptionId}
                setVoteCategory={setVoteCategory}
                voteCategory={voteCategory}
                voteOptions={activeVote?.options ?? []}
              />
            ) : null}

            {step === "lineup" ? (
              <PlannerLineupStep
                handleRandomLineup={handleRandomLineup}
                handleRemoveFromLineup={handleRemoveFromLineup}
                handleSaveCandidates={handleSaveCandidates}
                isSavingCandidates={isSavingCandidates}
                lineupChoice={lineupChoice}
                lineupMode={lineupMode}
                selectedPlaces={selectedPlaces}
                setLineupChoice={setLineupChoice}
                setLineupMode={setLineupMode}
                setSelected={setSelected}
                voteCategory={voteCategory}
              />
            ) : null}

            {step === "progress" ? (
              <PlannerProgressStep
                canCloseVotes={canCloseVotes}
                canManageCandidates={canManageCandidates}
                canManagePlanner={canManagePlanner}
                closeVotePending={closeVoteMutation.isPending}
                confirmPlannerPending={confirmPlannerMutation.isPending}
                confirmVotePending={confirmVoteMutation.isPending}
                currentUserInitial={currentUserInitial}
                currentUserName={currentUserName}
                deletePlannerPending={deletePlannerMutation.isPending}
                handleCloseVote={handleCloseVote}
                handleConfirmPlan={handleConfirmPlan}
                handleConfirmVote={handleConfirmVote}
                handleDeletePlanner={handleDeletePlanner}
                handleRemindMembers={handleRemindMembers}
                hasOpenVote={votes.some((vote) => normalizeStatus(vote.status) === "OPEN" && vote.voteId != null)}
                inviteLinkError={inviteLinkError}
                inviteLinkFeedback={inviteLinkFeedback}
                isConfirmed={isConfirmed}
                isRemindAvailable={isRemindAvailable}
                members={members}
                onCopyInviteLink={() => void handleCopyInviteLink()}
                onOpenExplore={() => flowNavigate({ to: paths.plannerExplore })}
                onOpenFinal={() => flowNavigate({ to: paths.plannerFinal })}
                onOpenGroupManagement={() => flowNavigate({ to: paths.plannerGroup })}
                plannerDetail={plannerDetail}
                plannerInviteLink={plannerInviteLink}
                plannerCategories={categories}
                remindFeedback={remindFeedback}
                remindPending={remindPlannerMembersMutation.isPending}
                votes={votes}
                confirmedCount={votes.filter((vote) => vote.confirmedOptionId != null || normalizeStatus(vote.status) === "CONFIRMED").length}
                votingCount={votes.filter((vote) => normalizeStatus(vote.status) === "OPEN").length}
              />
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
