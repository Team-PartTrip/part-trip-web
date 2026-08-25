import { createFileRoute } from '@tanstack/react-router'
import { PlannerPlacePage } from '@/widgets/planner'

export const Route = createFileRoute('/(app)/_authenticated/planner/place/$placeId/')({ component: PlannerPlacePage })
