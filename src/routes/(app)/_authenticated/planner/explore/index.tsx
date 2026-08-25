import { createFileRoute } from '@tanstack/react-router'
import { PlannerExplorePage } from '@/widgets/planner'

export const Route = createFileRoute('/(app)/_authenticated/planner/explore/')({ component: PlannerExplorePage })
