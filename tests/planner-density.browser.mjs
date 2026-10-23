// Isolated API fixtures: no real account or server writes.
export default async function verifyDensity(page, origin = 'http://localhost:5173') {
  const check = (value, message) => { if (!value) throw Error(message) }
  await page.addInitScript(() => {
    localStorage.setItem('accessToken', 'density-fixture')
    sessionStorage.setItem('parttrip:planner-creation-draft', JSON.stringify({
      cityName: '대구', regionName: '대구', regionCode: '27', startDate: '2099-01-01', endDate: '2099-01-01', isSolo: true,
      blocks: [{ type: 'COMPANION', value: '혼자' }],
    }))
  })
  let generated
  await page.route('**/*', async route => {
    const url = new URL(route.request().url())
    if (!url.pathname.startsWith('/api/')) return url.origin === origin ? route.continue() : route.abort()
    const path = url.pathname.replace('/api', '')
    const headers = { 'access-control-allow-origin': origin, 'access-control-allow-credentials': 'true', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' }
    if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers })
    if (path === '/planners/generate') generated = route.request().postDataJSON()
    const data = path === '/planners/blocks' ? [
      { type: 'COMPANION', label: '동행', options: ['혼자'], multiple: false },
      { type: 'DAILY_DENSITY', label: '일정 밀도', options: ['하루 1~2곳', '하루 3~4곳', '직접 지정'], multiple: false },
      { type: 'WALKING', label: '걷기 부담', options: ['30분 이내'], multiple: false },
    ] : path === '/profile/travel-preferences' ? { avoidFoods: [], limitedWalking: false, usesWheelchair: false, canUseStairs: true }
      : path === '/profile/myInfo' ? { userId: 'density', nickName: '검증 사용자' }
      : path === '/planners/generate' ? { plannerId: 7, days: [] }
      : path === '/main/dday' ? { status: 'NO_TRIP' } : []
    return route.fulfill({ headers, json: data })
  })
  for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
    await page.setViewportSize(viewport)
    await page.goto(origin + '/planner/explore')
    await page.getByRole('button', { name: '혼자', exact: true }).click()
    await page.getByRole('button', { name: '직접 지정', exact: true }).click()
    const input = page.getByRole('spinbutton', { name: '하루에 방문할 곳 수' })
    await input.waitFor()
    check(await input.evaluate(element => element === document.activeElement), 'Input must receive focus')
    check(await page.getByRole('button', { name: '직접 지정', exact: true }).getAttribute('aria-pressed') === 'true', 'Custom option must remain selected')
    await page.getByRole('button', { name: '다음', exact: true }).click()
    await page.getByRole('alert').filter({ hasText: '정수로 입력' }).waitFor()
    for (const value of ['0', '7', '1.5']) {
      await input.fill(value)
      await page.getByRole('button', { name: /^(다음|건너뛰기)$/ }).click()
      await page.getByRole('alert').filter({ hasText: '정수로 입력' }).waitFor()
    }
    await input.fill('6')
    await page.screenshot({ path: `output/playwright/density-${viewport.width}.png`, fullPage: true })
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No horizontal overflow')
    await page.getByRole('button', { name: '다음', exact: true }).click()
    await page.getByRole('heading', { name: '걷기 부담', exact: true }).waitFor()
    await page.getByRole('button', { name: '이전', exact: true }).click()
    check(await input.inputValue() === '6', 'Custom number must survive Back')
    await page.getByRole('button', { name: '하루 1~2곳', exact: true }).click()
    await page.getByRole('heading', { name: '걷기 부담', exact: true }).waitFor()
    await page.getByRole('button', { name: '이전', exact: true }).click()
    check(await input.count() === 0, 'Preset selection must close the custom input')
    await page.getByRole('button', { name: '직접 지정', exact: true }).click()
    await input.fill('3')
    await page.getByRole('button', { name: '다음', exact: true }).click()
    await page.getByRole('button', { name: '건너뛰기', exact: true }).click()
    await page.getByRole('button', { name: '다음', exact: true }).click()
    await page.getByRole('button', { name: '다음', exact: true }).click()
    await page.getByRole('button', { name: 'AI로 일정 만들기', exact: true }).click()
    await page.waitForRequest(request => request.url().includes('/planners/7'))
    check(generated?.blocks?.some(block => block.type === 'DAILY_DENSITY' && block.value === '3'), 'Generate must submit the custom number')
  }
}
