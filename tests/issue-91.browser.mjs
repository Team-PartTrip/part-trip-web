// App API fixtures only; Kakao SDK and map tiles remain real. No account writes.
export default async function verifyGuardianMap(page, origin = 'http://localhost:5173') {
  const checks = [], polls = [], writes = []
  const check = (value, label) => { if (!value) throw Error(label); checks.push(label) }
  let location = { latitude: 35.79, longitude: 129.33, recordedAt: new Date().toISOString() }
  await page.route('**/*', async route => {
    const req = route.request(), path = new URL(req.url()).pathname.replace(/^\/api/, '')
    if (!['fetch', 'xhr'].includes(req.resourceType()) || !/^\/(profile|guardians|notifications|main)(\/|$)/.test(path)) return route.continue()
    const headers = { 'access-control-allow-origin': origin, 'access-control-allow-headers': '*', 'access-control-allow-methods': '*', 'access-control-allow-credentials': 'true' }
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers })
    if (req.method() !== 'GET') { writes.push(path); return route.fulfill({ status: 400, json: {}, headers }) }
    let data = []
    if (path === '/profile/myInfo') data = { userId: 'guardian', nickName: '보호자' }
    if (path === '/guardians/seniors') data = [{ userId: 's1', nickName: '가족 하나' }, { userId: 's2', nickName: '가족 둘' }]
    if (/^\/guardians\/seniors\/s[12]\/location$/.test(path)) { polls.push({ path, at: Date.now() }); return route.fulfill({ json: location, headers }) }
    if (path === '/notifications/unread-count') data = { unreadCount: 0 }
    return route.fulfill({ json: data, headers })
  })
  await page.addInitScript(() => localStorage.setItem('accessToken', 'isolated-guardian-test'))
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto(origin + '/profile/guardians')
  const firstMap = page.getByRole('region', { name: '가족 하나의 현재 위치 지도' })
  await firstMap.waitFor(); await page.waitForFunction(() => [...document.querySelectorAll('[aria-label="가족 하나의 현재 위치 지도"] img')].some(img => img.complete && img.naturalWidth >= 256))
  await page.getByText(/마지막 확인 .*방금 전/).waitFor()
  check(true, '실제 카카오 SDK·타일·핀과 방금 전 표시')
  await page.evaluate(() => {
    const maps = window.kakao.maps
    const probe = window.__guardianMapProbe = { maps: [], markers: [], moves: 0, detaches: 0 }
    maps.Map = new Proxy(maps.Map, { construct(Target, args, newTarget) { const map = Reflect.construct(Target, args, newTarget); probe.maps.push(map); return map } })
    maps.Marker = new Proxy(maps.Marker, { construct(Target, args, newTarget) {
      const marker = Reflect.construct(Target, args, newTarget); probe.markers.push(marker)
      const move = marker.setPosition.bind(marker), setMap = marker.setMap.bind(marker)
      marker.setPosition = position => { probe.moves++; move(position) }
      marker.setMap = map => { if (map === null) probe.detaches++; setMap(map) }
      return marker
    } })
  })
  await page.getByRole('button', { name: '선택하기', exact: true }).nth(1).click()
  const map = page.getByRole('region', { name: '가족 둘의 현재 위치 지도' })
  await map.waitFor(); await page.waitForFunction(() => window.__guardianMapProbe.maps.length === 1)
  await page.getByText(/마지막 확인 .*방금 전/).waitFor()
  location = { ...location, latitude: 35.83, longitude: 129.22 }
  const changedAt = Date.now()
  await page.waitForFunction(() => window.__guardianMapProbe.moves === 1, undefined, { timeout: 12000 })
  check(Date.now() - changedAt < 12000, '단축하지 않은 10초 갱신으로 위치 변경 반영')
  check(await page.evaluate(() => { const p = window.__guardianMapProbe, center = p.maps[0].getCenter(), pin = p.markers[0].getPosition(); return p.maps.length === 1 && p.markers.length === 1 && Math.abs(center.getLat() - 35.83) < 0.0001 && Math.abs(center.getLng() - 129.22) < 0.0001 && Math.abs(pin.getLat() - 35.83) < 1e-8 && Math.abs(pin.getLng() - 129.22) < 1e-8 }), '같은 지도·마커 인스턴스의 핀과 중심만 이동')
  const before = polls.filter(item => item.path.includes('/s2/')).length
  await page.waitForTimeout(10300)
  check(polls.filter(item => item.path.includes('/s2/')).length > before && await page.evaluate(() => window.__guardianMapProbe.moves === 1 && window.__guardianMapProbe.maps.length === 1), '같은 좌표 재조회 시 핀·지도 재생성 없음')
  await page.getByText('여행 중에는 앱이 꺼져 있어도 20초쯤마다 위치가 갱신돼요. 위치는 12시간 후 삭제돼요.', { exact: true }).waitFor()
  await page.screenshot({ path: 'output/playwright/issue-91-desktop.png', fullPage: true })
  await page.setViewportSize({ width: 375, height: 812 }); await map.scrollIntoViewIfNeeded(); check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), '375px 모바일 가로 넘침 없음'); await page.screenshot({ path: 'output/playwright/issue-91-mobile.png', fullPage: true }); await page.setViewportSize({ width: 1440, height: 1000 })
  // Only the minute-label case uses a virtual clock; the polling cases above use real time.
  await page.clock.install(); await page.reload(); await page.getByRole('region', { name: '가족 하나의 현재 위치 지도' }).waitFor()
  await page.clock.runFor(60_001); await page.getByText(/마지막 확인 .*1분 전/).waitFor(); check(true, '화면을 열어둔 채 1분 후 경과 시각 재계산')
  location = null; await page.reload(); await page.getByText('여행 중 앱을 열면 현재 위치가 여기에 표시돼요.', { exact: true }).waitFor()
  check(await page.getByRole('region', { name: /현재 위치 지도/ }).count() === 0 && await page.getByRole('link', { name: '지도에서 위치 보기' }).count() === 0, '빈 위치 응답은 기존 안내·지도 숨김 유지')
  location = { latitude: 35.79, longitude: 129.33, recordedAt: new Date().toISOString() }
  const sdkPattern = 'https://dapi.kakao.com/v2/maps/sdk.js**'
  await page.route(sdkPattern, route => route.abort())
  await page.reload(); await page.getByRole('button', { name: '지도 다시 불러오기' }).waitFor()
  check(await page.getByRole('link', { name: '지도에서 위치 보기' }).getAttribute('href') === 'https://maps.google.com/?q=35.79,129.33', 'SDK 실패 시 안내·기존 외부 지도 링크 유지')
  await page.unroute(sdkPattern); await page.getByRole('button', { name: '지도 다시 불러오기' }).click()
  await page.waitForFunction(() => [...document.querySelectorAll('[aria-label="가족 하나의 현재 위치 지도"] img')].some(img => img.complete && img.naturalWidth >= 256)); check(true, 'SDK 오류 후 실제 지도 재시도 성공')
  check(writes.length === 0, '실제 계정 쓰기 요청 없음')
  return { checks, api: 'Mock guardian API; real Kakao SDK/tiles; public test coordinates; real 10-second polling' }
}
