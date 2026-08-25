import { createFileRoute } from '@tanstack/react-router'
import { TripCardCreatePage } from '@/widgets/trip-cards'

export const Route = createFileRoute('/(app)/_authenticated/trip-cards/new/')({ component: TripCardCreatePage })
