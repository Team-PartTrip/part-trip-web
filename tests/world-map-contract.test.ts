import assert from 'node:assert/strict'
import test from 'node:test'
import { readSource as read } from './helpers.ts'

test('내 여행 지도는 대한민국 시·도 지도이며 국가 획득 경로는 닫혀 있다', () => {
  const page = read('/src/widgets/profile-insights/ui/ProfileMapPage.tsx')
  const mapView = read('/src/widgets/profile-insights/ui/ProfileMapView.tsx')
  const retiredClaimRoute = read('/src/routes/(app)/_authenticated/profile/claim/index.tsx')

  assert.match(page, /<ProfileMapView/)
  assert.match(mapView, /skorea-municipalities-topo\.json\?url/)
  assert.match(mapView, /countProvinceTrips\(trips\)/)
  assert.match(mapView, /방문한 시·도/)
  assert.doesNotMatch(`${page}\n${mapView}`, /<WorldMap/)
  assert.match(retiredClaimRoute, /redirect\(\{ to: paths\.profileMap \}\)/)
})
