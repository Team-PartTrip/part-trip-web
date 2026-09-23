import { useState } from 'react'
import { useUserProfileQuery } from '@/entities/user'
import { AppShell } from '@/widgets/app-shell'

import { normalizeStatus } from '../model/status'
import { usePlannerFlow } from '../model/usePlannerFlow'
import type { PlannerStep } from '../model/types'
import { PlannerAiFlow } from './PlannerAiFlow'
import { PlannerHeader } from './PlannerHeader'
import { PlannerGroupManagementPanel } from './PlannerGroupManagementPanel'
import { PlannerGroupStep } from './PlannerGroupStep'
import { PlannerListStep, type PlannerTab } from './PlannerListStep'
import * as S from './PlannerPage.styles'

export type { PlannerStep } from '../model/types'

export function PlannerPage() {
  return <PlannerFlowPage step="list" />
}

export function PlannerGroupPage() {
  return <PlannerFlowPage step="group" />
}

export function PlannerDestinationPage() {
  return <PlannerAiFlow step="destination" />
}

export function PlannerExplorePage() {
  return <PlannerAiFlow step="criteria" />
}

export function PlannerProgressPage() {
  return <PlannerAiFlow step="schedule" />
}

export function PlannerInvitePage() {
  return <PlannerAiFlow step="invite" />
}

function PlannerFlowPage({ step }: { step: PlannerStep }) {
  const { data: profile } = useUserProfileQuery()
  const [plannerTab, setPlannerTab] = useState<PlannerTab>('active')
  const [isInviteOpen, setIsInviteOpen] = useState(() =>
    typeof window !== 'undefined' && Boolean(new URLSearchParams(window.location.search).get('inviteCode')),
  )
  const { common, group, planner } = usePlannerFlow(step)
  const { errorMessage, hasError, isLoading, isSaving, plannerDetail } = common
  const {
    canManagePlanner,
    handleAcceptPlannerInvitation,
    handleCancelPlannerInvitation,
    handleJoinPlanner,
    handleRejectPlannerInvitation,
    handleRemovePlannerMember,
    invitationError,
    invitationLoading,
    invitations,
    inviteCode,
    isManagingMembers,
    isSolo,
    joinPlannerPending,
    memberCount,
    members,
    saveGroupSettings,
    setInviteCode,
    setIsSolo,
    setMemberCount,
  } = group
  const { handleSelectPlanner, handleStartNewPlanner, planners } = planner
  const currentUserName = profile?.name || '사용자'
  const currentUserInitial = currentUserName.slice(0, 2).toUpperCase() || 'MS'
  const otherMembers = members.filter((member) =>
    profile?.id ? member.userId !== profile.id : member.nickName !== currentUserName,
  )
  const pendingInvitations = invitations.filter(
    (invitation) => !['ACCEPTED', 'REJECTED', 'CANCELED', 'CANCELLED'].includes(normalizeStatus(invitation.status)),
  )

  return (
    <AppShell>
      <S.Page>
        <PlannerHeader
          onNewTrip={handleStartNewPlanner}
          showNewTrip={step === 'list'}
          step={step}
          isLoading={isLoading}
        />
        {errorMessage ? <S.Error role="alert">{errorMessage}</S.Error> : null}
        {isLoading ? (
          <S.LoadingLayout aria-busy="true" aria-label="플래너 정보 로딩 중">
            <S.LoadingBody />
          </S.LoadingLayout>
        ) : hasError ? (
          <S.State role="alert">플래너 정보를 불러오지 못했습니다.</S.State>
        ) : (
          <>
            {step === 'list' ? (
              <PlannerListStep
                isLoading={isLoading}
                onSelectPlanner={handleSelectPlanner}
                onTabChange={setPlannerTab}
                plannerTab={plannerTab}
                planners={planners}
              />
            ) : null}
            {step === 'group' ? (
              <PlannerGroupStep
                currentUserInitial={currentUserInitial}
                currentUserName={currentUserName}
                handleJoinPlanner={handleJoinPlanner}
                inviteCode={inviteCode}
                isInviteOpen={isInviteOpen}
                isSaving={isSaving}
                isSolo={isSolo}
                joinPlannerPending={joinPlannerPending}
                memberCount={memberCount}
                members={members}
                saveGroupSettings={saveGroupSettings}
                setInviteCode={setInviteCode}
                setIsInviteOpen={setIsInviteOpen}
                setIsSolo={setIsSolo}
                setMemberCount={setMemberCount}
              />
            ) : null}
            {step === 'group' && (plannerDetail || invitations.length > 0) ? (
              <PlannerGroupManagementPanel
                invitationLoading={invitationLoading}
                invitationError={invitationError}
                pendingInvitations={pendingInvitations}
                otherMembers={otherMembers}
                isManagingMembers={isManagingMembers}
                canManagePlanner={canManagePlanner}
                onAcceptInvitation={handleAcceptPlannerInvitation}
                onRejectInvitation={handleRejectPlannerInvitation}
                onCancelInvitation={handleCancelPlannerInvitation}
                onRemoveMember={handleRemovePlannerMember}
              />
            ) : null}
          </>
        )}
      </S.Page>
    </AppShell>
  )
}
