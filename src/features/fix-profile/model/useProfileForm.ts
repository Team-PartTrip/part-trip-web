import { useCallback, useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useForm, useWatch, type SubmitHandler } from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'
import { type UserProfile, useUpdateProfileMutation, useUploadProfileImageMutation } from '@/entities/user'
import { paths } from '@/shared/config'
import { useLockBodyScroll } from '@/shared/hooks'

import {
  getNicknameError,
  isProfileImageSizeAllowed,
  isSupportedProfileImageType,
} from './profileForm'

type ProfileFormValues = {
  name: string
}

export function useProfileForm(profile: UserProfile) {
  const navigate = useNavigate()
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const photoSelectionVersionRef = useRef(0)
  const [avatarPreview, setAvatarPreview] = useState(profile.avatarUrl ?? '')
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const updateProfileMutation = useUpdateProfileMutation()
  const uploadProfileImageMutation = useUploadProfileImageMutation()
  const { register, handleSubmit, formState, control } = useForm<ProfileFormValues>({
    defaultValues: {
      name: profile.name || '',
    },
  })
  const previewName = useWatch({ control, name: 'name' })
  const nameField = register('name', {
    validate: (value) => getNicknameError(value) ?? true,
  })

  useLockBodyScroll()

  const close = useCallback(() => {
    if (formState.isSubmitting) return
    navigate({ to: paths.profile })
  }, [formState.isSubmitting, navigate])

  useEffect(() => {
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [close])

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectionVersion = ++photoSelectionVersionRef.current
    const file = event.target.files?.[0]
    if (!file) return

    setPhotoError(null)
    if (!isSupportedProfileImageType(file.type)) {
      setPhotoError('JPG, PNG, WEBP 형식의 이미지만 선택할 수 있습니다.')
      event.target.value = ''
      return
    }
    if (!isProfileImageSizeAllowed(file.size)) {
      setPhotoError('프로필 사진은 2MB 이하로 선택해주세요.')
      event.target.value = ''
      return
    }

    const reader = new FileReader()
    reader.addEventListener('load', () => {
      if (selectionVersion !== photoSelectionVersionRef.current) return
      if (typeof reader.result === 'string') setAvatarPreview(reader.result)
    })
    reader.addEventListener('error', () => {
      if (selectionVersion !== photoSelectionVersionRef.current) return
      setPhotoError('사진을 불러오지 못했습니다. 다시 선택해주세요.')
    })
    reader.readAsDataURL(file)
    setSelectedPhoto(file)
  }

  const handleResetPhoto = () => {
    photoSelectionVersionRef.current += 1
    setAvatarPreview('')
    setSelectedPhoto(null)
    setPhotoError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onSubmit: SubmitHandler<ProfileFormValues> = async (values) => {
    try {
      setErrorMessage(null)
      const uploadedUrl = selectedPhoto
        ? await uploadProfileImageMutation.mutateAsync(selectedPhoto)
        : undefined
      await updateProfileMutation.mutateAsync({
        imgUrl: selectedPhoto ? uploadedUrl : avatarPreview || undefined,
        nickName: values.name.trim(),
      })
      navigate({ to: paths.profile, replace: true })
    } catch {
      setErrorMessage('프로필을 저장하지 못했습니다. 다시 시도해주세요.')
    }
  }

  return {
    avatarPreview,
    close,
    closeButtonRef,
    errorMessage,
    fileInputRef,
    formState,
    handlePhotoChange,
    handleResetPhoto,
    onSubmit: handleSubmit(onSubmit),
    nameField,
    photoError,
    previewName,
  }
}
