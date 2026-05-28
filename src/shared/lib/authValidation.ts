export const authValidationRules = {
  id: {
    pattern: '^[A-Za-z0-9]+$',
    maxLength: 20,
    minLength: 6,
  },
  password: {
    allowedSpecialCharacters: '!@#$%^&*',
    pattern: '^[A-Za-z0-9!@#$%^&*]+$',
    maxLength: 64,
    minLength: 8,
  },
} as const

const idAllowedPattern = /^[A-Za-z0-9]+$/
const passwordAllowedPattern = /^[A-Za-z0-9!@#$%^&*]+$/
const idDeniedCharactersPattern = /[^A-Za-z0-9]/g
const passwordDeniedCharactersPattern = /[^A-Za-z0-9!@#$%^&*]/g

export function sanitizeId(id: string) {
  return id.replace(idDeniedCharactersPattern, '')
}

export function sanitizePassword(password: string) {
  return password.replace(passwordDeniedCharactersPattern, '')
}

export function getIdValidationError(id: string) {
  const { maxLength, minLength } = authValidationRules.id

  if (id && !idAllowedPattern.test(id)) {
    return '아이디는 영문과 숫자만 입력해주세요.'
  }

  if (id.length < minLength || id.length > maxLength) {
    return `아이디는 ${minLength}자 이상 ${maxLength}자 이하로 입력해주세요.`
  }

  return null
}

export function getPasswordValidationError(password: string) {
  const { allowedSpecialCharacters, maxLength, minLength } =
    authValidationRules.password

  if (password && !passwordAllowedPattern.test(password)) {
    return `비밀번호는 영문, 숫자, 특수문자(${allowedSpecialCharacters})만 입력해주세요.`
  }

  if (password.length < minLength || password.length > maxLength) {
    return `비밀번호는 ${minLength}자 이상 ${maxLength}자 이하로 입력해주세요.`
  }

  return null
}
