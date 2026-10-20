// Run with playwright-cli run-code. Isolated HTTP fixtures; no account writes.
export default async function verifyPreferences(page, origin = 'http://127.0.0.1:5189') {
  page.setDefaultTimeout(8000)
  const check = (ok, message) => { if (!ok) throw new Error(message) }
  let failLoad = true, failSave = true, saves = 0, generates = 0
  const preferences = { preferredTransport: 'PUBLIC_TRANSIT', dailyScheduleCount: 3, canUseStairs: true, avoidFoods: [] }
  await page.addInitScript(() => {
    localStorage.setItem('accessToken', 'fixture')
    sessionStorage.setItem('parttrip:planner-creation-draft', JSON.stringify({ cityName: '부산', regionCode: '6', regionName: '부산', startDate: '2099-01-01', endDate: '2099-01-02', isSolo: true, memberCount: 1 }))
  })
  await page.route('**/*', async route => {
    const req = route.request(), url = new URL(req.url()), path = url.pathname.replace(/^\/api/, '')
    if (!['fetch', 'xhr'].includes(req.resourceType())) return url.origin === origin ? route.continue() : route.abort()
    if (url.origin !== origin) return route.abort()
    if (path === '/profile/travel-preferences') {
      if (req.method() === 'GET' && failLoad) return route.fulfill({ status: 400, json: { message: 'fixture load failure' } })
      if (req.method() === 'PUT') {
        saves += 1
        if (failSave) return route.fulfill({ status: 400, json: { message: 'fixture save failure' } })
        Object.assign(preferences, req.postDataJSON())
      }
      return route.fulfill({ json: preferences })
    }
    if (path === '/planners/generate') { generates += 1; return route.fulfill({ json: { plannerId: 7, days: [] } }) }
    let data = []
    if (path === '/main/dday') data = { status: 'NO_TRIP' }
    if (path === '/notifications/unread-count') data = { unreadCount: 0 }
    if (path === '/profile/myInfo') data = { userId: 'fixture', nickName: '여행자' }
    if (path === '/planners/7') data = { plannerId: 7, role: 'OWNER', status: 'PLANNING', memberCount: 1 }
    if (path === '/planners/7/schedule') data = { plannerId: 7, days: [] }
    return route.fulfill({ json: data })
  })
  for (const width of [1440, 390]) {
    failLoad = true; failSave = true; saves = 0; generates = 0
    delete preferences.usesWheelchair
    preferences.avoidFoods = []
    await page.setViewportSize({ width, height: 1000 })
    await page.goto(origin + '/planner/explore')
    await page.getByRole('button', { name: '편의 설정 다시 불러오기' }).waitFor()
    check(generates === 0, 'load failure must not generate an itinerary')
    failLoad = false
    await page.getByRole('button', { name: '편의 설정 다시 불러오기' }).click()
    await page.getByRole('button', { name: '건너뛰기', exact: true }).click()
    await page.getByRole('button', { name: '휠체어를 써요', exact: true }).click()
    await page.getByRole('button', { name: '다음', exact: true }).click()
    await page.getByRole('button', { name: '해산물', exact: true }).click()
    await page.getByRole('button', { name: '다음', exact: true }).click()
    await page.getByRole('button', { name: 'AI로 일정 만들기', exact: true }).click()
    await page.getByText('여행 편의 조건을 저장하지 못했어요. 선택은 유지돼요. 다시 시도해주세요.', { exact: true }).waitFor()
    check(saves === 1 && generates === 0, 'save failure must stop before generation')
    await page.getByRole('button', { name: '이전', exact: true }).click()
    check(await page.getByRole('button', { name: '해산물', exact: true }).getAttribute('aria-pressed') === 'true', 'failed save must retain answers')
    await page.getByRole('button', { name: '다음', exact: true }).click()
    await page.screenshot({ path: `output/playwright/audit-preferences-${width}.png`, fullPage: true })
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'no horizontal overflow')
    failSave = false
    await page.getByRole('button', { name: 'AI로 일정 만들기', exact: true }).click()
    await page.waitForURL('**/planner/7')
    check(generates === 1 && saves === 2 && preferences.usesWheelchair === true && preferences.avoidFoods.includes('SEAFOOD'), 'retry must save answers before generation')
  }
  console.log('PASS preferences: load retry, save failure, preserved answers, successful retry; desktop and mobile')
}
