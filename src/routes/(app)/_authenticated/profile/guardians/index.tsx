import { createFileRoute } from '@tanstack/react-router'
import { GuardiansPage } from '@/widgets/guardians'

export const Route = createFileRoute('/(app)/_authenticated/profile/guardians/')({ component: GuardiansPage })
