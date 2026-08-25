import assert from 'node:assert/strict'
import test from 'node:test'

import {
  getNicknameError,
  getPasswordPairError,
  isProfileImageSizeAllowed,
  isSupportedProfileImageType,
} from '../src/features/fix-profile/model/profileForm.ts'

test('닉네임은 공백을 제외하고 2자 이상이어야 한다', () => {
  assert.equal(getNicknameError(' 김 '), '닉네임은 2자 이상 입력해주세요.')
  assert.equal(getNicknameError(' 김파트 '), null)
})

test('비밀번호를 입력하지 않으면 재설정을 생략한다', () => {
  assert.equal(getPasswordPairError('', ''), null)
})

test('비밀번호 확인이 일치하지 않으면 오류를 반환한다', () => {
  assert.equal(
    getPasswordPairError('password1!', 'password2!'),
    '새 비밀번호가 일치하지 않습니다.',
  )
})

test('프로필 사진은 지원하는 이미지 형식만 허용한다', () => {
  assert.equal(isSupportedProfileImageType('image/png'), true)
  assert.equal(isSupportedProfileImageType('image/jpeg'), true)
  assert.equal(isSupportedProfileImageType('image/svg+xml'), false)
  assert.equal(isSupportedProfileImageType('application/pdf'), false)
})

test('프로필 사진은 2MB 이하만 허용한다', () => {
  assert.equal(isProfileImageSizeAllowed(2 * 1024 * 1024), true)
  assert.equal(isProfileImageSizeAllowed(2 * 1024 * 1024 + 1), false)
})
