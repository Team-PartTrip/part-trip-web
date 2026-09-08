import { useState } from 'react'
import {
  useForm,
  type SubmitErrorHandler,
  type SubmitHandler,
} from 'react-hook-form'
import { useNavigate } from '@tanstack/react-router'
import {
  checkUserId,
  signUp,
  verifyCode,
} from '@/entities/session/api'
import { paths } from '@/shared/config'
import {
  createSanitizedChangeHandler,
  emailPattern,
  getErrorMessage,
  getFirstErrorMessage,
  getIdValidationError,
  getPasswordValidationError,
  getSafeRedirect,
  sanitizeId,
  sanitizePassword,
  trimFormValue,
  verificationCodeRules,
} from '@/shared/utils'
import { SignUpCredentialsView, SignUpVerificationView } from './SignUpStepViews'

type SignUpStep = 'credentials' | 'verification'

type CredentialsFormValues = {
  id: string
  password: string
  passwordConfirm: string
}

type VerificationFormValues = {
  email: string
  verificationCode: string
}

type FormMessage = {
  text: string
  tone: 'error' | 'success'
}

type SignUpFormProps = {
  redirect?: string
}

export function SignUpForm({ redirect }: SignUpFormProps) {
  const navigate = useNavigate()
  const safeRedirect = getSafeRedirect(redirect)
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
      const available = result.available === true
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
      const { id, password } = credentialsForm.getValues()
      await signUp({
        signUpDivision: 'USER',
        userId: id,
        userMail: email,
        userPwd: password,
      })
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
      navigate({
        search: safeRedirect ? { redirect: safeRedirect } : undefined,
        to: paths.login,
        replace: true,
      })
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
    return <SignUpVerificationView emailField={emailField} isSendingCode={isSendingCode} isSubmitting={isVerificationSubmitting} message={message} onSendCode={() => void handleSendVerificationCode()} onSubmit={verificationForm.handleSubmit(handleVerificationSubmit, handleVerificationInvalid)} verificationCodeField={verificationCodeField} />
  }

  return <SignUpCredentialsView checkedId={checkedId} idField={idField} isBusy={isCredentialsBusy} isCheckingId={isCheckingId} isUserIdAvailable={isUserIdAvailable} message={message} onCheckId={() => void handleCheckId()} onIdChange={handleIdChange} onSubmit={credentialsForm.handleSubmit(handleCredentialsSubmit, handleCredentialsInvalid)} passwordConfirmField={passwordConfirmField} passwordField={passwordField} />
}
