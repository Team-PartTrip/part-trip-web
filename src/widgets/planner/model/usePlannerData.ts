import {
  useMyPlannersQuery,
  usePlannerDetailQuery,
  usePlannerInvitationsQuery,
  usePlannerMembersQuery,
} from '@/entities/planner'
import { isPositiveSafeInteger } from '@/shared/utils'

import type { PlannerStep } from './types'

export function usePlannerData(
  step: PlannerStep,
  activePlannerId: number,
) {
  const hasActivePlanner = isPositiveSafeInteger(activePlannerId)
  const needsPlannerDetail = hasActivePlanner && step === 'group'
  const needsMembers = step === 'group'
  const needsInvitations = step === 'group'
  const plannersQuery = useMyPlannersQuery(step === 'list')
  const plannerDetailQuery = usePlannerDetailQuery(
    activePlannerId,
    needsPlannerDetail,
  )
  const plannerMembersQuery = usePlannerMembersQuery(activePlannerId, needsMembers)
  const plannerInvitationsQuery = usePlannerInvitationsQuery(needsInvitations)

  return {
    hasError:
      plannersQuery.isError ||
      plannerDetailQuery.isError ||
      (needsMembers && plannerMembersQuery.isError),
    isLoading:
      plannersQuery.isLoading ||
      plannerDetailQuery.isLoading ||
      (needsMembers && plannerMembersQuery.isLoading),
    plannerDetail: plannerDetailQuery.data,
    planners: plannersQuery.data ?? [],
    members: plannerMembersQuery.data ?? [],
    invitations: plannerInvitationsQuery.data ?? [],
    invitationError: plannerInvitationsQuery.isError,
    invitationLoading: plannerInvitationsQuery.isLoading,
  }
}
