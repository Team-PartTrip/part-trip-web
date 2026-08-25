import { createFileRoute } from '@tanstack/react-router'
import { RecordCameraDetailPage } from '@/widgets/record-camera'

export const Route = createFileRoute('/(app)/_authenticated/record/camera/$imageId/')({ component: RecordCameraDetailPage })
