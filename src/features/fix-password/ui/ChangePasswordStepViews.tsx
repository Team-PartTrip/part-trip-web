import type { FormEventHandler } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

import { partTripLogoUrl } from '@/shared/assets'
import { authValidationRules, createSanitizedChangeHandler, sanitizePassword } from '@/shared/utils'
import { AuthForm as S } from '@/shared/ui'

type FormMessage = {
  text: string
  tone: 'error' | 'success'
}

export function PasswordVerificationView({
  emailField,
  isSendingCode,
  isSubmitting,
  message,
  onSendCode,
  onSubmit,
  verificationCodeField,
}: {
  emailField: UseFormRegisterReturn<'email'>
  isSendingCode: boolean
  isSubmitting: boolean
  message: FormMessage | null
  onSendCode: () => void
  onSubmit: FormEventHandler<HTMLFormElement>
  verificationCodeField: UseFormRegisterReturn<'verificationCode'>
}) {
  return (
    <S.Container>
      <S.Header><S.Brand><img src={partTripLogoUrl} alt="PartTrip" /></S.Brand><S.Title>비밀번호 찾기</S.Title></S.Header>
      <S.Body>
        <S.Form aria-label="비밀번호 찾기 본인 인증" method="post" noValidate onSubmit={onSubmit}>
          <S.Field><S.InlineVerificationRow><S.Input {...emailField} aria-label="가입한 이메일" type="email" autoComplete="email" placeholder="이메일을 입력하세요" disabled={isSubmitting || isSendingCode} required /><S.CodeSendButton type="button" disabled={isSubmitting || isSendingCode} onClick={onSendCode}>{isSendingCode ? '발송 중' : '인증 요청'}</S.CodeSendButton></S.InlineVerificationRow></S.Field>
          <S.Field><S.Input {...verificationCodeField} aria-label="인증번호" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="인증번호를 입력하세요" disabled={isSubmitting} required /><S.FieldHint>인증번호 6자리</S.FieldHint></S.Field>
          {message ? <S.Message $tone={message.tone} aria-live="polite">{message.text}</S.Message> : null}
          <S.Actions><S.PrimaryButton type="submit" disabled={isSubmitting}>{isSubmitting ? '확인 중' : '다음'}</S.PrimaryButton></S.Actions>
        </S.Form>
      </S.Body>
    </S.Container>
  )
}

export function NewPasswordView({
  message,
  newPasswordConfirmField,
  newPasswordField,
  onBack,
  onSubmit,
  isSubmitting,
}: {
  isSubmitting: boolean
  message: FormMessage | null
  newPasswordConfirmField: UseFormRegisterReturn<'newPasswordConfirm'>
  newPasswordField: UseFormRegisterReturn<'newPassword'>
  onBack: () => void
  onSubmit: FormEventHandler<HTMLFormElement>
}) {
  return (
    <S.Container>
      <S.Header><S.Brand><img src={partTripLogoUrl} alt="PartTrip" /></S.Brand><S.Title>비밀번호 찾기</S.Title><S.Subtitle>이메일 인증이 완료되었습니다. 새 비밀번호를 입력하세요.</S.Subtitle></S.Header>
      <S.Body>
        <S.Form aria-label="새 비밀번호 설정" method="post" noValidate onSubmit={onSubmit}>
          <S.Field><S.Input {...newPasswordField} aria-label="새 비밀번호" type="password" autoComplete="new-password" placeholder="새 비밀번호" minLength={authValidationRules.password.minLength} maxLength={authValidationRules.password.maxLength} pattern={authValidationRules.password.pattern} title="비밀번호는 영문, 숫자, 특수문자 중 2종 이상을 포함해주세요." onChange={createSanitizedChangeHandler(newPasswordField, sanitizePassword)} disabled={isSubmitting} required /><S.FieldHint>8~64자 · 영문 / 숫자 / 특수문자 중 2종 이상</S.FieldHint></S.Field>
          <S.Field><S.Input {...newPasswordConfirmField} aria-label="새 비밀번호 확인" type="password" autoComplete="new-password" placeholder="새 비밀번호 확인" minLength={authValidationRules.password.minLength} maxLength={authValidationRules.password.maxLength} pattern={authValidationRules.password.pattern} title="비밀번호는 영문, 숫자, 특수문자 중 2종 이상을 포함해주세요." onChange={createSanitizedChangeHandler(newPasswordConfirmField, sanitizePassword)} disabled={isSubmitting} required /></S.Field>
          {message ? <S.Message $tone={message.tone} aria-live="polite">{message.text}</S.Message> : null}
          <S.Actions><S.PrimaryButton type="submit" disabled={isSubmitting}>{isSubmitting ? '변경 중' : '비밀번호 변경'}</S.PrimaryButton><S.OutlineButton type="button" onClick={onBack}>로그인으로 돌아가기</S.OutlineButton></S.Actions>
        </S.Form>
      </S.Body>
    </S.Container>
  )
}
