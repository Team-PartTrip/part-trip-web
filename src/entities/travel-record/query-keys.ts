export const travelRecordQueryKeys = {
  all: ['travel-record'] as const,
  camera: (imageId: number) => [...travelRecordQueryKeys.all, 'camera', imageId] as const,
}
