import { createFileRoute } from '@tanstack/react-router'
import { RecordDetailPage } from '@/widgets/record-detail'

export const Route = createFileRoute('/(app)/_authenticated/record/$recordId/')({ component: RecordDetailPage })
