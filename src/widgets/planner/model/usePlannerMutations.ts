import {
  useCreatePlannerMutation,
  useJoinPlannerMutation,
  useRemovePlannerMemberMutation,
} from '@/entities/planner'

export function usePlannerMutations() {
  const createPlannerMutation = useCreatePlannerMutation()

  return {
    createPlannerMutation,
    joinPlannerMutation: useJoinPlannerMutation(),
    removePlannerMemberMutation: useRemovePlannerMemberMutation(),
    isSaving: createPlannerMutation.isPending,
  }
}
