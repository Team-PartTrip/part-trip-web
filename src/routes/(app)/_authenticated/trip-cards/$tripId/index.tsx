import { createFileRoute } from '@tanstack/react-router'
import { TripCardDetailPage } from '@/widgets/trip-cards'

export const Route = createFileRoute('/(app)/_authenticated/trip-cards/$tripId/')({ component: TripCardDetailPage })
