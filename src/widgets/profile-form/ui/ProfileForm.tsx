import { useState } from 'react'
import { useForm, useWatch, type SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { updateProfileMock, type UserProfile } from '@shared/api'
import { paths } from '@shared/config'

import * as S from './ProfileForm.styles'

type ProfileFormProps = {
  onCancel?: () => void
  onSaved?: (profile: UserProfile) => void
  profile: UserProfile
}

export function ProfileForm({ onCancel, onSaved, profile }: ProfileFormProps) {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { register, handleSubmit, formState, control } = useForm<UserProfile>({
    defaultValues: profile,
  })
  const previewName = useWatch({ control, name: 'name' })

  const onSubmit: SubmitHandler<UserProfile> = async (values) => {
    try {
      setErrorMessage(null)
      const updatedProfile = await updateProfileMock(values)
      if (onSaved) {
        onSaved(updatedProfile)
      } else {
        navigate(paths.profile, { replace: true })
      }
    } catch {
      setErrorMessage('프로필을 저장하지 못했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <S.Form onSubmit={handleSubmit(onSubmit)} noValidate>
      <S.Header>
        <h1>프로필 수정</h1>
        <S.CloseButton type="button" onClick={() => onCancel ? onCancel() : navigate(paths.profile)} aria-label="닫기">×</S.CloseButton>
      </S.Header>
      <S.Body>
        <S.FieldGrid>
          <S.Field><span>닉네임</span><input {...register('name', { required: true, minLength: 2 })} /></S.Field>
          <S.Field><span>이메일</span><input type="email" {...register('email', { required: true })} /></S.Field>
          <S.Field><span>전화번호</span><input {...register('phone', { required: true })} /></S.Field>
          <S.Field><span>비밀번호</span><input type="password" defaultValue="password1" /></S.Field>
          {Object.keys(formState.errors).length > 0 ? <S.ErrorMessage>모든 항목을 올바르게 입력해주세요.</S.ErrorMessage> : null}
          {errorMessage ? <S.ErrorMessage role="alert">{errorMessage}</S.ErrorMessage> : null}
        </S.FieldGrid>
        <S.Preview><h2>미리보기</h2><S.PreviewAvatar /><h3>{previewName}</h3><p>{profile.travelStyle}</p></S.Preview>
      </S.Body>
      <S.Actions>
        <S.CancelButton type="button" onClick={() => onCancel ? onCancel() : navigate(paths.profile)} disabled={formState.isSubmitting}>취소</S.CancelButton>
        <S.SaveButton type="submit" disabled={formState.isSubmitting}>{formState.isSubmitting ? '저장 중' : '저장하기'}</S.SaveButton>
      </S.Actions>
    </S.Form>
  )
}
