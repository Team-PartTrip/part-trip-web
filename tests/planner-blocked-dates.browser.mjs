// Run against the local app with isolated API fixtures. No production writes.
export default async function verifyPlannerDates(page, origin = 'http://localhost:5173') {
  const check = (value, message) => { if (!value) throw Error(message) }
  const trips = [{ plannerId: 1, cityName: '부산', startDate: '2026-10-31', endDate: '2026-10-31', status: 'CONFIRMED' }]
  page.setDefaultTimeout(5000)
  await page.clock.install({ time: new Date('2026-10-21T12:00:00+09:00') })
  await page.addInitScript(() => {
    localStorage.setItem('accessToken', 'isolated-date-fixture')
    sessionStorage.clear()
  })
  await page.unroute('**/*')
  await page.route('**/*', async route => {
    const request = route.request(), url = new URL(request.url())
    if (!['fetch', 'xhr'].includes(request.resourceType())) return url.origin === origin ? route.continue() : route.abort()
    const path = url.pathname.replace(/^\/api/, '')
    if (!/^\/(profile|planners|notifications|main|guardians)(\/|$)/.test(path)) return url.origin === origin ? route.continue() : route.abort()
    const headers = { 'access-control-allow-origin': origin, 'access-control-allow-credentials': 'true', 'access-control-allow-headers': '*' }
    if (request.method() === 'OPTIONS') return route.fulfill({ status: 204, headers })
    check(request.method() === 'GET', 'Unexpected API write')
    let data = []
    if (path === '/planners') data = trips
    if (path === '/profile/myInfo') data = { userId: 'fixture', nickName: '테스트' }
    if (path === '/notifications/unread-count') data = { unreadCount: 0 }
    return route.fulfill({ headers, json: data })
  })
  const open = async () => {
    await page.goto(`${origin}/planner/destination`)
    await page.getByRole('button', { name: '다음', exact: true }).waitFor({ state: 'visible' })
    await page.waitForFunction(() => !document.querySelector('button[type="submit"]')?.disabled)
  }
  const start = () => page.locator('#planner-start-date')
  const end = () => page.locator('#planner-end-date')
  const day = date => page.getByRole('dialog').locator(`[data-date="${date}"]`)
  const focused = async date => {
    await page.waitForFunction(value => document.activeElement?.getAttribute('data-date') === value, date)
    return true
  }
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 })
    await open()
    await start().click()
    check(await day('2026-10-31').isDisabled(), 'Occupied date is selectable')
    await day('2026-10-30').focus()
    await page.keyboard.press('ArrowRight')
    await day('2026-11-01').waitFor({ state: 'visible' })
    check(await focused('2026-11-01'), 'ArrowRight must skip blocked month end')
    await page.keyboard.press('ArrowLeft')
    await day('2026-10-30').waitFor({ state: 'visible' })
    check(await focused('2026-10-30'), 'ArrowLeft must skip blocked month end')
    await day('2026-10-30').click()
    await end().click()
    await page.getByRole('button', { name: '다음 달', exact: true }).click()
    check(await day('2026-11-01').isDisabled(), 'End date crosses an existing trip')
    await page.getByRole('button', { name: '이전 달', exact: true }).click()
    await day('2026-10-30').focus()
    await page.keyboard.press('ArrowRight')
    check(await focused('2026-10-30'), 'No available end date must leave focus in place')
    await day('2026-10-30').click()
    await start().click()
    await page.getByRole('button', { name: '다음 달', exact: true }).click()
    await day('2026-11-01').click()
    await end().click()
    await day('2026-11-02').click()
    await start().click()
    await page.getByRole('button', { name: '이전 달', exact: true }).click()
    await day('2026-10-30').click()
    check((await end().getAttribute('aria-label')).includes('날짜 선택'), 'Conflicting arrival date was retained')
    check(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), 'Horizontal overflow')
    await start().click()
    await page.screenshot({ path: `output/playwright/planner-month-boundary-${width}.png` })
  }
  trips[0].startDate = '2026-11-01'
  trips[0].endDate = '2026-11-30'
  await open()
  await start().click()
  await day('2026-10-31').focus()
  await page.keyboard.press('ArrowRight')
  await day('2026-12-01').waitFor({ state: 'visible' })
  check(await focused('2026-12-01'), 'Fully blocked month must be skipped')
  await page.keyboard.press('ArrowLeft')
  await day('2026-10-31').waitFor({ state: 'visible' })
  check(await focused('2026-10-31'), 'Fully blocked month must be skipped in reverse')
  return 'PASS: month boundary, blocked month, range limit, disabled dates, arrival reset, desktop/mobile'
}
