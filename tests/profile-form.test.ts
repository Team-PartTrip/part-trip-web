import assert from 'node:assert/strict'
import test from 'node:test'

import {
  getNicknameError,
  isProfileImageSizeAllowed,
  isSupportedProfileImageType,
  pickProfileImgUrl,
} from '../src/features/fix-profile/model/profileForm.ts'

test('닉네임은 공백을 제외하고 2자 이상이어야 한다', () => {
  assert.equal(getNicknameError(' 김 '), '닉네임은 2자 이상 입력해주세요.')
  assert.equal(getNicknameError(' 김파트 '), null)
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

test('사진을 안 바꾸고 저장하면 서버가 준 원래 주소를 보낸다 (화면용 전체 주소가 아님)', () => {
  assert.equal(
    pickProfileImgUrl({
      avatarPreview: 'https://api.dandi-trip.me/uploads/profile/u1/a.jpg',
      avatarUrl: 'https://api.dandi-trip.me/uploads/profile/u1/a.jpg',
      imgUrl: '/uploads/profile/u1/a.jpg',
    }),
    '/uploads/profile/u1/a.jpg',
  )
})

test('사진을 새로 올렸으면 그 주소, 지웠으면 보내지 않는다', () => {
  assert.equal(
    pickProfileImgUrl({
      uploadedUrl: '/uploads/profile/u1/b.jpg',
      avatarPreview: 'data:image/png;base64,AAA',
      avatarUrl: 'https://api.dandi-trip.me/uploads/profile/u1/a.jpg',
      imgUrl: '/uploads/profile/u1/a.jpg',
    }),
    '/uploads/profile/u1/b.jpg',
  )
  assert.equal(
    pickProfileImgUrl({
      avatarPreview: '',
      avatarUrl: 'https://api.dandi-trip.me/uploads/profile/u1/a.jpg',
      imgUrl: '/uploads/profile/u1/a.jpg',
    }),
    undefined,
  )
})

test('사진이 원래 없던 계정은 아무것도 보내지 않는다', () => {
  assert.equal(pickProfileImgUrl({ avatarPreview: '' }), undefined)
})
