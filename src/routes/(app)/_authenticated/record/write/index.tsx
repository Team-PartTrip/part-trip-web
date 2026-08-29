import { createFileRoute } from '@tanstack/react-router'
import { TripCardCreatePage } from '@/widgets/trip-cards'

export const Route = createFileRoute('/(app)/_authenticated/record/write/')({ component: TripCardCreatePage })
