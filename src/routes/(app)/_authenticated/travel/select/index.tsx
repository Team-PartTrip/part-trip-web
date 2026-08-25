import { createFileRoute } from '@tanstack/react-router'
import { TravelSelectPage } from '@/widgets/travel-select'

export const Route = createFileRoute('/(app)/_authenticated/travel/select/')({ component: TravelSelectPage })
