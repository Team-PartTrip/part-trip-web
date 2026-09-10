import { useState } from "react";
import { useUserProfileQuery } from "@/entities/user";
import { paths } from "@/shared/config";
import {
  Button as PartTripButton,
} from "@/shared/ui/parttrip";
import { AppShell } from "@/widgets/app-shell";

import { getDestinationResults } from "../model/destination";
import { getPlannerPageModel } from "../model/planner-page-model";
import { usePlannerCalendar } from "../model/usePlannerCalendar";
import { usePlannerFlow } from "../model/usePlannerFlow";
import { usePlannerPageActions } from "../model/usePlannerPageActions";
import type { PlannerStep } from "../model/types";
import { PlannerHeader } from "./PlannerHeader";
import { PlannerFinalStep } from "./PlannerFinalStep";
import { PlannerGroupManagementPanel } from "./PlannerGroupManagementPanel";
import { PlannerGroupStep } from "./PlannerGroupStep";
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
  return <PlannerFlowPage step="explore" />;
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
  const { candidate, common, destination, group, planner, vote } = usePlannerFlow(step);
  const {
    errorMessage,
    hasActivePlanner,
    hasError,
    isLoading,
    isSaving,
    navigate,
    plan,
    plannerDetail,
    plannerInviteLink,
  } = common;
  const {
    handleAcceptPlannerInvitation,
    handleCancelPlannerInvitation,
    handleJoinPlanner,
    handleRejectPlannerInvitation,
    handleRemovePlannerMember,
    invitationError,
    invitationLoading,
    invitations,
    inviteCode,
    isSolo,
    isManagingMembers,
    joinPlannerPending,
    memberCount,
    members,
    saveGroupSettings,
    setInviteCode,
    setIsSolo,
    setMemberCount,
  } = group;
  const {
    canManageCandidates,
    candidateManagementError,
    handleAddPlaceCandidate,
    handleRandomLineup,
    handleRemoveFromLineup,
    handleSaveCandidates,
    handleVotePlace,
    isSavingCandidates,
    isSavingPlace,
    isVotingPlace,
    lineupChoice,
    lineupMode,
    place,
    places,
    plannerCategories: categories,
    selectedPlaces,
    setLineupChoice,
    setLineupMode,
    setSelected,
    setVoteCategory,
    voteCategory,
  } = candidate;
  const {
    countries,
    handleDestinationSelect,
    popularCities,
    saveDestination,
    selectedCityName,
    selectedCountryInfoId,
    selectedCountryName,
    selectedEndDate,
    selectedHeadcount,
    selectedStartDate,
    setCityName,
    setEndDate,
    setHeadcount,
    setStartDate,
  } = destination;
  const {
    activeVote,
    canCloseVotes,
    castBallotPending,
    closeVotePending,
    confirmVotePending,
    deleteVoteOptionPending,
    handleCastBallot,
    handleCloseVote,
    handleConfirmVote,
    handleDeleteVoteOption,
    handleRemindMembers,
    canManagePlanner,
    isConfirmed,
    isRemindAvailable,
    remindFeedback,
    remindPending,
    selectedOptionId,
    votes,
    votesError,
  } = vote;
  const {
    confirmPlannerPending,
    confirmedPlaces,
    deletePlannerPending,
    handleConfirmPlan,
    handleDeletePlanner,
    handleSelectPlanner,
    handleStartNewPlanner,
    planners,
  } = planner;
  const { calendarDays, calendarMonth, handleCalendarDay, setCalendarMonthOverride } = usePlannerCalendar(
    selectedStartDate,
    selectedEndDate,
    setStartDate,
    setEndDate,
  );
  const {
    handleCopyInviteLink,
    handleSharePlan,
    inviteLinkError,
    inviteLinkFeedback,
    shareError,
  } = usePlannerPageActions({ handleConfirmPlan, isConfirmed, plannerInviteLink });

  const { destinationResults, isDestinationSearch } = getDestinationResults(
    countries,
    popularCities,
    selectedCityName,
    plannerDetail?.cityName,
  );
  const currentUserName = profile?.name || "사용자";
  const currentUserInitial = currentUserName.slice(0, 2).toUpperCase() || "MS";
  const {
    confirmedCount,
    finalPlaces,
    hasOpenVote,
    otherMembers,
    pendingInvitations,
    votingCount,
  } = getPlannerPageModel({
    confirmedPlaces,
    currentUserName,
    invitations,
    members,
    profileId: profile?.id,
    selectedPlaces,
    votes,
    voteCategory,
  });

  const requiresActivePlanner = !["list", "group"].includes(step);

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
            <PartTripButton type="button" onClick={() => navigate({ to: paths.planner })}>
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
              <PlannerGroupStep
                currentUserInitial={currentUserInitial}
                currentUserName={currentUserName}
                handleCopyInviteLink={handleCopyInviteLink}
                handleJoinPlanner={handleJoinPlanner}
                inviteCode={inviteCode}
                isInviteOpen={isInviteOpen}
                isSaving={isSaving}
                isSolo={isSolo}
                joinPlannerPending={joinPlannerPending}
                memberCount={memberCount}
                members={otherMembers}
                plannerInviteLink={plannerInviteLink}
                saveGroupSettings={saveGroupSettings}
                setInviteCode={setInviteCode}
                setIsInviteOpen={setIsInviteOpen}
                setIsSolo={setIsSolo}
                setMemberCount={setMemberCount}
              />
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
                activeVote={activeVote}
                canManagePlanner={canManagePlanner}
                handleVotePlace={handleVotePlace}
                isVotingPlace={isVotingPlace}
                places={places}
                plannerCategories={categories}
                setVoteCategory={setVoteCategory}
                voteCategory={voteCategory}
              />
            ) : null}

            {step === "vote" ? (
              <PlannerVoteStep
                activeVote={activeVote}
                canCloseVotes={canCloseVotes}
                canManagePlanner={canManagePlanner}
                castBallotPending={castBallotPending}
                closeVotePending={closeVotePending}
                deleteVoteOptionPending={deleteVoteOptionPending}
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
                closeVotePending={closeVotePending}
                confirmPlannerPending={confirmPlannerPending}
                confirmVotePending={confirmVotePending}
                currentUserInitial={currentUserInitial}
                currentUserName={currentUserName}
                deletePlannerPending={deletePlannerPending}
                handleCloseVote={handleCloseVote}
                handleConfirmPlan={handleConfirmPlan}
                handleConfirmVote={handleConfirmVote}
                handleDeletePlanner={handleDeletePlanner}
                handleRemindMembers={handleRemindMembers}
                hasOpenVote={hasOpenVote}
                inviteLinkError={inviteLinkError}
                inviteLinkFeedback={inviteLinkFeedback}
                isConfirmed={isConfirmed}
                isRemindAvailable={isRemindAvailable}
                members={members}
                onCopyInviteLink={() => void handleCopyInviteLink()}
                onOpenExplore={() => navigate({ to: paths.plannerExplore })}
                onOpenFinal={() => navigate({ to: paths.plannerFinal })}
                onOpenGroupManagement={() => navigate({ to: paths.plannerGroup })}
                plannerDetail={plannerDetail}
                plannerInviteLink={plannerInviteLink}
                plannerCategories={categories}
                remindFeedback={remindFeedback}
                remindPending={remindPending}
                votes={votes}
                confirmedCount={confirmedCount}
                votingCount={votingCount}
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
                isSaving={isSavingPlace}
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
