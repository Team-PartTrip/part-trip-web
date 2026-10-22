import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deletePlanner, removePlannerMember, plannerQueryKeys, useRemovePlannerMemberMutation, type PlannerDetailResponseDto, type PlannerMemberResponseDto } from '@/entities/planner'
import { travelQueryKeys } from '@/entities/travel'
import { tripCardQueryKeys } from '@/entities/trip-card'
import { useUserProfileQuery } from '@/entities/user'
import { paths } from '@/shared/config'
import { Button } from '@/shared/ui/parttrip'
import { getErrorMessage } from '@/shared/utils'
import { canManagePlanner, isPlannerFinished } from '../model/planner-role'
import { plannerMatchesTab } from '../model/status'
import { clearPlannerSession } from '../model/planner-session'
import { PlannerGroupManagementPanel } from './PlannerGroupManagementPanel'
import * as S from './PlannerPage.styles'

export function PlannerMemberManagement({ plannerId, detail, members }: { plannerId: number; detail?: PlannerDetailResponseDto; members: PlannerMemberResponseDto[] }) {
  const { data: profile } = useUserProfileQuery()
  const navigate = useNavigate()
  const client = useQueryClient()
  const remove = useRemovePlannerMemberMutation()
  const [error, setError] = useState('')
  const owner = canManagePlanner(detail?.role)
  const canLeave = detail?.role?.toUpperCase() === 'MEMBER' && Boolean(profile?.id)
    && plannerMatchesTab(detail?.status, detail?.startDate, detail?.endDate, 'planned')
  const exit = useMutation({
    mutationFn: async () => {
      if (owner) await deletePlanner(plannerId)
      else if (canLeave && profile?.id) await removePlannerMember(plannerId, profile.id)
      else throw new Error('플래너에서 나갈 수 없어요.')
    },
    onSuccess: async () => {
      clearPlannerSession()
      await navigate({ to: paths.planner, replace: true })
      client.removeQueries({ predicate: query => query.queryKey[0] === 'planners' && query.queryKey[2] === plannerId })
      await Promise.all([
        client.invalidateQueries({ queryKey: plannerQueryKeys.list() }),
        client.invalidateQueries({ queryKey: travelQueryKeys.dday() }),
        client.invalidateQueries({ queryKey: tripCardQueryKeys.all }),
      ])
    },
    onError: reason => setError(getErrorMessage(reason)),
  })
  return <>
    <h2>함께하는 사람 {members.length}명</h2>
    <PlannerGroupManagementPanel otherMembers={members} canManagePlanner={owner && !isPlannerFinished(detail?.status) && !exit.isPending} isManagingMembers={remove.isPending || exit.isPending} onRemoveMember={async userId => {
      if (!userId || userId === profile?.id) return
      setError('')
      try { await remove.mutateAsync({ plannerId, memberUserId: userId }) } catch (reason) { setError(getErrorMessage(reason)) }
    }} />
    {owner || canLeave ? <S.PlanActions><Button type="button" $variant="secondary" disabled={exit.isPending || remove.isPending} onClick={() => {
      if (!window.confirm(owner ? '플래너와 함께하는 사람의 일정이 삭제돼요. 여행카드 기록은 남아요. 삭제할까요?' : '이 플래너에서 나가면 내 여행카드와 사진·장소 기록이 함께 삭제돼요. 다시 참여해도 기록은 복구되지 않아요. 나갈까요?')) return
      setError('')
      exit.mutate()
    }}>{exit.isPending ? '처리 중…' : owner ? '플래너 삭제' : '플래너 나가기'}</Button></S.PlanActions> : null}
    {error ? <p role="alert">{error}</p> : null}
  </>
}
