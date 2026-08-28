import { useState } from 'react'
import {
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'
import {
  googleLogin,
  saveAuthTokens,
  sendVerificationCode,
  signUp,
  verifyCode,
  type SignUpRequestDto,
} from '@/entities/session/api'
import { paths } from '@/shared/config'
import {
  authValidationRules,
  createSanitizedChangeHandler,
  emailPattern,
  getErrorMessage,
  getFirstErrorMessage,
  getIdValidationError,
  getPasswordValidationError,
  sanitizeId,
  sanitizePassword,
  trimFormValue,
  verificationCodeRules,
} from '@/shared/utils'
import { AuthForm as S, GoogleLoginControl } from '@/shared/ui'

type SignUpStep = 'credentials' | 'verification'

type CredentialsFormValues = {
  id: string
  password: string
  passwordConfirm: string
  phoneNumber: string
  country: string
}

type VerificationFormValues = {
  email: string
  verificationCode: string
}

type FormMessage = {
  text: string
  tone: 'error' | 'success'
}

const phoneNumberPattern = /^\+?[0-9-]{9,20}$/

export function SignUpForm() {
  const navigate = useNavigate()
  const [step, setStep] = useState<SignUpStep>('credentials')
  const [message, setMessage] = useState<FormMessage | null>(null)
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)

  const credentialsForm = useForm<CredentialsFormValues>({
    defaultValues: {
      country: '',
      id: '',
      password: '',
      passwordConfirm: '',
      phoneNumber: '',
    },
  })
  const verificationForm = useForm<VerificationFormValues>({
    defaultValues: {
      email: '',
      verificationCode: '',
    },
  })

  const idField = credentialsForm.register('id', {
    required: '아이디를 입력해주세요.',
    setValueAs: (value) => sanitizeId(trimFormValue(value)),
    validate: (value) => getIdValidationError(value) ?? true,
  })
  const passwordField = credentialsForm.register('password', {
    required: '비밀번호를 입력해주세요.',
    setValueAs: (value) => sanitizePassword(trimFormValue(value)),
    validate: (value) => getPasswordValidationError(value) ?? true,
  })
  const passwordConfirmField = credentialsForm.register('passwordConfirm', {
    required: '비밀번호 확인을 입력해주세요.',
    setValueAs: (value) => sanitizePassword(trimFormValue(value)),
    validate: (value, values) => value === values.password || '비밀번호가 일치하지 않습니다.',
  })
  const phoneNumberField = credentialsForm.register('phoneNumber', {
    required: '전화번호를 입력해주세요.',
    setValueAs: trimFormValue,
    validate: (value) => phoneNumberPattern.test(value) || '전화번호는 숫자와 하이픈으로 입력해주세요.',
  })
  const countryField = credentialsForm.register('country', {
    required: '국적을 입력해주세요.',
    setValueAs: trimFormValue,
  })
  const emailField = verificationForm.register('email', {
    required: '이메일을 입력해주세요.',
    setValueAs: trimFormValue,
    validate: (value) => emailPattern.test(value) || '올바른 이메일을 입력해주세요.',
  })
  const verificationCodeField = verificationForm.register('verificationCode', verificationCodeRules)

  const handleCredentialsSubmit: SubmitHandler<CredentialsFormValues> = ({ password, passwordConfirm }) => {
    if (password !== passwordConfirm) {
      setMessage({ text: '비밀번호가 일치하지 않습니다.', tone: 'error' })
      return
    }
    setMessage(null)
    setStep('verification')
  }

  const handleCredentialsInvalid: SubmitErrorHandler<CredentialsFormValues> = (errors) => {
    setMessage({ text: getFirstErrorMessage(errors), tone: 'error' })
  }

  const handleGoogleSignup = async (idToken: string) => {
    try {
      setIsGoogleSubmitting(true)
      const tokens = await googleLogin({ idToken })
      saveAuthTokens(tokens)
      navigate({ to: paths.main, replace: true })
    } catch (error) {
      setMessage({ text: getErrorMessage(error), tone: 'error' })
    } finally {
      setIsGoogleSubmitting(false)
    }
  }

  const handleSendVerificationCode = async () => {
    const valid = await verificationForm.trigger('email')
    const email = trimFormValue(verificationForm.getValues('email'))
    if (!valid || !email) {
      setMessage({ text: verificationForm.getFieldState('email').error?.message ?? '이메일을 입력해주세요.', tone: 'error' })
      return
    }

    try {
      setIsSendingCode(true)
      await sendVerificationCode({ email })
      setMessage({ text: '인증번호를 발송했습니다.', tone: 'success' })
    } catch (error) {
      setMessage({ text: getErrorMessage(error), tone: 'error' })
    } finally {
      setIsSendingCode(false)
    }
  }

  const handleVerificationSubmit: SubmitHandler<VerificationFormValues> = async ({ email, verificationCode }) => {
    try {
      await verifyCode({ code: verificationCode, email })
      const { country, id, password, phoneNumber } = credentialsForm.getValues()
      const payload: SignUpRequestDto = {
        myCountry: country,
        phoneNumber,
        signUpDivision: 'USER',
        userId: id,
        userMail: email,
        userPwd: password,
      }
      await signUp(payload)
      navigate({ to: paths.login, replace: true })
    } catch (error) {
      setMessage({ text: getErrorMessage(error), tone: 'error' })
    }
  }

  const handleVerificationInvalid: SubmitErrorHandler<VerificationFormValues> = (errors) => {
    setMessage({ text: getFirstErrorMessage(errors), tone: 'error' })
  }

  const isCredentialsBusy = credentialsForm.formState.isSubmitting || isGoogleSubmitting
  const isVerificationSubmitting = verificationForm.formState.isSubmitting

  if (step === 'verification') {
    return (
      <S.Container>
        <S.Header>
          <S.Brand>PartTrip</S.Brand>
          <S.Title>이메일 인증</S.Title>
          <S.Subtitle>이메일로 받은 인증번호를 입력하세요.</S.Subtitle>
        </S.Header>
        <S.Body>
          <S.VerificationCodeForm
            aria-label="회원가입 이메일 인증"
            method="post"
            noValidate
            onSubmit={verificationForm.handleSubmit(handleVerificationSubmit, handleVerificationInvalid)}
          >
            <S.Field>
              <S.Input {...emailField} aria-label="이메일 주소" type="email" autoComplete="email" placeholder="이메일 주소를 입력하세요" disabled={isVerificationSubmitting || isSendingCode} required />
              <S.FieldHint>인증번호를 받을 이메일</S.FieldHint>
            </S.Field>
            <S.Field>
              <S.Input {...verificationCodeField} aria-label="인증번호" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="인증번호를 입력하세요" disabled={isVerificationSubmitting} required />
              <S.FieldHint>6자리 인증번호</S.FieldHint>
            </S.Field>
            {message ? <S.Message $tone={message.tone} aria-live="polite">{message.text}</S.Message> : null}
            <S.Actions>
              <S.PrimaryButton type="submit" disabled={isVerificationSubmitting}>{isVerificationSubmitting ? '확인 중' : '인증 완료'}</S.PrimaryButton>
              <S.OutlineButton type="button" disabled={isVerificationSubmitting || isSendingCode} onClick={() => void handleSendVerificationCode()}>{isSendingCode ? '발송 중' : '인증번호 다시 보내기'}</S.OutlineButton>
            </S.Actions>
            <S.Footer>회원가입과 비밀번호 변경에 동일하게 사용됩니다.</S.Footer>
          </S.VerificationCodeForm>
        </S.Body>
      </S.Container>
    )
  }

  return (
    <S.Container>
      <S.Header>
        <S.Brand>PartTrip</S.Brand>
        <S.Title>회원가입</S.Title>
        <S.Subtitle>계정 정보를 입력하고 이메일을 인증하세요.</S.Subtitle>
      </S.Header>
      <S.Body>
        <S.Form aria-label="회원가입" method="post" noValidate onSubmit={credentialsForm.handleSubmit(handleCredentialsSubmit, handleCredentialsInvalid)}>
          <S.Field>
            <S.Input {...idField} aria-label="아이디" type="text" autoComplete="username" placeholder="아이디" minLength={authValidationRules.id.minLength} maxLength={authValidationRules.id.maxLength} pattern={authValidationRules.id.pattern} title="아이디는 영문 소문자와 숫자만 입력해주세요." onChange={createSanitizedChangeHandler(idField, sanitizeId)} disabled={isCredentialsBusy} required />
            <S.FieldHint>6~20자 · 영문 소문자와 숫자</S.FieldHint>
          </S.Field>
          <S.Field>
            <S.Input {...passwordField} aria-label="비밀번호" type="password" autoComplete="new-password" placeholder="비밀번호" minLength={authValidationRules.password.minLength} maxLength={authValidationRules.password.maxLength} pattern={authValidationRules.password.pattern} title="비밀번호는 영문, 숫자, 특수문자 중 2종 이상을 포함해주세요." onChange={createSanitizedChangeHandler(passwordField, sanitizePassword)} disabled={isCredentialsBusy} required />
            <S.FieldHint>8~64자 · 영문 / 숫자 / 특수문자 중 2종 이상</S.FieldHint>
          </S.Field>
          <S.Field>
            <S.Input {...passwordConfirmField} aria-label="비밀번호 확인" type="password" autoComplete="new-password" placeholder="비밀번호 확인" minLength={authValidationRules.password.minLength} maxLength={authValidationRules.password.maxLength} pattern={authValidationRules.password.pattern} title="비밀번호는 영문, 숫자, 특수문자 중 2종 이상을 포함해주세요." onChange={createSanitizedChangeHandler(passwordConfirmField, sanitizePassword)} disabled={isCredentialsBusy} required />
            <S.FieldHint aria-hidden="true">&nbsp;</S.FieldHint>
          </S.Field>
          <S.Field>
            <S.Input {...phoneNumberField} aria-label="전화번호" type="tel" inputMode="tel" autoComplete="tel" placeholder="🇰🇷 +82  전화번호를 입력하세요" maxLength={20} disabled={isCredentialsBusy} required />
            <S.FieldHint aria-hidden="true">&nbsp;</S.FieldHint>
          </S.Field>
          <S.Field>
            <S.Input {...countryField} aria-label="국적" type="text" autoComplete="country-name" placeholder="국적을 입력하세요" maxLength={40} disabled={isCredentialsBusy} required />
            <S.FieldHint aria-hidden="true">&nbsp;</S.FieldHint>
          </S.Field>
          {message ? <S.Message $tone={message.tone} aria-live="polite">{message.text}</S.Message> : null}
          <S.Actions>
            <S.PrimaryButton type="submit" disabled={isCredentialsBusy}>{isCredentialsBusy ? '처리 중' : '다음'}</S.PrimaryButton>
            <S.Divider>또는</S.Divider>
            <GoogleLoginControl label="Google로 가입하기" disabled={isCredentialsBusy} isSubmitting={isGoogleSubmitting} onError={() => setMessage({ text: 'Google 회원가입에 실패했습니다.', tone: 'error' })} onLogin={handleGoogleSignup} />
          </S.Actions>
          <S.Footer>이미 계정이 있나요? <S.InlineLink to={paths.login}>로그인</S.InlineLink></S.Footer>
        </S.Form>
      </S.Body>
    </S.Container>
  )
}
