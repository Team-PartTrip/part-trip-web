import assert from 'node:assert/strict'
import test from 'node:test'
import { countProvinceTrips } from '../src/widgets/profile-insights/model/province-visits.ts'

test('시·도 방문은 사진 좌표 없이도 지역 코드로 집계하고 같은 카드를 중복 집계하지 않는다', () => {
  const counts = countProvinceTrips([{ tripCardId: 1, regionCode: '47', cityName: '경주' }, { tripCardId: 1, regionCode: '47' }, { tripCardId: 2, regionCode: '47130' }, { tripCardId: 3, regionCode: '11' }, { tripCardId: 4, regionCode: 'unknown' }])
  assert.equal(counts.size, 2)
  assert.equal(counts.get('47')?.size, 2)
  assert.equal(counts.get('11')?.size, 1)
})
