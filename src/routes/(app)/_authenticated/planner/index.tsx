import { createFileRoute } from '@tanstack/react-router'
import { PlannerPage } from '@/widgets/planner'

export const Route = createFileRoute('/(app)/_authenticated/planner/')({ component: PlannerPage })
