import {
  useAcceptPlannerInvitationMutation,
  useAddPlannerPlacesMutation,
  useAddVoteOptionMutation,
  useCastBallotMutation,
  useCloseVoteMutation,
  useConfirmVoteMutation,
  useConfirmPlannerMutation,
  useCreatePlannerMutation,
  useCreateVoteMutation,
  useDeletePlannerMutation,
  useDeleteVoteOptionMutation,
  useCancelPlannerInvitationMutation,
  useJoinPlannerMutation,
  useRemovePlannerMemberMutation,
  useRejectPlannerInvitationMutation,
  useRemindPlannerMembersMutation,
  useSelectRandomPlannerPlaceMutation,
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
  const addPlannerPlacesMutation = useAddPlannerPlacesMutation()
  const addVoteOptionMutation = useAddVoteOptionMutation()
  const deletePlannerMutation = useDeletePlannerMutation()
  const remindPlannerMembersMutation = useRemindPlannerMembersMutation()
  const selectRandomPlannerPlaceMutation = useSelectRandomPlannerPlaceMutation()
  const confirmPlannerMutation = useConfirmPlannerMutation()
  const createVoteMutation = useCreateVoteMutation()
  const castBallotMutation = useCastBallotMutation()
  const closeVoteMutation = useCloseVoteMutation()
  const confirmVoteMutation = useConfirmVoteMutation()
  const deleteVoteOptionMutation = useDeleteVoteOptionMutation()

  return {
    acceptPlannerInvitationMutation,
    addPlannerPlacesMutation,
    addVoteOptionMutation,
    cancelPlannerInvitationMutation,
    castBallotMutation,
    closeVoteMutation,
    confirmPlannerMutation,
    createVoteMutation,
    confirmVoteMutation,
    createPlannerMutation,
    deletePlannerMutation,
    deleteVoteOptionMutation,
    joinPlannerMutation,
    remindPlannerMembersMutation,
    rejectPlannerInvitationMutation,
    removePlannerMemberMutation,
    selectRandomPlannerPlaceMutation,
    updatePlannerMutation,
    isSaving: createPlannerMutation.isPending || updatePlannerMutation.isPending,
  }
}
