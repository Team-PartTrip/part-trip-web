import { queryOptions, useQuery } from '@tanstack/react-query'
import { getGuideCameraResult } from './api'
import { travelRecordQueryKeys } from './query-keys'

export const guideCameraQueryOptions = (imageId: number) =>
  queryOptions({
    queryKey: travelRecordQueryKeys.camera(imageId),
    queryFn: () => getGuideCameraResult(imageId),
    enabled: Number.isInteger(imageId),
  })

export function useGuideCameraResultQuery(imageId: number) {
  return useQuery(guideCameraQueryOptions(imageId))
}
