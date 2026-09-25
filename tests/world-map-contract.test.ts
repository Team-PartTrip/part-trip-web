import assert from 'node:assert/strict'
import test from 'node:test'
import { readSource as read } from './helpers.ts'

test('내 여행 지도는 대한민국 시·도 지도이며 국가 획득 경로는 닫혀 있다', () => {
  const page = read('/src/widgets/profile-insights/ui/ProfileInsightPage.tsx')
  const views = read('/src/widgets/profile-insights/ui/ProfileInsightModeViews.tsx')
  const mapAsset = read('/src/shared/assets/figma/korea-regions.svg')
  const retiredClaimRoute = read('/src/routes/(app)/_authenticated/profile/claim/index.tsx')

  assert.match(page, /<ProfileMapView/)
  assert.match(views, /S\.KoreaMap/)
  assert.match(views, /방문한 지역 \{regions\.length\} \/ 17/)
  assert.match(mapAsset, /data-region="서울특별시"/)
  assert.match(mapAsset, /data-region="제주특별자치도"/)
  assert.doesNotMatch(`${page}\n${views}`, /<WorldMap/)
  assert.match(retiredClaimRoute, /redirect\(\{ to: paths\.profileMap \}\)/)
})
