import { createFileRoute } from '@tanstack/react-router'
import { ProfileInsightPage } from '@/widgets/profile-insights'

export const Route = createFileRoute('/(app)/_authenticated/profile/achievements/')({ component: ProfileAchievementsRoute })

function ProfileAchievementsRoute() {
  return <ProfileInsightPage kind="achievements" />
}
