import { useEffect, useState } from 'react'
import { getMyTrips, type TripPlanResponseDto } from '@shared/api'

export function useMyTrips() {
  const [trips, setTrips] = useState<TripPlanResponseDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let isMounted = true

    void getMyTrips()
      .then((nextTrips) => { if (isMounted) setTrips(nextTrips) })
      .catch(() => { if (isMounted) setHasError(true) })
      .finally(() => { if (isMounted) setIsLoading(false) })

    return () => { isMounted = false }
  }, [])

  return { hasError, isLoading, trips }
}
