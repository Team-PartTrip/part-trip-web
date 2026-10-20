import { useState, type ReactNode, type FormEvent } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useJoinPlannerMutation } from '@/entities/planner'
import { getErrorMessage, isPositiveSafeInteger } from '@/shared/utils'
import { activatePlannerSession } from '../model/planner-session'
import { parsePlannerInviteCode } from '../model/invite-code'
import { useUserProfileQuery } from '@/entities/user'
import { Button, Input } from '@/shared/ui/parttrip'
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
  const navigate = useNavigate()
  const join = useJoinPlannerMutation()
  const [invite, setInvite] = useState('')
  const [joinError, setJoinError] = useState('')
  const joinPlanner = async (event: FormEvent) => {
    event.preventDefault()
    const inviteCode = parsePlannerInviteCode(invite)
    if (!inviteCode) { setJoinError('초대 코드 또는 초대 링크를 확인해주세요.'); return }
    setJoinError('')
    try {
      const result = await join.mutateAsync({ inviteCode })
      if (!isPositiveSafeInteger(result.plannerId)) throw new Error('참여한 플래너를 확인하지 못했어요.')
      activatePlannerSession(result.plannerId)
      await navigate({ to: '/planner/$plannerId', params: { plannerId: String(result.plannerId) } })
    } catch (error) { setJoinError(getErrorMessage(error)) }
  }
  const [plannerTab, setPlannerTab] = useState<PlannerTab>('planned')

  return (
    <PlannerPageLayout onRetry={() => void planner.refetch()} isRetrying={planner.isFetching} step="list" onNewTrip={planner.handleStartNewPlanner} errorMessage={planner.errorMessage} hasError={planner.hasError} isLoading={planner.isLoading}>
      <S.JoinForm onSubmit={event => void joinPlanner(event)}>
        <label htmlFor="planner-invite">초대받은 여행에 참여하기</label>
        <div><Input id="planner-invite" placeholder="초대 코드 또는 링크" value={invite} onChange={event => setInvite(event.target.value)} required /><Button type="submit" disabled={join.isPending}>{join.isPending ? '참여 중…' : '참여하기'}</Button></div>
        {joinError ? <S.Error role="alert">{joinError}</S.Error> : null}
      </S.JoinForm>
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
  const currentUserName = profile?.name || '사용자'
  const otherMembers = group.members.filter((member) =>
    profile?.id ? member.userId !== profile.id : member.nickName !== currentUserName,
  )

  return (
    <PlannerPageLayout onRetry={() => void group.refetch()} isRetrying={group.isFetching} step="group" errorMessage={group.errorMessage} hasError={group.hasError} isLoading={group.isLoading}>
      <PlannerGroupStep
        currentUserImageUrl={profile?.avatarUrl}
        currentUserName={currentUserName}
        isSaving={group.isSaving}
        isSolo={group.isSolo}
        memberCount={group.memberCount}
        members={group.members}
        saveGroupSettings={group.saveGroupSettings}
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
  onRetry,
  isRetrying,
  children,
  errorMessage,
  hasError,
  isLoading,
  onNewTrip,
  step,
}: {
  onRetry: () => void
  isRetrying: boolean
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
            <p role="status">여행 계획을 불러오는 중이에요.</p>
            <S.LoadingBody />
          </S.LoadingLayout>
        ) : hasError ? (
          <S.State role="alert">플래너 정보를 불러오지 못했어요. <Button type="button" disabled={isRetrying} onClick={onRetry}>다시 시도</Button></S.State>
        ) : children}
      </S.Page>
    </AppShell>
  )
}
