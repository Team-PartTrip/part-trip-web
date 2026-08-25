import { createFileRoute } from '@tanstack/react-router'
import { RecordCameraPage } from '@/widgets/record-camera'

export const Route = createFileRoute('/(app)/_authenticated/record/camera/')({ component: RecordCameraPage })
