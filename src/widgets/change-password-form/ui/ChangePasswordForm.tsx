import { useState, type FormEvent } from 'react'
import logoUrl from '@shared/assets/logo.svg'
import { paths } from '@shared/config'
import { AuthForm as S } from '@shared/ui'

type ChangePasswordStep = 'verification' | 'password'

export function ChangePasswordForm() {
  const [step, setStep] = useState<ChangePasswordStep>('verification')

  const handleVerificationSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStep('password')
  }

  const handlePasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <S.Container>
      <S.Header>
        <S.Logo src={logoUrl} alt="PartTrip" />
        <S.Title>비밀번호 찾기</S.Title>
      </S.Header>

      <S.Body>
        {step === 'verification' ? (
          <S.Form
            key="change-password-verification"
            aria-label="비밀번호 찾기 인증"
            onSubmit={handleVerificationSubmit}
          >
            <S.VerificationField>
              <S.Input
                $compact
                aria-label="이메일"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="이메일을 입력하세요."
                required
              />
              <S.CodeSendButton type="button">인증코드 보내기</S.CodeSendButton>
            </S.VerificationField>

            <S.Input
              $compact
              aria-label="인증코드"
              name="verificationCode"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="인증코드를 입력하세요."
              required
            />

            <S.Actions>
              <S.PrimaryButton type="submit">다음</S.PrimaryButton>
              <S.SecondaryButton to={paths.login}>로그인 하기</S.SecondaryButton>
            </S.Actions>
          </S.Form>
        ) : (
          <S.Form
            key="change-password-password"
            aria-label="비밀번호 변경"
            onSubmit={handlePasswordSubmit}
          >
            <S.Input
              aria-label="새 비밀번호"
              name="newPassword"
              type="password"
              autoComplete="new-password"
              placeholder="새 비밀번호를 입력하세요"
              required
            />

            <S.Input
              aria-label="새 비밀번호 확인"
              name="newPasswordConfirm"
              type="password"
              autoComplete="new-password"
              placeholder="새 비밀번호를 다시 입력하세요"
              required
            />

            <S.Actions>
              <S.PrimaryButton type="submit">비밀번호 변경</S.PrimaryButton>
            </S.Actions>
          </S.Form>
        )}
      </S.Body>
    </S.Container>
  )
}
