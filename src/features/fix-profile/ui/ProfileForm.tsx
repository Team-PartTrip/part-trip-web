import { type UserProfile } from '@/entities/user'

import { useProfileForm } from '../model/useProfileForm'
import * as S from './ProfileForm.styles'

type ProfileFormProps = {
  profile: UserProfile
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const {
    avatarPreview,
    close,
    closeButtonRef,
    errorMessage,
    fileInputRef,
    formState,
    handlePhotoChange,
    handleResetPhoto,
    nameField,
    onSubmit,
    photoError,
    previewName,
  } = useProfileForm(profile)

  return (
    <S.Form onSubmit={onSubmit} noValidate aria-labelledby="profile-edit-title">
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
                {...nameField}
                aria-invalid={Boolean(formState.errors.name)}
              />
              {formState.errors.name ? <S.FieldError>{formState.errors.name.message}</S.FieldError> : null}
            </S.Field>
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
          <p>여행 프로필</p>
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
