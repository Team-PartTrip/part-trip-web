// Real app with isolated API fixtures; no real account or backend writes.
export default async function verifyAuditFixes(page, origin = 'http://127.0.0.1:5174') {
  page.setDefaultTimeout(8000)
  const check = (ok, message) => { if (!ok) throw Error(message) }
  const notice = '여행이 끝난 카드에는 사진을 더 붙일 수 없어요'
  const places = [{ tourPlaceId: 1, name: '검사 장소 A' }, { tourPlaceId: 2, name: '검사 장소 B' }]
  const initialDays = () => [{ date: '2099-01-01', slots: places.map((place, i) => ({ slotId: i + 1, tourPlaceId: place.tourPlaceId, place })) }]
  const firstPage = Array.from({ length: 30 }, (_, i) => ({ notificationId: i + 1, title: `알림 ${i + 1}`, type: 'REGION_VISITED', linkType: 'REGION_MAP', read: true }))
  const requests = [], writes = [], errors = []
  let days = initialDays(), failOlder = false, futureTrip = false, hasPhoto = false
  page.on('pageerror', error => errors.push(error.message))
  await page.route('**/*', async route => {
    const req = route.request(), url = new URL(req.url()), path = url.pathname.replace(/^\/api/, '')
    if (!['fetch', 'xhr'].includes(req.resourceType())) return url.origin === origin ? route.continue() : route.abort()
    requests.push(path + url.search)
    const headers = { 'access-control-allow-origin': origin, 'access-control-allow-headers': '*', 'access-control-allow-methods': '*', 'access-control-allow-credentials': 'true' }
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers })
    if (req.method() !== 'GET') {
      writes.push({ path, method: req.method() })
      if (path === '/planners/7/schedule') days = req.postDataJSON().days
      return route.fulfill({ json: { plannerId: 7, days }, headers })
    }
    if (path === '/notifications' && url.searchParams.has('cursor') && failOlder) return route.fulfill({ status: 500, json: { message: 'fixture failure' }, headers })
    let data = []
    if (path === '/main/dday') data = { status: 'NO_TRIP' }
    if (path === '/notifications/unread-count') data = { unreadCount: 0 }
    if (path === '/notifications') data = url.searchParams.has('cursor') ? { items: [{ notificationId: 31, title: '오래된 알림', type: 'REGION_VISITED', linkType: 'REGION_MAP', read: true }], hasNext: false } : { items: firstPage, nextCursor: 30, hasNext: true }
    if (path === '/profile/myInfo') data = { userId: 'audit', nickName: '검사' }
    if (path === '/planners/7') data = { plannerId: 7, title: '검사용 일정', cityName: '경주', status: 'DRAFT', role: 'OWNER', memberCount: 1 }
    if (path === '/planners/7/schedule') data = { plannerId: 7, days }
    if (path === '/travel-cards') data = [{ cardId: 7, cityName: '경주', startDate: '2000-01-01', endDate: futureTrip ? '2099-01-02' : '2000-01-02', photoCount: 1, coverImageUrl: origin + '/favicon.png' }]
    if (path === '/travel-cards/7') data = { cardId: 7, startDate: '2000-01-01', endDate: futureTrip ? '2099-01-02' : '2000-01-02', timeline: hasPhoto ? [{ entryId: 1, type: 'PHOTO', imageUrl: origin + '/favicon.png' }] : [] }
    if (path === '/guardians/seniors') data = [{ userId: 'senior', nickName: '가족' }]
    if (path === '/guardians/seniors/senior/planners') data = [{ plannerId: 7, title: '검사용 일정' }]
    if (path === '/guardians/seniors/senior/planners/7/schedule') data = { days }
    if (path === '/guardians/seniors/senior/location') data = null
    return route.fulfill({ json: data, headers })
  })
  await page.addInitScript(() => {
    localStorage.setItem('accessToken', 'isolated-audit-fixture')
    window.auditDialogs = []
    window.auditAcceptLeave = false
    window.confirm = message => { window.auditDialogs.push(message); return window.auditAcceptLeave }
  })
  const dialogCount = () => page.evaluate(() => window.auditDialogs.length)
  const unloadBlocked = () => page.evaluate(() => { const e = new Event('beforeunload', { cancelable: true }); window.dispatchEvent(e); return e.defaultPrevented })
  const notificationLink = () => page.getByRole('link', { name: '알림', exact: true }).first()
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto(origin + '/notifications/31')
    await page.getByRole('heading', { name: '오래된 알림', exact: true }).waitFor()
    check(requests.some(path => path.includes('cursor=30')), '대상 알림의 다음 페이지를 조회하지 않음')
    await page.goto(origin + '/notifications/999')
    await page.getByText('알림을 찾을 수 없어요.', { exact: true }).waitFor()
    failOlder = true
    await page.goto(origin + '/notifications/31')
    await page.getByRole('alert').filter({ hasText: '알림을 불러오지 못했어요.' }).waitFor()
    failOlder = false
    days = initialDays()
    await page.goto(origin + '/planner/7')
    await page.getByRole('button', { name: '일정 편집', exact: true }).click()
    check(!await unloadBlocked(), '변경하지 않은 편집에도 종료 경고 발생')
    await page.getByRole('button', { name: '삭제', exact: true }).first().click()
    check(await unloadBlocked(), '변경한 일정에 종료 경고가 없음')
    const previousDialogs = await dialogCount()
    await page.evaluate(() => { window.auditAcceptLeave = false })
    await notificationLink().click()
    check(await dialogCount() === previousDialogs + 1, '이탈 확인 누락')
    check(new URL(page.url()).pathname === '/planner/7', '취소해도 화면을 이탈함')
    check(await page.getByRole('button', { name: '일정 저장', exact: true }).isEnabled(), '이탈 취소 시 초안 유실')
    await page.evaluate(() => { window.auditAcceptLeave = true })
    await notificationLink().click()
    await page.waitForURL('**/notifications')
    await page.getByRole('heading', { name: '알림', exact: true }).waitFor()
    await page.goto(origin + '/planner/7')
    await page.getByRole('button', { name: '일정 편집', exact: true }).click()
    check(await page.getByRole('button', { name: '삭제', exact: true }).count() === 2, '허용한 이탈 이후 잘못된 초안 복원')
    await page.getByRole('button', { name: '삭제', exact: true }).first().click()
    await page.getByRole('button', { name: '일정 저장', exact: true }).click()
    await page.getByText('일정을 저장했습니다.', { exact: true }).waitFor()
    check(!await unloadBlocked(), '저장 이후에도 종료 경고가 남음')
    const savedDialogs = await dialogCount()
    await notificationLink().click()
    await page.waitForURL('**/notifications')
    await page.getByRole('heading', { name: '알림', exact: true }).waitFor()
    check(await dialogCount() === savedDialogs, '저장 이후에도 이탈 확인 발생')
    futureTrip = false
    for (hasPhoto of [false, true]) {
      await page.goto(origin + '/record')
      await page.getByRole('button').filter({ hasText: '경주 여행' }).click()
      await page.getByText(notice, { exact: true }).waitFor()
      check(await page.getByRole('button', { name: /^사진 추가/ }).count() === 0, '종료된 여행의 추가 버튼 잔존')
      if (!hasPhoto) {
        await page.getByRole('heading', { name: '아직 남긴 사진이 없어요' }).waitFor()
        check(await page.locator('main img').count() === 0, '빈 상세에서 캐시 사진이 복원됨')
      }
      await page.screenshot({ path: `output/playwright/audit-ended-record-${width}-${hasPhoto}.png` })
    }
    futureTrip = true; hasPhoto = false
    await page.goto(origin + '/record/7')
    await page.getByRole('button', { name: '사진 추가하기', exact: true }).waitFor()
    await page.goto(origin + '/profile/guardians')
    await page.getByText(/웹에서는 여행 중 화면을 열어 둔 동안 약 90초마다/).waitFor()
    check(await page.getByText(/앱이 꺼져 있어도/).count() === 0, '잘못된 백그라운드 안내 잔존')
    check(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), '모바일 가로 넘침')
  }
  check(errors.length === 0, errors.join('\n'))
  check(writes.length === 2 && writes.every(write => write.path === '/planners/7/schedule' && write.method === 'PUT'), '예상 밖의 쓰기 요청')
  return 'PASS: desktop/mobile notification paging/missing/error, draft leave cancel/confirm/unload/save, deleted-photo cache, ended/active detail entry, guardian copy'
}
