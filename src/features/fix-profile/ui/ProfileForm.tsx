import { useCallback, useEffect, useRef, useState } from 'react'
import { useForm, useWatch, type SubmitHandler } from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'
import { type UserProfile, useUpdateProfileMutation } from '@/entities/user'
import { useUploadImageMutation } from '@/entities/file'
import { paths } from '@/shared/config'
import { useLockBodyScroll } from '@/shared/hooks'

import {
  getNicknameError,
  isProfileImageSizeAllowed,
  isSupportedProfileImageType,
} from '../model/profileForm'
import * as S from './ProfileForm.styles'

type ProfileFormProps = {
  onCancel?: () => void
  onSaved?: (profile: UserProfile) => void
  profile: UserProfile
}

type ProfileFormValues = {
  name: string
}

export function ProfileForm({ onCancel, onSaved, profile }: ProfileFormProps) {
  const navigate = useNavigate()
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarPreview, setAvatarPreview] = useState(profile.avatarUrl ?? '')
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null)
  const [photoError, setPhotoError] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const updateProfileMutation = useUpdateProfileMutation()
  const uploadImageMutation = useUploadImageMutation()
  const { register, handleSubmit, formState, control } = useForm<ProfileFormValues>({
    defaultValues: {
      name: profile.name || '',
    },
  })
  const previewName = useWatch({ control, name: 'name' })

  useLockBodyScroll()

  const close = useCallback(() => {
    if (formState.isSubmitting) return
    if (onCancel) onCancel()
    else navigate({ to: paths.profile })
  }, [formState.isSubmitting, navigate, onCancel])

  useEffect(() => {
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [close])

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
      if (typeof reader.result === 'string') setAvatarPreview(reader.result)
    })
    reader.addEventListener('error', () => {
      setPhotoError('사진을 불러오지 못했습니다. 다시 선택해주세요.')
    })
    reader.readAsDataURL(file)
    setSelectedPhoto(file)
  }

  const handleResetPhoto = () => {
    setAvatarPreview('')
    setSelectedPhoto(null)
    setPhotoError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onSubmit: SubmitHandler<ProfileFormValues> = async (values) => {
    try {
      setErrorMessage(null)
      const uploaded = selectedPhoto ? await uploadImageMutation.mutateAsync(selectedPhoto) : null
      const uploadedUrl = uploaded ? Object.values(uploaded)[0] : undefined
      const response = await updateProfileMutation.mutateAsync({
        imgUrl: selectedPhoto ? uploadedUrl : avatarPreview || undefined,
        nickName: values.name.trim(),
      })
      const savedProfile: UserProfile = {
        ...profile,
        avatarUrl: response.imgUrl || undefined,
        id: response.userId || profile.id,
        name: response.nickName || values.name.trim(),
      }

      if (onSaved) onSaved(savedProfile)
      else navigate({ to: paths.profile, replace: true })
    } catch {
      setErrorMessage('프로필을 저장하지 못했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <S.Form onSubmit={handleSubmit(onSubmit)} noValidate aria-labelledby="profile-edit-title">
      <S.Header>
        <div>
          <h1 id="profile-edit-title">프로필 수정</h1>
          <p>프로필 사진과 계정 정보를 변경할 수 있습니다.</p>
        </div>
        <S.CloseButton ref={closeButtonRef} type="button" onClick={close} aria-label="닫기">×</S.CloseButton>
      </S.Header>

      <S.Body>
        <S.EditorColumn>
          <S.Section>
            <S.SectionHeading>
              <strong>프로필 사진</strong>
              <span>JPG, PNG, WEBP · 최대 2MB</span>
            </S.SectionHeading>
            <S.PhotoRow>
              <S.PhotoPreview>
                {avatarPreview
                  ? <img src={avatarPreview} alt="선택한 프로필 미리보기" />
                  : <span>{previewName?.trim().slice(0, 1) || 'P'}</span>}
              </S.PhotoPreview>
              <S.PhotoActions>
                <S.PhotoButton>
                  사진 선택
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoChange}
                  />
                </S.PhotoButton>
                <S.ResetPhotoButton type="button" onClick={handleResetPhoto}>기본 이미지</S.ResetPhotoButton>
              </S.PhotoActions>
            </S.PhotoRow>
            {photoError ? <S.ErrorMessage role="alert">{photoError}</S.ErrorMessage> : null}
          </S.Section>

          <S.Section>
            <S.SectionHeading><strong>닉네임</strong><span>2자 이상 입력해주세요.</span></S.SectionHeading>
            <S.Field>
              <span>닉네임</span>
              <input
                {...register('name', {
                  validate: (value) => getNicknameError(value) ?? true,
                })}
                aria-invalid={Boolean(formState.errors.name)}
              />
              {formState.errors.name ? <S.FieldError>{formState.errors.name.message}</S.FieldError> : null}
            </S.Field>
          </S.Section>

          <S.Section>
            <S.SectionHeading>
              <strong>비밀번호 재설정</strong>
              <span>본인 확인을 위해 이메일 인증 후 변경합니다.</span>
            </S.SectionHeading>
            <S.ResetPhotoButton type="button" onClick={() => navigate({ to: paths.changePassword })}>
              이메일 인증 후 비밀번호 변경
            </S.ResetPhotoButton>
          </S.Section>

          {errorMessage ? <S.ErrorMessage role="alert">{errorMessage}</S.ErrorMessage> : null}
        </S.EditorColumn>

        <S.Preview>
          <h2>미리보기</h2>
          <S.PreviewAvatar>
            {avatarPreview
              ? <img src={avatarPreview} alt="" />
              : <span>{previewName?.trim().slice(0, 1) || 'P'}</span>}
          </S.PreviewAvatar>
          <h3>{previewName?.trim() || '닉네임'}</h3>
          <p>{profile.travelStyle || '여행 성향 정보 없음'}</p>
          <small>저장하면 프로필 화면에 바로 반영됩니다.</small>
        </S.Preview>
      </S.Body>

      <S.Actions>
        <S.CancelButton type="button" onClick={close} disabled={formState.isSubmitting}>취소</S.CancelButton>
        <S.SaveButton type="submit" disabled={formState.isSubmitting}>{formState.isSubmitting ? '저장 중' : '변경사항 저장'}</S.SaveButton>
      </S.Actions>
    </S.Form>
  )
}
