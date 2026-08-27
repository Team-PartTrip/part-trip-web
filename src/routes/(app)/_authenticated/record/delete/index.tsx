import { createFileRoute } from '@tanstack/react-router'
import { RecordDeletePage } from '@/widgets/record'

export const Route = createFileRoute('/(app)/_authenticated/record/delete/')({ component: RecordDeletePage })
