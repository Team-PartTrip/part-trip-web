import { createFileRoute } from '@tanstack/react-router'
import { TravelPreferencesPage } from '@/widgets/travel-preferences'

export const Route = createFileRoute('/(app)/_authenticated/profile/travel-preferences/')({ component: TravelPreferencesPage })
