import assert from 'node:assert/strict'
import test from 'node:test'

import { toUserProfile } from '../src/entities/user/profile-model.ts'

test('서버 프로필과 캐릭터 응답을 화면 프로필로 변환한다', () => {
  const profile = toUserProfile(
    { imgUrl: '/avatar.png', nickName: '파트', userId: 'part01' },
    { description: '계획을 즐깁니다.', imageUrl: '/theme.png', themeCode: '계획형', themeId: 3, themeName: '플랜' },
  )

  assert.equal(profile.id, 'part01')
  assert.equal(profile.name, '파트')
  assert.equal(profile.avatarUrl, '/avatar.png')
  assert.equal(profile.travelStyle, '계획형')
  assert.equal(profile.bio, '계획을 즐깁니다.')
  assert.equal(profile.themeId, 3)
  assert.equal(profile.characterImageUrl, '/theme.png')
})

test('캐릭터 응답이 없으면 서버에 없는 정보를 임의로 채우지 않는다', () => {
  const profile = toUserProfile({ nickName: '파트', userId: 'part01' })

  assert.equal(profile.travelStyle, undefined)
  assert.equal(profile.bio, undefined)
  assert.equal(profile.email, undefined)
  assert.equal(profile.phone, undefined)
})
