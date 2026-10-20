// Local app with isolated API/geolocation fixtures. No production writes.
export default async function verifyIssues(page, origin = 'http://127.0.0.1:5174') {
  const check = (condition, label) => { if (!condition) throw new Error(label) }
  const writes = [], errors = []
  page.on('pageerror', error => errors.push(error.message))
  page.setDefaultTimeout(7000)
  let role = 'OWNER', status = 'CONFIRMED', rejected = false, slowList = false, slowPhoto = false
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(new Date())
  const photo = origin + '/favicon.png'
  const summary = [
    { cardId: 63, title: '가족 부산 모임', cityName: '부산', startDate: today, endDate: '2099-01-02', photoCount: 3, coverImageUrl: photo },
    { cardId: 64, title: '대구 나들이', cityName: '대구', startDate: '2026-10-01', endDate: '2026-10-02', photoCount: 0 },
  ]
  await page.addInitScript(() => {
    localStorage.setItem('accessToken', 'isolated-fixture')
    window.confirm = () => true
    window.__positions = []
    Object.defineProperty(navigator, 'geolocation', { configurable: true, value: { getCurrentPosition: (success, failure) => window.__positions.push({ success, failure }) } })
    Object.defineProperty(navigator, 'share', { configurable: true, value: async data => { window.__shared = data } })
  })
  await page.route('**/*', async route => {
    const req = route.request(), path = new URL(req.url()).pathname.replace(/^\/api/, '')
    if (!['fetch', 'xhr'].includes(req.resourceType()) || !/^\/(profile|main|planners|notifications|guardians|travel-cards|location)(\/|$)/.test(path)) {
      if (req.url() === photo && slowPhoto) await new Promise(resolve => setTimeout(resolve, 1200))
      return new URL(req.url()).origin === origin ? route.continue() : route.abort()
    }
    const headers = { 'access-control-allow-origin': origin, 'access-control-allow-headers': '*', 'access-control-allow-methods': '*', 'access-control-allow-credentials': 'true' }
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers })
    if (req.method() !== 'GET') {
      writes.push({ method: req.method(), path, body: req.postData() ? req.postDataJSON() : null })
      if (rejected) return route.fulfill({ status: 400, headers, json: { message: '여행이 시작된 뒤에는 플래너에서 나갈 수 없습니다.' } })
      return route.fulfill({ headers, json: path === '/planners/join' ? { plannerId: 7 } : {} })
    }
    let data = []
    if (path === '/profile/myInfo') data = { userId: role === 'OWNER' ? 'owner' : 'guest', nickName: '여행자', email: null }
    if (path === '/profile/stats') data = { tripCount: 2 }
    if (path === '/guardians/me') data = [{ linkId: 1, userId: 'guardian', nickName: '보호자' }]
    if (path === '/main/dday') data = { status: 'DURING', cityName: '부산', startDate: today, endDate: '2099-01-02', todaySchedule: [] }
    if (path === '/notifications/unread-count') data = { unreadCount: 3 }
    if (path === '/notifications') data = { items: [{ notificationId: 1, title: '같은 사건', body: '한 번만 표시', category: 'GROUP' }, { notificationId: 1, title: '같은 사건', body: '한 번만 표시', category: 'GROUP' }, { notificationId: 2, title: '다른 사건', category: 'GROUP' }], hasNext: false }
    if (path === '/planners') { if (slowList) await new Promise(resolve => setTimeout(resolve, 1000)); data = [{ plannerId: 7, title: summary[0].title, cityName: '부산', startDate: today, endDate: '2099-01-02', status: 'CONFIRMED' }] }
    if (path === '/planners/7') data = { plannerId: 7, title: summary[0].title, role, status, memberCount: 2, startDate: status === 'CONFIRMED' ? '2099-01-01' : today, endDate: '2099-01-02' }
    if (path === '/planners/7/members') data = [{ userId: 'owner', nickName: '그룹장', role: 'OWNER' }, { userId: 'guest', nickName: '동행', role: 'MEMBER', status: 'ACTIVE' }]
    if (path === '/planners/7/schedule') data = { plannerId: 7, days: [{ date: today, slots: [] }] }
    if (path === '/travel-cards') data = summary
    if (path === '/travel-cards/63') data = { cardId: 63, startDate: today, endDate: '2099-01-02', timeline: [{ entryId: 1, imageUrl: photo, type: 'PHOTO', takenAt: '2026-10-20T11:21:00', takenAtSource: 'MANUAL' }] }
    return route.fulfill({ headers, json: data })
  })
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 })
    role = 'OWNER'; status = 'CONFIRMED'
    slowList = true
    await page.goto(origin + '/planner')
    await page.getByRole('status').filter({ hasText: '여행 계획을 불러오는 중이에요.' }).waitFor()
    slowList = false
    await page.getByRole('tab', { name: '여행 중' }).click()
    await page.getByRole('button', { name: /가족 부산 모임/ }).waitFor()
    check((await page.getByRole('button', { name: /가족 부산 모임/ }).innerText()).includes('여행 중'), 'Tab badge mismatch')
    await page.getByLabel('초대받은 여행에 참여하기').fill('https://dandi-trip.me/planner/group?inviteCode=TEST123')
    await page.getByRole('button', { name: '참여하기', exact: true }).click()
    await page.getByRole('button', { name: '플래너 삭제', exact: true }).waitFor()
    check(writes.some(write => write.path === '/planners/join' && write.body.inviteCode === 'TEST123'), 'Join payload mismatch')
    check(await page.getByText('동행', { exact: true }).count() > 0, 'Members missing')
    check(await page.getByRole('button', { name: '내보내기', exact: true }).count() === 1, 'Owner removal protection failed')
    await page.getByRole('button', { name: '내보내기', exact: true }).click()
    check(writes.some(write => write.path === '/planners/7/members/guest' && write.method === 'DELETE'), 'Kick did not reach API')
    await page.screenshot({ path: `output/playwright/issues-98-106-planner-${width}.png`, fullPage: true })
    status = 'DONE'
    await page.reload()
    await page.getByRole('heading', { name: '함께하는 사람 2명' }).waitFor()
    check(await page.getByRole('button', { name: '내보내기', exact: true }).count() === 0, 'Completed planner exposes kick')
    status = 'CONFIRMED'
    await page.reload()
    await page.getByRole('button', { name: '플래너 삭제', exact: true }).click()
    await page.waitForURL('**/planner')
    check(writes.some(write => write.path === '/planners/7' && write.method === 'DELETE'), 'Planner deletion missing')
    role = 'MEMBER'
    await page.goto(origin + '/planner/7')
    await page.getByRole('button', { name: '플래너 나가기', exact: true }).waitFor()
    check(await page.getByRole('button', { name: '플래너 삭제', exact: true }).count() === 0, 'Member can delete planner')
    rejected = true
    await page.getByRole('button', { name: '플래너 나가기', exact: true }).click()
    await page.getByRole('alert').filter({ hasText: '여행이 시작된 뒤에는 플래너에서 나갈 수 없습니다.' }).waitFor()
    rejected = false
    await page.getByRole('button', { name: '플래너 나가기', exact: true }).click()
    await page.waitForURL('**/planner')
    status = 'TRAVELING'
    await page.goto(origin + '/planner/7')
    await page.getByRole('heading', { name: '함께하는 사람 2명' }).waitFor()
    check(await page.getByRole('button', { name: '플래너 나가기', exact: true }).count() === 0, 'Traveling member can leave')
    role = 'OWNER'; status = 'CONFIRMED'
    await page.goto(origin + '/trip-cards')
    await page.getByRole('button', { name: '여행카드 공유하기' }).waitFor()
    await page.getByRole('button', { name: '다음', exact: true }).click()
    await page.getByRole('button', { name: '이전', exact: true }).waitFor({ state: 'visible' })
    await page.waitForFunction(() => document.querySelector('[aria-label="2번째 여행카드"]').getAttribute('aria-current') === 'true')
    await page.waitForFunction(() => { const el = document.querySelector('[aria-label="여행카드 목록"]'); return Math.abs(el.scrollLeft - el.clientWidth) < 1 })
    await page.getByRole('button', { name: '여행카드 공유하기' }).click()
    check((await page.evaluate(() => window.__shared.text)).includes('대구 나들이'), 'Shared wrong card')
    check(await page.getByText('정보 없음', { exact: true }).count() === 0, 'Unknown place metric remains')
    await page.screenshot({ path: `output/playwright/issues-98-106-cards-${width}.png`, fullPage: true })
    await page.getByRole('button', { name: '관리 · 삭제' }).click()
    await page.waitForURL('**/trip-cards/delete')
    await page.goto(origin + '/record')
    await page.getByRole('img', { name: '가족 부산 모임 대표 사진' }).waitFor()
    await page.getByText('아직 사진이 없어요').waitFor()
    await page.screenshot({ path: `output/playwright/issues-98-106-records-${width}.png`, fullPage: true })
    slowPhoto = true
    await page.goto(origin + '/record/63')
    await page.getByRole('status').filter({ hasText: '사진을 불러오는 중이에요.' }).waitFor()
    await page.getByText(/2026. 10. 20. 오전 11:21/).waitFor()
    await page.getByRole('button', { name: '촬영 시각 수정' }).click()
    check(await page.getByLabel('촬영 시각', { exact: true }).inputValue() === '2026-10-20T11:21', 'Time input shifted')
    await page.getByLabel('촬영 시각', { exact: true }).fill('2026-10-20T12:34')
    await page.getByRole('button', { name: '저장', exact: true }).click()
    check(writes.some(write => write.body?.takenAt === '2026-10-20T12:34:00'), 'Saved UTC time instead of Korean time')
    slowPhoto = false
    await page.goto(origin + '/main')
    await page.getByRole('heading', { name: '가족 부산 모임', exact: true }).waitFor()
    await page.goto(origin + '/profile')
    await page.getByRole('heading', { name: '마이페이지' }).waitFor()
    check(!await page.getByText('@owner', { exact: true }).count(), 'Internal ID exposed')
    await page.goto(origin + '/profile/guardians')
    await page.getByRole('button', { name: '위치 공유 켜기' }).waitFor()
    check(await page.evaluate(() => window.__positions.length) === 0, 'Location auto-started')
    await page.getByRole('button', { name: '위치 공유 켜기' }).click()
    await page.waitForFunction(() => window.__positions.length === 1)
    await page.evaluate(() => window.__positions[0].success({ coords: { latitude: 37, longitude: 127 } }))
    await page.getByRole('status').filter({ hasText: '이 기기의 위치를 공유 중이에요.' }).waitFor()
    await page.getByRole('button', { name: '위치 공유 끄기' }).click()
    const locationWrites = writes.filter(write => write.path === '/location').length
    await page.evaluate(() => { window.__positions[0].success({ coords: { latitude: 38, longitude: 128 } }); document.dispatchEvent(new Event('visibilitychange')) })
    check(writes.filter(write => write.path === '/location').length === locationWrites, 'Location continued after stopping')
    await page.screenshot({ path: `output/playwright/issues-98-106-sharing-${width}.png`, fullPage: true })
    check(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), 'Mobile horizontal overflow')
    await page.goto(origin + '/notifications')
    await page.getByText('같은 사건', { exact: true }).waitFor()
    check(await page.getByText('같은 사건', { exact: true }).count() === 1, 'Repeated notification ID rendered twice')
  }
  check(errors.length === 0, 'Runtime errors: ' + errors.join(', '))
  return { result: 'PASS', widths: [1440, 390], mockedWrites: writes.length, runtimeErrors: errors }
}
