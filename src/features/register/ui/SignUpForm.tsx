import { useState } from 'react'
import {
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'
import {
  checkUserId,
  sendVerificationCode,
  signUp,
  verifyCode,
  type SignUpRequestDto,
} from '@/entities/session/api'
import { partTripLogoUrl } from '@/shared/assets'
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
import { AuthForm as S } from '@/shared/ui'

type SignUpStep = 'credentials' | 'verification'

type CredentialsFormValues = {
  id: string
  password: string
  passwordConfirm: string
  phoneNumber: string
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
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [isCheckingId, setIsCheckingId] = useState(false)
  const [checkedId, setCheckedId] = useState('')
  const [isUserIdAvailable, setIsUserIdAvailable] = useState<boolean>()

  const credentialsForm = useForm<CredentialsFormValues>({
    defaultValues: {
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
  const emailField = verificationForm.register('email', {
    required: '이메일을 입력해주세요.',
    setValueAs: trimFormValue,
    validate: (value) => emailPattern.test(value) || '올바른 이메일을 입력해주세요.',
  })
  const verificationCodeField = verificationForm.register('verificationCode', verificationCodeRules)

  const handleCredentialsSubmit: SubmitHandler<CredentialsFormValues> = async ({ id, password, passwordConfirm }) => {
    if (password !== passwordConfirm) {
      setMessage({ text: '비밀번호가 일치하지 않습니다.', tone: 'error' })
      return
    }
    const isAvailable = checkedId === id && isUserIdAvailable === true
      ? true
      : await handleCheckId(id)
    if (!isAvailable) {
      setMessage({ text: '아이디 중복확인을 완료해주세요.', tone: 'error' })
      return
    }
    setMessage(null)
    setStep('verification')
  }

  const handleCredentialsInvalid: SubmitErrorHandler<CredentialsFormValues> = (errors) => {
    setMessage({ text: getFirstErrorMessage(errors), tone: 'error' })
  }

  const handleIdChange = createSanitizedChangeHandler(idField, (value) => {
    const sanitized = sanitizeId(value)
    setCheckedId('')
    setIsUserIdAvailable(undefined)
    return sanitized
  })

  const handleCheckId = async (value = credentialsForm.getValues('id')) => {
    const userId = sanitizeId(trimFormValue(value))
    const validationError = getIdValidationError(userId)
    if (validationError) {
      setMessage({ text: validationError, tone: 'error' })
      return false
    }
    try {
      setIsCheckingId(true)
      const result = await checkUserId(userId)
      const [responseKey, responseValue] = Object.entries(result)[0] ?? []
      const available = responseKey?.toLowerCase().includes('duplicate') ? responseValue !== true : responseValue === true
      setCheckedId(userId)
      setIsUserIdAvailable(available)
      setMessage({ text: available ? '사용할 수 있는 아이디입니다.' : '이미 사용 중인 아이디입니다.', tone: available ? 'success' : 'error' })
      return available
    } catch (error) {
      setMessage({ text: getErrorMessage(error), tone: 'error' })
      return false
    } finally {
      setIsCheckingId(false)
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
      const { id, password, phoneNumber } = credentialsForm.getValues()
      const payload: SignUpRequestDto = {
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

  const isCredentialsBusy = credentialsForm.formState.isSubmitting
  const isVerificationSubmitting = verificationForm.formState.isSubmitting

  if (step === 'verification') {
    return (
      <S.Container>
        <S.Header>
          <S.Brand><img src={partTripLogoUrl} alt="PartTrip" /></S.Brand>
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
              <S.InlineVerificationRow>
                <S.Input {...emailField} aria-label="이메일 주소" type="email" autoComplete="email" placeholder="이메일을 입력하세요" disabled={isVerificationSubmitting || isSendingCode} required />
                <S.CodeSendButton type="button" disabled={isVerificationSubmitting || isSendingCode} onClick={() => void handleSendVerificationCode()}>{isSendingCode ? '발송 중' : '인증 요청'}</S.CodeSendButton>
              </S.InlineVerificationRow>
            </S.Field>
            <S.Field>
              <S.Input {...verificationCodeField} aria-label="인증번호" type="text" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="인증번호 6자리" disabled={isVerificationSubmitting} required />
              <S.FieldHint>6자리 인증번호</S.FieldHint>
            </S.Field>
            {message ? <S.Message $tone={message.tone} aria-live="polite">{message.text}</S.Message> : null}
            <S.Actions>
              <S.PrimaryButton type="submit" disabled={isVerificationSubmitting}>{isVerificationSubmitting ? '처리 중' : '가입 완료'}</S.PrimaryButton>
            </S.Actions>
          </S.VerificationCodeForm>
        </S.Body>
      </S.Container>
    )
  }

  return (
    <S.Container>
      <S.Header>
        <S.Brand><img src={partTripLogoUrl} alt="PartTrip" /></S.Brand>
        <S.Title>회원가입</S.Title>
      </S.Header>
      <S.Body>
        <S.Form aria-label="회원가입" method="post" noValidate onSubmit={credentialsForm.handleSubmit(handleCredentialsSubmit, handleCredentialsInvalid)}>
          <S.Field>
            <S.Input {...idField} aria-label="아이디" type="text" autoComplete="username" placeholder="아이디 입력" minLength={authValidationRules.id.minLength} maxLength={authValidationRules.id.maxLength} pattern={authValidationRules.id.pattern} title="아이디는 영문 소문자와 숫자만 입력해주세요." onChange={handleIdChange} onBlur={() => void handleCheckId()} disabled={isCredentialsBusy || isCheckingId} required />
            {checkedId && isUserIdAvailable !== undefined ? <S.FieldHint>{checkedId} · {isUserIdAvailable ? '사용 가능' : '사용 불가'}{isUserIdAvailable ? '' : ' · 다른 아이디를 입력해주세요.'}</S.FieldHint> : <S.FieldHint>6~20자 · 영문 소문자와 숫자</S.FieldHint>}
          </S.Field>
          <S.Field>
            <S.Input {...passwordField} aria-label="비밀번호" type="password" autoComplete="new-password" placeholder="비밀번호 입력" minLength={authValidationRules.password.minLength} maxLength={authValidationRules.password.maxLength} pattern={authValidationRules.password.pattern} title="비밀번호는 영문, 숫자, 특수문자 중 2종 이상을 포함해주세요." onChange={createSanitizedChangeHandler(passwordField, sanitizePassword)} disabled={isCredentialsBusy} required />
            <S.FieldHint>8~64자 · 영문 / 숫자 / 특수문자 중 2종 이상</S.FieldHint>
          </S.Field>
          <S.Field>
            <S.Input {...passwordConfirmField} aria-label="비밀번호 확인" type="password" autoComplete="new-password" placeholder="비밀번호 다시 입력" minLength={authValidationRules.password.minLength} maxLength={authValidationRules.password.maxLength} pattern={authValidationRules.password.pattern} title="비밀번호는 영문, 숫자, 특수문자 중 2종 이상을 포함해주세요." onChange={createSanitizedChangeHandler(passwordConfirmField, sanitizePassword)} disabled={isCredentialsBusy} required />
            <S.FieldHint>비밀번호가 일치해야 해요</S.FieldHint>
          </S.Field>
          <S.Field>
            <S.Input {...phoneNumberField} aria-label="전화번호" type="tel" inputMode="tel" autoComplete="tel" placeholder="대한민국  +82  전화번호 입력" maxLength={20} disabled={isCredentialsBusy} required />
            <S.FieldHint>인증번호를 받을 수 있는 번호를 입력하세요</S.FieldHint>
          </S.Field>
          {message ? <S.Message $tone={message.tone} aria-live="polite">{message.text}</S.Message> : null}
          <S.Actions>
            <S.PrimaryButton type="submit" disabled={isCredentialsBusy}>{isCredentialsBusy ? '처리 중' : '다음'}</S.PrimaryButton>
          </S.Actions>
        </S.Form>
      </S.Body>
    </S.Container>
  )
}
