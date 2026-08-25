import { createFileRoute } from '@tanstack/react-router'
import { MissionPage } from '@/widgets/mission'

export const Route = createFileRoute('/(app)/_authenticated/mission/')({ component: MissionPage })
