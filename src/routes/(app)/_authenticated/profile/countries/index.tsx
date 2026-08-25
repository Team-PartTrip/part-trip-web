import { createFileRoute } from '@tanstack/react-router'
import { ProfileInsightPage } from '@/widgets/profile-insights'

export const Route = createFileRoute('/(app)/_authenticated/profile/countries/')({ component: ProfileCountriesRoute })

function ProfileCountriesRoute() {
  return <ProfileInsightPage kind="countries" />
}
