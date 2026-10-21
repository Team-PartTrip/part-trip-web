// Local app verification with isolated API fixtures. No production API writes.
export default async function verifyIssues(page, origin = 'http://localhost:5173') {
  const check = (value, message) => { if (!value) throw Error(message) }
  page.setDefaultTimeout(7000)
  const errors = [], requests = [], writes = []
  page.on('pageerror', error => errors.push(error.message))
  let confirmed = false, read = false
  const names = ['해운대 해수욕장', '부산시립미술관', '동백섬 산책로', '광안리 해변', '부산박물관', '용두산공원', '오륙도 전망대']
  const items = [{ key: 'RESTROOM', label: '화장실', text: '장애인 화장실 이용 가능' }, { key: 'PARKING', label: '주차', text: '장애인 전용 주차구역 있음' }]
  const responses = [
    { status: 'FOUND', matched: true, items },
    { status: 'NOT_FOUND', matched: false, items: [] },
    { status: 'UNAVAILABLE', matched: false, items: [] },
    { matched: false, items: [] },
    { matched: true, items },
    { status: 'FOUND', matched: false, items },
  ]
  await page.addInitScript(() => {
    localStorage.setItem('accessToken', 'isolated-issue-fixture')
    sessionStorage.clear()
    window.confirm = () => true
  })
  await page.unroute('**/*')
  await page.route('**/*', async route => {
    const request = route.request(), url = new URL(request.url()), path = url.pathname.replace(/^\/api/, '')
    if (!['fetch', 'xhr'].includes(request.resourceType())) return url.origin === origin ? route.continue() : route.abort()
    if (!/^\/(profile|planners|notifications|main|guardians)(\/|$)/.test(path)) return url.origin === origin ? route.continue() : route.abort()
    const headers = { 'access-control-allow-origin': origin, 'access-control-allow-credentials': 'true', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' }
    if (request.method() === 'OPTIONS') return route.fulfill({ status: 204, headers })
    if (request.method() !== 'GET') {
      writes.push({ method: request.method(), path })
      check(path === '/notifications/19/read' && request.method() === 'PATCH', `Unexpected write: ${path}`)
      read = true
      return route.fulfill({ status: 204, headers })
    }
    const accessibility = path.match(/^\/main\/tour-place\/(\d+)\/accessibility$/)
    if (accessibility) {
      const id = Number(accessibility[1]); requests.push(id)
      if (id === 7) return route.fulfill({ status: 404, headers, json: { message: 'fixture unavailable' } })
      return route.fulfill({ headers, json: responses[id - 1] })
    }
    let data = []
    if (path === '/profile/myInfo') data = { userId: 'owner', nickName: '검증 사용자' }
    if (path === '/planners/7') data = { plannerId: 7, title: '부산 무장애 여행', cityName: '부산', startDate: '2099-01-01', endDate: '2099-01-01', role: 'OWNER', status: confirmed ? 'CONFIRMED' : 'PLANNING', memberCount: 1 }
    if (path === '/planners/7/members') data = [{ userId: 'owner', nickName: '검증 사용자', role: 'OWNER' }]
    if (path === '/planners/7/schedule') data = { plannerId: 7, days: [{ date: '2099-01-01', slots: names.map((name, index) => ({ slotId: index + 1, tourPlaceId: index + 1, place: { tourPlaceId: index + 1, name, category: '관광지', address: '부산광역시', description: '부산의 바다와 문화를 만나는 여행지입니다.' } })) }] }
    if (path === '/main/tour-place') data = []
    if (path === '/notifications/unread-count') data = { unreadCount: read ? 0 : 1 }
    if (path === '/notifications') data = { items: [{ notificationId: 19, type: 'GUARDIAN_LINKED', category: 'GROUP', title: '보호자가 연결됐어요', body: '김가족님이 보호자로 연결됐어요.', linkType: 'GUARDIAN_LINK', linkId: 45, read, createdAt: new Date().toISOString() }], hasNext: false }
    if (path === '/guardians/me') data = [{ linkId: 45, userId: 'guardian', nickName: '김가족' }]
    return route.fulfill({ headers, json: data })
  })
  const card = index => page.locator('details').filter({ has: page.locator('summary strong', { hasText: names[index] }) })
  const screenshot = name => page.screenshot({ path: `output/playwright/${name}.png` })
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 })
    confirmed = false
    requests.length = 0
    await page.goto(origin + '/planner/7')
    await card(0).waitFor()
    check(requests.length === 0, 'Unconfirmed collapsed cards fetched accessibility')
    await card(0).locator('summary').click()
    await card(0).getByText('장애인 화장실 이용 가능', { exact: true }).waitFor()
    check(await card(0).getByRole('button', { name: '편의 시설 보기' }).count() === 0, 'Second accessibility button remains')
    check(requests.filter(id => id === 1).length === 1, 'Opening card must fetch accessibility once')
    await card(0).scrollIntoViewIfNeeded()
    await screenshot(`issues-108-112-found-${width}`)
    await card(1).locator('summary').click()
    await card(1).getByText('무장애 정보 없음', { exact: true }).waitFor()
    await card(1).scrollIntoViewIfNeeded()
    await screenshot(`issues-108-not-found-${width}`)
    await card(2).locator('summary').click()
    await card(2).getByText('지금은 확인할 수 없어요', { exact: true }).waitFor()
    await card(2).scrollIntoViewIfNeeded()
    await screenshot(`issues-108-unavailable-${width}`)
    for (const [index, text] of [[3, '무장애 정보 없음'], [4, '장애인 화장실 이용 가능'], [5, '장애인 화장실 이용 가능'], [6, '지금은 확인할 수 없어요']]) {
      await card(index).locator('summary').click()
      await card(index).getByText(text, { exact: true }).waitFor()
    }
    await card(0).locator('summary').click()
    await card(0).locator('summary').focus()
    await page.keyboard.press('Enter')
    await card(0).getByText('장애인 화장실 이용 가능', { exact: true }).waitFor()
    check(requests.filter(id => id === 1).length === 1, 'Reopening card refetched cached information')
    const sidebar = page.locator('aside').filter({ has: page.getByRole('navigation', { name: '메인 메뉴' }) })
    for (const position of [0, 500, 1500, 400, 0]) {
      await page.evaluate(y => window.scrollTo(0, y), position)
      const bounds = await sidebar.boundingBox()
      check(bounds && (width >= 768 ? Math.abs(bounds.y) < 1 : Math.abs(bounds.y + bounds.height - 1000) < 1), 'Sidebar moved with document scroll')
    }
    await page.evaluate(() => window.scrollTo(0, 900))
    await screenshot(`issues-110-sidebar-scrolled-${width}`)
    await page.getByRole('button', { name: '일정 편집', exact: true }).click()
    const editorDetails = page.locator('details').filter({ has: page.getByText('편의 시설 보기', { exact: true }) }).first()
    await editorDetails.locator('summary').click()
    await editorDetails.getByText('장애인 화장실 이용 가능', { exact: true }).waitFor()
    await editorDetails.scrollIntoViewIfNeeded()
    await screenshot(`issues-112-editing-${width}`)
    confirmed = true
    await page.goto(origin + '/planner/7')
    await card(1).locator('summary').getByText('무장애 정보 없음', { exact: true }).waitFor()
    await card(2).locator('summary').getByText('지금은 확인할 수 없어요', { exact: true }).waitFor()
    await card(1).scrollIntoViewIfNeeded()
    await screenshot(`issues-108-confirmed-${width}`)
    await page.goto(origin + '/notifications')
    await page.getByText('김가족님이 보호자로 연결됐어요.', { exact: true }).waitFor()
    await page.getByText('보호자', { exact: true }).waitFor()
    await screenshot(`issues-109-list-${width}`)
    await page.getByRole('button', { name: /알림: 보호자가 연결됐어요/ }).click()
    const dialog = page.getByRole('dialog', { name: '알림 상세' })
    await dialog.getByText('김가족님이 보호자로 연결됐어요.', { exact: true }).waitFor()
    await screenshot(`issues-109-detail-${width}`)
    await dialog.getByRole('button', { name: '보호자 연결 보러가기', exact: true }).click()
    await page.waitForURL('**/profile/guardians')
    await page.getByRole('heading', { name: '가족 연결', exact: true }).waitFor()
    await page.getByText('김가족', { exact: true }).waitFor()
    await screenshot(`issues-109-destination-${width}`)
    check(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), 'Horizontal overflow')
  }
  for (const [width, height] of [[1920, 1080], [1008, 536], [864, 459], [756, 402]]) {
    await page.setViewportSize({ width, height })
    await page.goto(origin + '/planner/7')
    await card(0).waitFor()
    const sidebar = page.locator('aside').filter({ has: page.getByRole('navigation', { name: '메인 메뉴' }) })
    for (const position of [0, 1000, 200, 1500]) {
      await page.evaluate(y => window.scrollTo(0, y), position)
      const bounds = await sidebar.boundingBox()
      check(bounds && (width >= 768 ? Math.abs(bounds.y) < 1 : Math.abs(bounds.y + bounds.height - height) < 1), `Sidebar moved at ${width}x${height}`)
    }
    await sidebar.getByRole('link', { name: '마이', exact: true }).scrollIntoViewIfNeeded()
    check(await sidebar.getByRole('link', { name: '마이', exact: true }).isVisible(), 'Last menu is inaccessible in a short viewport')
    check(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), `Horizontal overflow at ${width}x${height}`)
    await screenshot(`issues-110-sidebar-${width}x${height}`)
  }
  check(errors.length === 0, `Runtime errors: ${errors.join('; ')}`)
  return { result: 'PASS', issues: [108, 109, 110, 112], excluded: [111], widths: [1440, 390], isolatedReadWrites: writes, accessibilityRequests: requests.length }
}
