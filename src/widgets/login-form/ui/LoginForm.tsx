import type { FormEvent } from 'react'
import logoUrl from '@shared/assets/logo.svg'
import { paths } from '@shared/config'
import { AuthForm as S } from '@shared/ui'

export function LoginForm() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <S.Container>
      <S.Header>
        <S.Logo src={logoUrl} alt="PartTrip" />
        <S.Title>로그인</S.Title>
      </S.Header>

      <S.Body>
        <S.Form aria-label="로그인" onSubmit={handleSubmit}>
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
            autoComplete="current-password"
            placeholder="비밀번호를 입력하세요."
            required
          />

          <S.HintRow>
            <span>비밀 번호를 잊으셨나요? </span>
            <S.InlineLink to={paths.changePassword}>비밀번호 찾기</S.InlineLink>
          </S.HintRow>

          <S.Actions>
            <S.PrimaryButton type="submit">로그인 하기</S.PrimaryButton>
            <S.SecondaryButton to={paths.signUp}>회원가입 하기</S.SecondaryButton>
          </S.Actions>
        </S.Form>
      </S.Body>
    </S.Container>
  )
}
