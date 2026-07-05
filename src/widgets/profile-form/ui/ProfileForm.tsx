import { useState } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { updateProfileMock, type UserProfile } from '@shared/api'
import { paths } from '@shared/config'

import * as S from './ProfileForm.styles'

type ProfileFormProps = {
  profile: UserProfile
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { register, handleSubmit, formState } = useForm<UserProfile>({
    defaultValues: profile,
  })

  const onSubmit: SubmitHandler<UserProfile> = async (values) => {
    try {
      setErrorMessage(null)
      await updateProfileMock(values)
      navigate(paths.profile, { replace: true })
    } catch {
      setErrorMessage('프로필을 저장하지 못했습니다. 다시 시도해주세요.')
    }
  }

  return (
    <S.Form onSubmit={handleSubmit(onSubmit)} noValidate>
      <S.Header>
        <div><span>PROFILE EDIT</span><h1>프로필 수정</h1></div>
        <p>시연 중 수정한 정보는 현재 브라우저에 저장됩니다.</p>
      </S.Header>
      <S.FieldGrid>
        <S.Field><span>이름</span><input {...register('name', { required: true, minLength: 2 })} /></S.Field>
        <S.Field><span>아이디</span><input {...register('id', { required: true, minLength: 6 })} /></S.Field>
        <S.Field><span>이메일</span><input type="email" {...register('email', { required: true })} /></S.Field>
        <S.Field><span>전화번호</span><input {...register('phone', { required: true })} /></S.Field>
        <S.Field><span>거주 국가</span><input {...register('country', { required: true })} /></S.Field>
        <S.Field><span>여행 성향</span><input {...register('travelStyle', { required: true })} /></S.Field>
        <S.Field $wide><span>한 줄 소개</span><textarea rows={4} {...register('bio', { required: true, maxLength: 120 })} /></S.Field>
      </S.FieldGrid>
      {Object.keys(formState.errors).length > 0 ? <S.ErrorMessage>모든 항목을 올바르게 입력해주세요.</S.ErrorMessage> : null}
      {errorMessage ? <S.ErrorMessage role="alert">{errorMessage}</S.ErrorMessage> : null}
      <S.Actions>
        <S.CancelButton type="button" onClick={() => navigate(paths.profile)} disabled={formState.isSubmitting}>취소</S.CancelButton>
        <S.SaveButton type="submit" disabled={formState.isSubmitting}>{formState.isSubmitting ? '저장 중' : '저장하기'}</S.SaveButton>
      </S.Actions>
    </S.Form>
  )
}
