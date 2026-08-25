import { createFileRoute } from '@tanstack/react-router'
import { NotificationPage } from '@/widgets/notifications'

export const Route = createFileRoute('/(app)/_authenticated/notifications/')({ component: NotificationPage })
