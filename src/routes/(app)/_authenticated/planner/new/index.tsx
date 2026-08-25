import { createFileRoute } from '@tanstack/react-router'
import { PlannerCreatePage } from '@/widgets/planner'

export const Route = createFileRoute('/(app)/_authenticated/planner/new/')({ component: PlannerCreatePage })
