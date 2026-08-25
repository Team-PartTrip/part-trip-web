import { createFileRoute } from '@tanstack/react-router'
import { ProfilePage } from '@/widgets/profile'

export const Route = createFileRoute('/(app)/_authenticated/profile/')({ component: ProfilePage })
