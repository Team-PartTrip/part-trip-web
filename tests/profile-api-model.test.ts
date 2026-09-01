import assert from 'node:assert/strict'
import test from 'node:test'

import { toUserProfile } from '../src/entities/user/profile-model.ts'

test('최신 프로필 응답을 화면 프로필로 변환한다', () => {
  const profile = toUserProfile({ imgUrl: '/avatar.png', nickName: '파트', userId: 'part01' })

  assert.equal(profile.id, 'part01')
  assert.equal(profile.name, '파트')
  assert.equal(profile.avatarUrl, '/avatar.png')
})
