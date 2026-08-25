import assert from 'node:assert/strict'
import test from 'node:test'

import { toUserProfile } from '../src/entities/user/profile-model.ts'

test('서버 프로필과 캐릭터 응답을 화면 프로필로 변환한다', () => {
  const profile = toUserProfile(
    { imgUrl: '/avatar.png', nickName: '파트', userId: 'part01' },
    { characterDescription: '계획을 즐깁니다.', characterName: '플랜', characterType: '계획형' },
  )

  assert.equal(profile.id, 'part01')
  assert.equal(profile.name, '파트')
  assert.equal(profile.avatarUrl, '/avatar.png')
  assert.equal(profile.travelStyle, '계획형')
  assert.equal(profile.bio, '계획을 즐깁니다.')
})

test('캐릭터 응답이 없으면 기존 기본 표시 정보를 유지한다', () => {
  const profile = toUserProfile({ nickName: '파트', userId: 'part01' })

  assert.equal(profile.travelStyle, '계획적인 문화 탐험가')
  assert.ok(profile.bio.length > 0)
})
