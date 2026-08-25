import { useNavigate } from '@/shared/libs/router'
import { paths } from '@/shared/config'
import { AppShell } from '@/widgets/app-shell'
import { DestinationSelector } from '@/widgets/destination-selector'

export function TravelSelectPage() {
  const navigate = useNavigate()
  return (
    <AppShell>
      <DestinationSelector onBack={() => navigate(paths.main)} />
    </AppShell>
  )
}
