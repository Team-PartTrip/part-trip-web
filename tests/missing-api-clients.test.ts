import assert from 'node:assert/strict'
import test from 'node:test'

import { REQUIRED_NEW_API_CLIENTS } from '../src/shared/utils/apiCoverage.ts'

test('새 Swagger 기능의 API client가 모두 등록되어 있다', () => {
  assert.deepEqual(REQUIRED_NEW_API_CLIENTS, [
    'POST /api/profile/image',
    'GET /api/profile/myInfo',
    'GET /api/profile/themes',
    'PUT /api/profile',
    'GET /api/main/today-phrase',
    'GET /api/main/countries',
    'GET /api/main/weather',
    'GET /api/main/exchange-rate',
    'GET /api/main/search/popular',
    'GET /api/main/search/recent',
    'POST /api/main/search/recent',
    'DELETE /api/main/search/recent/{recentSearchId}',
    'GET /api/mission',
    'GET /api/mission/completed',
    'PATCH /api/mission/{missionId}',
  ])
})
