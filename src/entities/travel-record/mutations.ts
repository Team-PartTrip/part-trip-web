import { useMutation } from '@tanstack/react-query'

import {
  saveGuideCameraRecord,
  uploadGuideCameraImage,
  type GuideCameraRecordRequestDto,
  type GuideCameraUploadRequestDto,
} from './api'

export function useUploadGuideCameraImageMutation() {
  return useMutation({
    mutationFn: (payload: GuideCameraUploadRequestDto) => uploadGuideCameraImage(payload),
  })
}

export function useSaveGuideCameraRecordMutation() {
  return useMutation({
    mutationFn: (payload: GuideCameraRecordRequestDto) => saveGuideCameraRecord(payload),
  })
}
