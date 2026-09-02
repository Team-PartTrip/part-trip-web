import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const read = (path: string) => readFileSync(`${projectRoot}${path}`, 'utf8')

test('세계지도 API와 국가 획득 화면이 실제 서버 계약을 사용한다', () => {
  const api = read('/src/entities/world-map/api.ts')
  const page = read('/src/widgets/profile-insights/ui/ProfileInsightPage.tsx')

  assert.match(api, /base: '\/world-map'/)
  assert.match(api, /countries: '\/world-map\/countries'/)
  assert.match(api, /stats: '\/world-map\/stats'/)
  assert.doesNotMatch(api, /createUnsupportedApiError/)
  assert.match(api, /apiClient\.get<WorldMapResponseDto>\(WORLD_MAP_API_PATHS\.base\)/)
  assert.match(api, /apiClient\.post<AcquireCountryResponseDto>\(WORLD_MAP_API_PATHS\.countries, payload\)/)
  assert.match(api, /apiClient\.get<WorldMapCountryResponseDto>\(WORLD_MAP_API_PATHS\.country\(countryCode\)\)/)
  assert.match(api, /apiClient\.get<WorldMapStatsResponseDto>\(WORLD_MAP_API_PATHS\.stats\)/)
  assert.match(page, /useAcquireCountryMutation/)
  assert.match(page, /acquireCountryMutation\.mutateAsync\(\{\s*tripId/)
  assert.match(page, /isNew/)
})
