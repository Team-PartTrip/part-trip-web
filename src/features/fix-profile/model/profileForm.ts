const supportedProfileImageTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
])
const maxProfileImageSize = 2 * 1024 * 1024

export function getNicknameError(nickname: string) {
  if (nickname.trim().length < 2) {
    return '닉네임은 2자 이상 입력해주세요.'
  }

  return null
}

export function getPasswordPairError(password: string, passwordConfirm: string) {
  if (!password && !passwordConfirm) return null
  if (!password) return '새 비밀번호를 입력해주세요.'
  if (!passwordConfirm) return '새 비밀번호 확인을 입력해주세요.'
  if (password !== passwordConfirm) return '새 비밀번호가 일치하지 않습니다.'

  return null
}

export function isSupportedProfileImageType(type: string) {
  return supportedProfileImageTypes.has(type)
}

export function isProfileImageSizeAllowed(size: number) {
  return size <= maxProfileImageSize
}
