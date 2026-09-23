import {
  useAcceptPlannerInvitationMutation,
  useCancelPlannerInvitationMutation,
  useCreatePlannerMutation,
  useJoinPlannerMutation,
  useRejectPlannerInvitationMutation,
  useRemovePlannerMemberMutation,
} from '@/entities/planner'

export function usePlannerMutations() {
  const createPlannerMutation = useCreatePlannerMutation()

  return {
    acceptPlannerInvitationMutation: useAcceptPlannerInvitationMutation(),
    cancelPlannerInvitationMutation: useCancelPlannerInvitationMutation(),
    createPlannerMutation,
    joinPlannerMutation: useJoinPlannerMutation(),
    rejectPlannerInvitationMutation: useRejectPlannerInvitationMutation(),
    removePlannerMemberMutation: useRemovePlannerMemberMutation(),
    isSaving: createPlannerMutation.isPending,
  }
}
