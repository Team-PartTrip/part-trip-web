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

export function isSupportedProfileImageType(type: string) {
  return supportedProfileImageTypes.has(type)
}

export function isProfileImageSizeAllowed(size: number) {
  return size <= maxProfileImageSize
}
