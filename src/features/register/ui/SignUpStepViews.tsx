import type { ChangeEventHandler, FormEventHandler } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

import { partTripLogoUrl } from '@/shared/assets'
import { authValidationRules, createSanitizedChangeHandler, sanitizePassword } from '@/shared/utils'
import { AuthForm as S } from '@/shared/ui'

type FormMessage = {
  text: string
  tone: 'error' | 'success'
}

export function SignUpCredentialsView({
  checkedId,
  idField,
  isBusy,
  isCheckingId,
  isUserIdAvailable,
  message,
  onCheckId,
  onIdChange,
  onSubmit,
  passwordConfirmField,
  passwordField,
}: {
  checkedId: string
  idField: UseFormRegisterReturn<'id'>
  isBusy: boolean
  isCheckingId: boolean
  isUserIdAvailable?: boolean
  message: FormMessage | null
  onCheckId: () => void
  onIdChange: ChangeEventHandler<HTMLInputElement>
  onSubmit: FormEventHandler<HTMLFormElement>
  passwordConfirmField: UseFormRegisterReturn<'passwordConfirm'>
  passwordField: UseFormRegisterReturn<'password'>
}) {
  return (
    <S.Container>
      <S.Header><S.Brand><img src={partTripLogoUrl} alt="PartTrip" /></S.Brand><S.Title>회원가입</S.Title></S.Header>
      <S.Body>
        <S.Form aria-label="회원가입" method="post" noValidate onSubmit={onSubmit}>
          <S.Field>
            <S.Input {...idField} aria-label="아이디" type="text" autoComplete="username" placeholder="아이디 입력" minLength={authValidationRules.id.minLength} maxLength={authValidationRules.id.maxLength} pattern={authValidationRules.id.pattern} title="아이디는 영문 소문자와 숫자만 입력해주세요." onChange={onIdChange} onBlur={onCheckId} disabled={isBusy || isCheckingId} required />
            {checkedId && isUserIdAvailable !== undefined ? <S.FieldHint>{checkedId} · {isUserIdAvailable ? '사용 가능' : '사용 불가'}{isUserIdAvailable ? '' : ' · 다른 아이디를 입력해주세요.'}</S.FieldHint> : <S.FieldHint>6~20자 · 영문 소문자와 숫자</S.FieldHint>}
          </S.Field>
          <S.Field>
            <S.Input {...passwordField} aria-label="비밀번호" type="password" autoComplete="new-password" placeholder="비밀번호 입력" minLength={authValidationRules.password.minLength} maxLength={authValidationRules.password.maxLength} pattern={authValidationRules.password.pattern} title="비밀번호는 영문, 숫자, 특수문자 중 2종 이상을 포함해주세요." onChange={createSanitizedChangeHandler(passwordField, sanitizePassword)} disabled={isBusy} required />
            <S.FieldHint>8~64자 · 영문 / 숫자 / 특수문자 중 2종 이상</S.FieldHint>
          </S.Field>
          <S.Field>
            <S.Input {...passwordConfirmField} aria-label="비밀번호 확인" type="password" autoComplete="new-password" placeholder="비밀번호 다시 입력" minLength={authValidationRules.password.minLength} maxLength={authValidationRules.password.maxLength} pattern={authValidationRules.password.pattern} title="비밀번호는 영문, 숫자, 특수문자 중 2종 이상을 포함해주세요." onChange={createSanitizedChangeHandler(passwordConfirmField, sanitizePassword)} disabled={isBusy} required />
            <S.FieldHint>비밀번호가 일치해야 해요</S.FieldHint>
          </S.Field>
          {message ? <S.Message $tone={message.tone} aria-live="polite">{message.text}</S.Message> : null}
          <S.Actions><S.PrimaryButton type="submit" disabled={isBusy}>{isBusy ? '처리 중' : '다음'}</S.PrimaryButton></S.Actions>
        </S.Form>
      </S.Body>
    </S.Container>
  )
}

export function SignUpVerificationView({
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
      <S.Header><S.Brand><img src={partTripLogoUrl} alt="PartTrip" /></S.Brand><S.Title>이메일 인증</S.Title><S.Subtitle>이메일로 받은 인증번호를 입력하세요.</S.Subtitle></S.Header>
      <S.Body>
        <S.VerificationCodeForm aria-label="회원가입 이메일 인증" method="post" noValidate onSubmit={onSubmit}>
          <S.Field><S.InlineVerificationRow><S.Input {...emailField} aria-label="이메일 주소" type="email" autoComplete="email" placeholder="이메일을 입력하세요" disabled={isSubmitting || isSendingCode} required /><S.CodeSendButton type="button" disabled={isSubmitting || isSendingCode} onClick={onSendCode}>{isSendingCode ? '발송 중' : '인증 요청'}</S.CodeSendButton></S.InlineVerificationRow></S.Field>
          <S.Field><S.Input {...verificationCodeField} aria-label="인증번호" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="인증번호 6자리" disabled={isSubmitting} required /><S.FieldHint>6자리 인증번호</S.FieldHint></S.Field>
          {message ? <S.Message $tone={message.tone} aria-live="polite">{message.text}</S.Message> : null}
          <S.Actions><S.PrimaryButton type="submit" disabled={isSubmitting}>{isSubmitting ? '처리 중' : '가입 완료'}</S.PrimaryButton></S.Actions>
        </S.VerificationCodeForm>
      </S.Body>
    </S.Container>
  )
}
