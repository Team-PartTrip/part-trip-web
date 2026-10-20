import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useGuardianLinksQuery, useUpdateCurrentLocationMutation } from '@/entities/guardian'
import { useDdayQuery } from '@/entities/travel'
import { startLocationReporting, type LocationReportState } from '../model'
import { LocationSharingContext } from '../context'

export function LocationReporter({ children }: { children?: ReactNode }) {
  const trip = useDdayQuery()
  const guardians = useGuardianLinksQuery()
  const mutation = useUpdateCurrentLocationMutation()
  const mutationRef = useRef(mutation.mutateAsync)
  const reporterRef = useRef<ReturnType<typeof startLocationReporting> | undefined>(undefined)
  const [enabled, setEnabled] = useState(false)
  const [state, setState] = useState<LocationReportState>()
  const available = trip.data?.status === 'DURING' && !trip.isError && !guardians.isError && Boolean(guardians.data?.length)

  useEffect(() => { mutationRef.current = mutation.mutateAsync }, [mutation.mutateAsync])
  useEffect(() => {
    if (!enabled || !available) return
    const reporter = startLocationReporting({
      onState: setState,
      updateLocation: (location) => mutationRef.current(location),
    })
    reporterRef.current = reporter
    return () => {
      reporter.stop()
      if (reporterRef.current === reporter) reporterRef.current = undefined
    }
  }, [available, enabled])

  return <LocationSharingContext value={{ enabled, state: enabled && available ? state : undefined, available,
    toggle: () => {
      reporterRef.current?.stop()
      setState(undefined)
      setEnabled(current => !current)
    },
    retry: () => reporterRef.current?.retry(),
  }}>{children}</LocationSharingContext>
}
