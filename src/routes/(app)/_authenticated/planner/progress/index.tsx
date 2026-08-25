import { createFileRoute } from '@tanstack/react-router'
import { PlannerProgressPage } from '@/widgets/planner'

export const Route = createFileRoute('/(app)/_authenticated/planner/progress/')({ component: PlannerProgressPage })
