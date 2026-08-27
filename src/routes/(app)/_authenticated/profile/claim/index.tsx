import { createFileRoute } from '@tanstack/react-router'
import { ProfileInsightPage } from '@/widgets/profile-insights'

export const Route = createFileRoute('/(app)/_authenticated/profile/claim/')({ component: ProfileClaimRoute })

function ProfileClaimRoute() {
  return <ProfileInsightPage kind="claim" />
}
