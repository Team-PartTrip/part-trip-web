import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createTestJiti } from './helpers.ts'

const jiti = createTestJiti()
const { useMainTravelQuery } = await jiti.import('./src/entities/travel/queries.ts') as typeof import('../src/entities/travel/queries.ts')
const { getTourPlace, getMoreTourPlaces } = await jiti.import('./src/entities/travel/api.ts') as typeof import('../src/entities/travel/api.ts')
const { apiClient } = await jiti.import('./src/shared/libs/api-client.ts') as typeof import('../src/shared/libs/api-client.ts')

test('홈 추천은 도시를 우선하고 지역명으로 대체하며 여행이 없으면 조회하지 않는다', () => {
  for (const [plan, city, enabled] of [
    [{ status: 'BEFORE', cityName: ' 경주 ', regionName: '경상북도' }, '경주', true],
    [{ status: 'DURING', cityName: ' ', regionName: ' 부산 ' }, '부산', true],
    [{ status: 'BEFORE', cityName: '서울' }, '서울', true],
    [{ status: 'NO_TRIP' }, undefined, false],
    [{ status: 'ENDED', cityName: '서울' }, '서울', false],
  ] as const) {
    const client = new QueryClient()
    client.setQueryData(['travel', 'dday'], plan)
    function Probe() { useMainTravelQuery(); return null }
    renderToString(createElement(QueryClientProvider, { client }, createElement(Probe)))
    const query = client.getQueryCache().find({ queryKey: ['travel', 'tour-places'], exact: false })!
    assert.deepEqual(query.queryKey, ['travel', 'tour-places', city ? '대한민국' : '', city ?? null, null])
    assert.equal(query.options.enabled, enabled)
    client.clear()
  }
})

test('관광지 목록과 더보기는 상대 사진 경로를 API 원점으로 변환한다', async () => {
  const originalGet = apiClient.get
  const originalBase = apiClient.defaults.baseURL
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')
  const places = [{ tourPlaceId: 1, imageUrl: '/api/main/tour-place/1/photo' }, { tourPlaceId: 2, imageUrl: 'https://images.example/2.jpg' }, { tourPlaceId: 3 }]
  Object.defineProperty(globalThis, 'window', { configurable: true, value: { location: { origin: 'https://frontend.example' } } })
  apiClient.defaults.baseURL = 'https://backend.example/api'
  apiClient.get = (async (path: string) => ({ data: path.endsWith('/more') ? { places, cursor: 'next' } : places })) as typeof apiClient.get
  try {
    const expected = [
      { tourPlaceId: 1, imageUrl: 'https://backend.example/api/main/tour-place/1/photo' },
      places[1], { tourPlaceId: 3, imageUrl: undefined },
    ]
    assert.deepEqual(await getTourPlace('대한민국', '경주'), expected)
    assert.deepEqual(await getMoreTourPlaces('대한민국', '경주', '관광'), { places: expected, cursor: 'next' })
    assert.equal(places[0].imageUrl, '/api/main/tour-place/1/photo')
  } finally {
    apiClient.get = originalGet
    apiClient.defaults.baseURL = originalBase
    if (previousWindow) Object.defineProperty(globalThis, 'window', previousWindow)
    else Reflect.deleteProperty(globalThis, 'window')
  }
})
