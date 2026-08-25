import { createFileRoute } from '@tanstack/react-router'
import { RecordPage } from '@/widgets/record'

export const Route = createFileRoute('/(app)/_authenticated/record/')({ component: RecordPage })
