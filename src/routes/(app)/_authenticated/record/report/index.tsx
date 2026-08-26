import { createFileRoute } from '@tanstack/react-router'

import { RecordReportPage } from '@/widgets/record-report'

export const Route = createFileRoute('/(app)/_authenticated/record/report/')({ component: RecordReportPage })
