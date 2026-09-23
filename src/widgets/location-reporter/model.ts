export type LocationReportState = 'requesting' | 'shared' | 'denied' | 'unavailable' | 'failed'

export function startLocationReporting({
  onState,
  updateLocation,
}: {
  onState: (state: LocationReportState) => void
  updateLocation: (location: { latitude: number; longitude: number }) => Promise<unknown>
}) {
  let active = true
  let blocked = false
  let inFlight = false

  const report = () => {
    if (!active || blocked || inFlight || document.visibilityState !== 'visible') return
    const geolocation = navigator.geolocation
    if (!geolocation) {
      onState('unavailable')
      return
    }

    inFlight = true
    onState('requesting')
    try {
      geolocation.getCurrentPosition(
        (position) => {
          if (!active || document.visibilityState !== 'visible') {
            inFlight = false
            return
          }
          void updateLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude })
            .then(() => { if (active) onState('shared') })
            .catch(() => { if (active) onState('failed') })
            .finally(() => { inFlight = false })
        },
        (error) => {
          if (error.code === 1) blocked = true
          if (active) onState(error.code === 1 ? 'denied' : 'failed')
          inFlight = false
        },
        { enableHighAccuracy: false, maximumAge: 30_000, timeout: 15_000 },
      )
    } catch {
      inFlight = false
      onState('failed')
    }
  }

  const onVisibilityChange = () => {
    if (document.visibilityState === 'visible') report()
  }
  const initialRequest = window.setTimeout(report, 0)
  const interval = window.setInterval(report, 90_000)
  document.addEventListener('visibilitychange', onVisibilityChange)

  return {
    retry: () => { blocked = false; report() },
    stop: () => {
      active = false
      window.clearTimeout(initialRequest)
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisibilityChange)
    },
  }
}
