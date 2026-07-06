import assert from 'node:assert/strict'
import test from 'node:test'

import { REQUIRED_NEW_API_CLIENTS } from '../src/shared/api/apiCoverage.ts'

test('새 Swagger 기능의 API client가 모두 등록되어 있다', () => {
  assert.deepEqual(REQUIRED_NEW_API_CLIENTS, [
    'GET /api/profile/myInfo',
    'PUT /api/profile',
    'GET /api/profile/character',
    'GET /api/main/today-phrase',
    'POST /api/users/survey-complete',
    'GET /api/main/countries',
    'GET /api/main/weather',
    'GET /api/main/exchange-rate',
    'GET /api/main/search/popular',
    'GET /api/main/search/recent',
    'POST /api/main/search/recent',
    'DELETE /api/main/search/recent/{recentSearchId}',
  ])
})
