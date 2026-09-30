import type { ProfileInsightKind } from '../model/profile-insight'
import { ProfileAchievementsPage } from './ProfileAchievementsPage'
import { ProfileCountriesPage } from './ProfileCountriesPage'
import { ProfileMapPage } from './ProfileMapPage'

export type { ProfileInsightKind } from '../model/profile-insight'

export function ProfileInsightPage({ kind }: { kind: ProfileInsightKind }) {
  if (kind === 'map') return <ProfileMapPage />
  if (kind === 'countries') return <ProfileCountriesPage />
  return <ProfileAchievementsPage />
}
