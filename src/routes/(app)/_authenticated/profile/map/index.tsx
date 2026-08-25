import { createFileRoute } from '@tanstack/react-router'
import { ProfileInsightPage } from '@/widgets/profile-insights'

export const Route = createFileRoute('/(app)/_authenticated/profile/map/')({ component: ProfileMapRoute })

function ProfileMapRoute() {
  return <ProfileInsightPage kind="map" />
}
