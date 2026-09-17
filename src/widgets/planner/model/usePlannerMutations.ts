import {
  useAcceptPlannerInvitationMutation,
  useCancelPlaceVoteMutation,
  useCastBallotMutation,
  useCastPlaceVoteMutation,
  useCloseVoteMutation,
  useConfirmPlannerMutation,
  useCreatePlannerMutation,
  useDeletePlannerMutation,
  useDeleteVoteOptionMutation,
  useCancelPlannerInvitationMutation,
  useJoinPlannerMutation,
  useRemovePlannerMemberMutation,
  useRejectPlannerInvitationMutation,
  useRemindPlannerMembersMutation,
  useUpdatePlannerMutation,
} from '@/entities/planner'

export function usePlannerMutations() {
  const createPlannerMutation = useCreatePlannerMutation()
  const joinPlannerMutation = useJoinPlannerMutation()
  const updatePlannerMutation = useUpdatePlannerMutation()
  const acceptPlannerInvitationMutation = useAcceptPlannerInvitationMutation()
  const rejectPlannerInvitationMutation = useRejectPlannerInvitationMutation()
  const cancelPlannerInvitationMutation = useCancelPlannerInvitationMutation()
  const removePlannerMemberMutation = useRemovePlannerMemberMutation()
  const deletePlannerMutation = useDeletePlannerMutation()
  const remindPlannerMembersMutation = useRemindPlannerMembersMutation()
  const confirmPlannerMutation = useConfirmPlannerMutation()
  const cancelPlaceVoteMutation = useCancelPlaceVoteMutation()
  const castBallotMutation = useCastBallotMutation()
  const castPlaceVoteMutation = useCastPlaceVoteMutation()
  const closeVoteMutation = useCloseVoteMutation()
  const deleteVoteOptionMutation = useDeleteVoteOptionMutation()

  return {
    acceptPlannerInvitationMutation,
    cancelPlannerInvitationMutation,
    cancelPlaceVoteMutation,
    castBallotMutation,
    castPlaceVoteMutation,
    closeVoteMutation,
    confirmPlannerMutation,
    createPlannerMutation,
    deletePlannerMutation,
    deleteVoteOptionMutation,
    joinPlannerMutation,
    remindPlannerMembersMutation,
    rejectPlannerInvitationMutation,
    removePlannerMemberMutation,
    updatePlannerMutation,
    isSaving: createPlannerMutation.isPending || updatePlannerMutation.isPending,
  }
}
