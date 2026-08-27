import assert from 'node:assert/strict'
import test from 'node:test'

import {
  findCountryForDestination,
  formatBoardContent,
} from '../src/widgets/community-write/model/form.ts'

test('커뮤니티 작성 입력을 국가와 게시글 내용으로 정규화한다', () => {
  const countries = [
    { cityName: '교토', countryInfoId: 1, countryName: '일본' },
    { cityName: '다낭', countryInfoId: 2, countryName: '베트남' },
  ]

  assert.equal(findCountryForDestination(countries, ' 교토, 일본 '), countries[0])
  assert.equal(findCountryForDestination(countries, '없는 곳'), undefined)
  assert.equal(formatBoardContent(' 교토 ', ' 여행 후기 '), '[교토]\n여행 후기')
  assert.equal(formatBoardContent(' ', ' 여행 후기 '), '여행 후기')
})
