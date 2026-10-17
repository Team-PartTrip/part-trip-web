import { useState } from 'react'
import { useRemovePlannerMemberMutation, type PlannerDetailResponseDto, type PlannerMemberResponseDto } from '@/entities/planner'
import { useUserProfileQuery } from '@/entities/user'
import { getErrorMessage } from '@/shared/utils'
import { canManagePlanner } from '../model/planner-role'
import { isPlannerFinished } from '../model/usePlannerLiveMembers'
import { PlannerGroupManagementPanel } from './PlannerGroupManagementPanel'

export function PlannerMemberManagement({ plannerId, detail, members }: { plannerId: number; detail?: PlannerDetailResponseDto; members: PlannerMemberResponseDto[] }) {
  const { data: profile } = useUserProfileQuery()
  const remove = useRemovePlannerMemberMutation()
  const [error, setError] = useState('')
  if (!canManagePlanner(detail?.role) || isPlannerFinished(detail?.status)) return null
  return <>
    <PlannerGroupManagementPanel otherMembers={members.filter(member => member.role?.toUpperCase() !== 'OWNER' && (!profile?.id || member.userId !== profile.id))} canManagePlanner isManagingMembers={remove.isPending} onRemoveMember={async userId => {
      if (!userId) return
      setError('')
      try { await remove.mutateAsync({ plannerId, memberUserId: userId }) } catch (reason) { setError(getErrorMessage(reason)) }
    }} />
    {error ? <p role="alert">{error}</p> : null}
  </>
}
