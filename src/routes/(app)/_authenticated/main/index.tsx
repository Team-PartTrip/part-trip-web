import { createFileRoute } from '@tanstack/react-router'
import { MainPage } from '@/widgets/main'

export const Route = createFileRoute('/(app)/_authenticated/main/')({ component: MainPage })
