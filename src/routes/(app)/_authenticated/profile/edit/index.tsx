import { createFileRoute } from '@tanstack/react-router'
import { ProfileEditPage } from '@/widgets/profile-edit'

export const Route = createFileRoute('/(app)/_authenticated/profile/edit/')({ component: ProfileEditPage })
