import { createFileRoute } from '@tanstack/react-router'
import { TripCardDeletePage } from '@/widgets/trip-cards'

export const Route = createFileRoute('/(app)/_authenticated/trip-cards/delete/')({ component: TripCardDeletePage })
