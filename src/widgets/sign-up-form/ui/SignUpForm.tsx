import { useState, type FormEvent } from 'react'
import logoUrl from '@shared/assets/logo.svg'
import { paths } from '@shared/config'
import { AuthForm as S } from '@shared/ui'

type SignUpStep = 'credentials' | 'verification'

export function SignUpForm() {
  const [step, setStep] = useState<SignUpStep>('credentials')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStep('verification')
  }

  const handleVerificationSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  if (step === 'verification') {
    return (
      <S.Container key="sign-up-verification">
        <S.Header>
          <S.Logo src={logoUrl} alt="PartTrip" />
          <S.Title>회원가입</S.Title>
        </S.Header>

        <S.Body>
          <S.Form aria-label="회원가입 인증" onSubmit={handleVerificationSubmit}>
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
              <S.PrimaryButton type="submit">회원가입</S.PrimaryButton>
              <S.SecondaryButton to={paths.login}>로그인 하기</S.SecondaryButton>
            </S.Actions>
          </S.Form>
        </S.Body>
      </S.Container>
    )
  }

  return (
    <S.Container key="sign-up-credentials">
      <S.Header>
        <S.Logo src={logoUrl} alt="PartTrip" />
        <S.Title>회원가입</S.Title>
      </S.Header>

      <S.Body>
        <S.Form aria-label="회원가입" onSubmit={handleSubmit}>
          <S.Input
            aria-label="아이디"
            name="id"
            type="text"
            autoComplete="username"
            placeholder="아이디를 입력하세요."
            required
          />

          <S.Input
            aria-label="비밀번호"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="비밀번호를 입력하세요."
            required
          />

          <S.Input
            aria-label="비밀번호 확인"
            name="passwordConfirm"
            type="password"
            autoComplete="new-password"
            placeholder="비밀번호를 다시 입력하세요."
            required
          />

          <S.PhoneField>
            <S.CountryButton type="button" aria-label="국가 선택">
              <S.FlagText>🇰🇷</S.FlagText>
              <S.Chevron aria-hidden />
            </S.CountryButton>
            <S.PhoneInput
              aria-label="국번 전화번호"
              name="phoneNumber"
              type="tel"
              autoComplete="tel"
              placeholder="국번 전화번호를 입력하세요."
              required
            />
          </S.PhoneField>

          <S.Actions>
            <S.PrimaryButton type="submit">다음</S.PrimaryButton>
            <S.SecondaryButton to={paths.login}>로그인 하기</S.SecondaryButton>
          </S.Actions>
        </S.Form>
      </S.Body>
    </S.Container>
  )
}
