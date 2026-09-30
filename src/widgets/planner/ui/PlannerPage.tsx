import { useState, type ReactNode } from 'react'
import { useUserProfileQuery } from '@/entities/user'
import { AppShell } from '@/widgets/app-shell'

import { usePlannerGroupFlow } from '../model/usePlannerGroupFlow'
import { usePlannerListFlow } from '../model/usePlannerListFlow'
import type { PlannerStep } from '../model/types'
import { PlannerAiFlow } from './PlannerAiFlow'
import { PlannerHeader } from './PlannerHeader'
import { PlannerGroupManagementPanel } from './PlannerGroupManagementPanel'
import { PlannerGroupStep } from './PlannerGroupStep'
import { PlannerListStep, type PlannerTab } from './PlannerListStep'
import * as S from './PlannerPage.styles'

export type { PlannerStep } from '../model/types'

export function PlannerPage() {
  const planner = usePlannerListFlow()
  const [plannerTab, setPlannerTab] = useState<PlannerTab>('active')

  return (
    <PlannerPageLayout step="list" onNewTrip={planner.handleStartNewPlanner} errorMessage={planner.errorMessage} hasError={planner.hasError} isLoading={planner.isLoading}>
      <PlannerListStep
        isLoading={planner.isLoading}
        onSelectPlanner={planner.handleSelectPlanner}
        onTabChange={setPlannerTab}
        plannerTab={plannerTab}
        planners={planner.planners}
      />
    </PlannerPageLayout>
  )
}

export function PlannerGroupPage() {
  const { data: profile } = useUserProfileQuery()
  const group = usePlannerGroupFlow()
  const [isInviteOpen, setIsInviteOpen] = useState(() =>
    typeof window !== 'undefined' && Boolean(new URLSearchParams(window.location.search).get('inviteCode')),
  )
  const currentUserName = profile?.name || '사용자'
  const currentUserInitial = currentUserName.slice(0, 2).toUpperCase() || 'MS'
  const otherMembers = group.members.filter((member) =>
    profile?.id ? member.userId !== profile.id : member.nickName !== currentUserName,
  )

  return (
    <PlannerPageLayout step="group" errorMessage={group.errorMessage} hasError={group.hasError} isLoading={group.isLoading}>
      <PlannerGroupStep
        currentUserInitial={currentUserInitial}
        currentUserName={currentUserName}
        handleJoinPlanner={group.handleJoinPlanner}
        inviteCode={group.inviteCode}
        isInviteOpen={isInviteOpen}
        isSaving={group.isSaving}
        isSolo={group.isSolo}
        joinPlannerPending={group.joinPlannerPending}
        memberCount={group.memberCount}
        members={group.members}
        saveGroupSettings={group.saveGroupSettings}
        setInviteCode={group.setInviteCode}
        setIsInviteOpen={setIsInviteOpen}
        setIsSolo={group.setIsSolo}
        setMemberCount={group.setMemberCount}
      />
      {group.plannerDetail ? (
        <PlannerGroupManagementPanel
          otherMembers={otherMembers}
          isManagingMembers={group.isManagingMembers}
          canManagePlanner={group.canManagePlanner}
          onRemoveMember={group.handleRemovePlannerMember}
        />
      ) : null}
    </PlannerPageLayout>
  )
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

function PlannerPageLayout({
  children,
  errorMessage,
  hasError,
  isLoading,
  onNewTrip,
  step,
}: {
  children: ReactNode
  errorMessage: string
  hasError: boolean
  isLoading: boolean
  onNewTrip?: () => void
  step: PlannerStep
}) {
  return (
    <AppShell>
      <S.Page>
        <PlannerHeader
          onNewTrip={onNewTrip}
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
        ) : children}
      </S.Page>
    </AppShell>
  )
}
