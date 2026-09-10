import assert from 'node:assert/strict'
import test from 'node:test'

import { getProfilePageModel } from '../src/widgets/profile/model/profile-page.ts'

test('profile page model은 지도 중복 제거와 서버 통계 override를 유지한다', () => {
  const model = getProfilePageModel({
    profile: { id: 'traveler', name: '민수' },
    profileStats: { countryCount: 4, recordCount: 9, tripCount: 5 },
    trips: [
      { countryName: '일본', images: ['one'] },
      { countryName: '일본', images: ['two', 'three'] },
    ],
    worldMap: {
      visited: [
        { countryCode: 'JP', countryName: '일본' },
        { countryCode: 'JP', countryName: '일본' },
      ],
    },
  })

  assert.equal(model.countryCount, 1)
  assert.equal(model.displayedCountryCount, 4)
  assert.equal(model.displayedRecordCount, 9)
  assert.equal(model.displayedTripCount, 5)
  assert.equal(model.initials, '민수')
  assert.deepEqual(model.visitedCountries, [
    { countryCode: 'JP', countryName: '일본' },
    { countryCode: 'JP', countryName: '일본' },
  ])
})

test('profile page model은 지도·통계가 없을 때 여행 데이터 fallback을 유지한다', () => {
  const model = getProfilePageModel({
    trips: [
      { countryName: '일본', images: ['one'] },
      { countryName: '일본' },
      { countryName: '한국' },
    ],
  })

  assert.equal(model.countryCount, 2)
  assert.equal(model.displayedCountryCount, 2)
  assert.equal(model.displayedRecordCount, 1)
  assert.equal(model.displayedTripCount, 3)
  assert.equal(model.name, '닉네임 미설정')
  assert.equal(model.initials, '닉네')
  assert.deepEqual(model.visitedCountries, [])
})
