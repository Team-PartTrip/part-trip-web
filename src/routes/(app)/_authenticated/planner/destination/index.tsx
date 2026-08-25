import { createFileRoute } from '@tanstack/react-router'
import { PlannerDestinationPage } from '@/widgets/planner'

export const Route = createFileRoute('/(app)/_authenticated/planner/destination/')({ component: PlannerDestinationPage })
