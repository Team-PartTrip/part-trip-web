import { createFileRoute } from '@tanstack/react-router'
import { CommunityWritePage } from '@/widgets/community-write'

export const Route = createFileRoute('/(app)/_authenticated/community/write/')({ component: CommunityWritePage })
