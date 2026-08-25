import { createFileRoute } from '@tanstack/react-router'
import { RecordMapPage } from '@/widgets/record-map'

export const Route = createFileRoute('/(app)/_authenticated/record/map/')({ component: RecordMapPage })
