import { createFileRoute } from '@tanstack/react-router'
import { CommunityPage } from '@/widgets/community'

export const Route = createFileRoute('/(app)/_authenticated/community/')({ component: CommunityPage })
