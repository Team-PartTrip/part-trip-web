import { createFileRoute } from '@tanstack/react-router'
import { PlannerLineupPage } from '@/widgets/planner'

export const Route = createFileRoute('/(app)/_authenticated/planner/lineup/')({ component: PlannerLineupPage })
