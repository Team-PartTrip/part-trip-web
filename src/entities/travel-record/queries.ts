import { queryOptions, useQuery } from '@tanstack/react-query'
import { getGuideCameraResult } from './api'

export const guideCameraQueryOptions = (imageId: number) =>
  queryOptions({
    queryKey: ['travel-record', 'camera', imageId] as const,
    queryFn: () => getGuideCameraResult(imageId),
    enabled: Number.isInteger(imageId),
  })

export function useGuideCameraResultQuery(imageId: number) {
  return useQuery(guideCameraQueryOptions(imageId))
}
