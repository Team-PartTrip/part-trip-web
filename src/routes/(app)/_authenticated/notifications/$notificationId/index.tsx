import { createFileRoute } from '@tanstack/react-router'
import { NotificationDetailPage } from '@/widgets/notifications'

export const Route = createFileRoute('/(app)/_authenticated/notifications/$notificationId/')({ component: NotificationDetailPage })
