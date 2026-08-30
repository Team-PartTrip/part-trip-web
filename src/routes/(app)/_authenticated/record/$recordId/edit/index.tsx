import { createFileRoute } from '@tanstack/react-router'
import { RecordCommentEditPage } from '@/widgets/record-detail'

type RecordEditSearch = { entryId?: string }

export const Route = createFileRoute('/(app)/_authenticated/record/$recordId/edit/')({
  validateSearch: (search: Record<string, unknown>): RecordEditSearch => ({
    entryId: typeof search.entryId === 'string' ? search.entryId : undefined,
  }),
  component: RecordCommentEditPage,
})
