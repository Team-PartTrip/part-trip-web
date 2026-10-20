import { createContext, useContext } from 'react'
import type { LocationReportState } from './model'

export const LocationSharingContext = createContext({
  enabled: false,
  state: undefined as LocationReportState | undefined,
  available: false,
  toggle: () => {},
  retry: () => {},
})
export const useLocationSharing = () => useContext(LocationSharingContext)
