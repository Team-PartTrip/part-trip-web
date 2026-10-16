import { createFileRoute } from '@tanstack/react-router'
import { PlannerAiFlow } from '@/widgets/planner/ui/PlannerAiFlow'

export const Route = createFileRoute('/(app)/_authenticated/planner/$plannerId/')({ component: PlannerDetailRoute })

function PlannerDetailRoute() {
  const { plannerId } = Route.useParams()
  return <PlannerAiFlow step="schedule" plannerId={Number(plannerId)} />
}
