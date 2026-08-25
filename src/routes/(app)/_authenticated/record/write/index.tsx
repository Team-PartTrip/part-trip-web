import { createFileRoute } from '@tanstack/react-router'
import { RecordWritePage } from '@/widgets/record-write'

export const Route = createFileRoute('/(app)/_authenticated/record/write/')({ component: RecordWritePage })
