import assert from 'node:assert/strict'
import test from 'node:test'

import { toUserProfile } from '../src/entities/user/profile-model.ts'

test('최신 프로필 응답을 화면 프로필로 변환한다', () => {
  const profile = toUserProfile({ imgUrl: '/avatar.png', nickName: '파트', userId: 'part01' })

  assert.equal(profile.id, 'part01')
  assert.equal(profile.name, '파트')
  assert.equal(profile.avatarUrl, '/avatar.png')
})

test('이메일만 표시용으로 제공하고 카카오 내부 ID는 노출하지 않는다', () => {
  assert.equal(toUserProfile({ userId: 'kakao_1234', nickName: '파트', email: null }).email, undefined)
  assert.equal(toUserProfile({ userId: 'kakao_1234', nickName: '파트', email: 'a@example.com' }).email, 'a@example.com')
  assert.equal(toUserProfile({ userId: 'a@example.com', nickName: '파트' }).email, 'a@example.com')
})
