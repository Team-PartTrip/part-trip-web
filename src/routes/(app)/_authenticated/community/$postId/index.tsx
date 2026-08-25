import { createFileRoute } from '@tanstack/react-router'
import { CommunityDetailPage } from '@/widgets/community-detail'

export const Route = createFileRoute('/(app)/_authenticated/community/$postId/')({ component: CommunityDetailPage })
