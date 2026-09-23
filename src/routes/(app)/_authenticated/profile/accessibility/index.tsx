import { createFileRoute } from '@tanstack/react-router'
import { ProfileAccessibilityPage } from '@/widgets/profile-accessibility'

export const Route = createFileRoute('/(app)/_authenticated/profile/accessibility/')({ component: ProfileAccessibilityPage })
