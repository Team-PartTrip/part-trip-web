export const authValidationRules = {
  id: {
    pattern: '^[a-z0-9]{6,20}$',
    maxLength: 20,
    minLength: 6,
  },
  password: {
    pattern: '^(?:(?=.*[A-Za-z])(?=.*\\d)|(?=.*[A-Za-z])(?=.*[^A-Za-z0-9])|(?=.*\\d)(?=.*[^A-Za-z0-9])).{8,64}$',
    maxLength: 64,
    minLength: 8,
  },
} as const

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const idAllowedPattern = /^[a-z0-9]+$/
const passwordPattern = new RegExp(authValidationRules.password.pattern)
const idDeniedCharactersPattern = /[^a-z0-9]/g
const passwordDeniedCharactersPattern = /[\r\n]/g

export function sanitizeId(id: string) {
  return id.toLowerCase().replace(idDeniedCharactersPattern, '')
}

export function sanitizePassword(password: string) {
  return password.replace(passwordDeniedCharactersPattern, '')
}

export function getIdValidationError(id: string) {
  const { maxLength, minLength } = authValidationRules.id

  if (id && !idAllowedPattern.test(id)) {
    return '아이디는 영문 소문자와 숫자만 입력해주세요.'
  }

  if (id.length < minLength || id.length > maxLength) {
    return `아이디는 ${minLength}자 이상 ${maxLength}자 이하로 입력해주세요.`
  }

  return null
}

export function getPasswordValidationError(password: string) {
  const { maxLength, minLength } = authValidationRules.password

  if (password.length < minLength || password.length > maxLength) {
    return `비밀번호는 ${minLength}자 이상 ${maxLength}자 이하로 입력해주세요.`
  }

  if (password && !passwordPattern.test(password)) {
    return '비밀번호는 영문, 숫자, 특수문자 중 2종 이상을 포함해주세요.'
  }

  return null
}
