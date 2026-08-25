import { createFileRoute } from '@tanstack/react-router'
import { PlannerGroupPage } from '@/widgets/planner'

export const Route = createFileRoute('/(app)/_authenticated/planner/group/')({ component: PlannerGroupPage })
