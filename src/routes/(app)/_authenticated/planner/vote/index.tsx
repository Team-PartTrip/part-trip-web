import { createFileRoute } from '@tanstack/react-router'
import { PlannerVotePage } from '@/widgets/planner'

export const Route = createFileRoute('/(app)/_authenticated/planner/vote/')({ component: PlannerVotePage })
