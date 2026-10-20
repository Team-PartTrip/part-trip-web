// Run with playwright-cli run-code. Uses local API fixtures only.
export default async function verifyCommentDraft(page, origin = 'http://127.0.0.1:5189') {
  page.setDefaultTimeout(8000)
  await page.unroute('**/*')
  const check = (ok, message) => { if (!ok) throw new Error(message) }
  let comment = '원래 코멘트', failSave = true, puts = 0
  await page.addInitScript(() => {
    localStorage.setItem('accessToken', 'fixture')
    window.acceptLeave = false
    window.confirmations = 0
    window.confirm = () => { window.confirmations += 1; return window.acceptLeave }
  })
  await page.route('**/*', async route => {
    const req = route.request(), url = new URL(req.url()), path = url.pathname.replace(/^\/api/, '')
    if (!['fetch', 'xhr'].includes(req.resourceType())) return url.origin === origin ? route.continue() : route.abort()
    if (url.origin !== origin) return route.abort()
    if (req.method() === 'PATCH') {
      puts += 1
      if (failSave) return route.fulfill({ status: 400, json: { message: '저장 실패 재현' } })
      comment = req.postDataJSON().comment
      return route.fulfill({ json: {} })
    }
    let data = []
    if (path === '/main/dday') data = { status: 'NO_TRIP' }
    if (path === '/notifications/unread-count') data = { unreadCount: 0 }
    if (path === '/travel-cards') data = [{ cardId: 1, title: '검증 여행', startDate: '2099-01-01', endDate: '2099-01-02' }]
    if (path === '/travel-cards/1') data = { cardId: 1, startDate: '2099-01-01', endDate: '2099-01-02', timeline: [{ entryId: 10, type: 'PHOTO', imageUrl: origin + '/favicon.png', comment }] }
    return route.fulfill({ json: data })
  })
  const unloadBlocked = () => page.evaluate(() => !window.dispatchEvent(new Event('beforeunload', { cancelable: true })))
  const plannerLink = () => page.getByRole('navigation', { name: '메인 메뉴' }).getByRole('link', { name: '플래너', exact: true })
  for (const width of [1440, 390]) {
    comment = '원래 코멘트'; failSave = true; puts = 0
    await page.setViewportSize({ width, height: 1000 })
    await page.goto(origin + '/record/1/edit?entryId=10')
    await page.getByRole('textbox').waitFor()
    check(!await unloadBlocked(), 'unchanged comment should not warn')
    await page.getByRole('textbox').fill('저장하지 않은 코멘트')
    check(await unloadBlocked(), 'dirty comment must warn before reload')
    await plannerLink().click()
    check(new URL(page.url()).pathname === '/record/1/edit', 'cancelled leave must remain in editor')
    check(await page.getByRole('textbox').inputValue() === '저장하지 않은 코멘트', 'cancelled leave must retain content')
    await page.getByRole('button', { name: '코멘트 저장', exact: true }).click()
    await page.getByRole('alert').filter({ hasText: '저장 실패 재현' }).waitFor()
    check(await unloadBlocked(), 'failed save must keep reload guard')
    check(await page.getByRole('textbox').inputValue() === '저장하지 않은 코멘트', 'failed save must retain content')
    const confirmations = await page.evaluate(() => window.confirmations)
    await page.screenshot({ path: `output/playwright/audit-comment-draft-${width}.png`, fullPage: true })
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'no horizontal overflow')
    failSave = false
    await page.getByRole('button', { name: '코멘트 저장', exact: true }).click()
    await page.waitForURL('**/record/1')
    check(await page.evaluate(() => window.confirmations) === confirmations, 'successful save must navigate without warning')
    check(puts === 2 && comment === '저장하지 않은 코멘트', 'successful retry must save content')
    await page.goto(origin + '/record/1/edit?entryId=10')
    await page.getByRole('textbox').fill('버릴 코멘트')
    await page.evaluate(() => { window.acceptLeave = true })
    await plannerLink().click()
    await page.waitForURL('**/planner')
    await page.getByRole('heading', { name: '플래너', exact: true }).waitFor()
  }
  return 'PASS comment draft: cancel leave, reload guard, failed save, successful retry, confirmed leave; desktop and mobile'
}
