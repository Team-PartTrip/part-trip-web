import { createFileRoute } from '@tanstack/react-router'
import { NotificationSettingsPage } from '@/widgets/notifications'

export const Route = createFileRoute('/(app)/_authenticated/settings/notifications/')({ component: NotificationSettingsPage })
