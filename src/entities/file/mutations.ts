import { useMutation } from '@tanstack/react-query'

import { uploadImage } from './api'

export function useUploadImageMutation() {
  return useMutation({
    mutationFn: (file: File) => uploadImage(file),
  })
}
