import { createFileRoute } from '@tanstack/react-router'
import { RecordCalendarPage } from '@/widgets/record-calendar'

export const Route = createFileRoute('/(app)/_authenticated/record/calendar/')({ component: RecordCalendarPage })
