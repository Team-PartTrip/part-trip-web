import { createFileRoute } from '@tanstack/react-router'
import { TripCardsPage } from '@/widgets/trip-cards'

export const Route = createFileRoute('/(app)/_authenticated/trip-cards/')({ component: TripCardsPage })
