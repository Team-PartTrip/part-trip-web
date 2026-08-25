import assert from 'node:assert/strict'
import test from 'node:test'

import { toTripUpdateRequest } from '../src/widgets/record-detail/model/tripForm.ts'

test('여행 기록 수정 시 기존 이미지와 장소를 보존한다', () => {
  const payload = toTripUpdateRequest(
    {
      countryInfoId: 7,
      images: ['/a.jpg'],
      places: [{ dayNumber: 1, placeName: '마리나 베이', placeSub: '야경' }],
    },
    { content: '수정 메모', endDate: '2026-07-03', startDate: '2026-07-01', title: '수정 제목' },
  )

  assert.equal(payload.countryInfoId, 7)
  assert.deepEqual(payload.images, ['/a.jpg'])
  assert.deepEqual(payload.places, [{ dayNumber: 1, placeName: '마리나 베이', placeSub: '야경' }])
})
