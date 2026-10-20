// Two browser tabs with shared storage and isolated API fixtures. No real accounts.
export default async function verifyAccountSwitch(page, origin = 'http://127.0.0.1:5189') {
  page.setDefaultTimeout(8000)
  const check = (ok, message) => { if (!ok) throw new Error(message) }
  const context = page.context()
  const writes = []
  await context.route('**/*', async route => {
    const req = route.request(), url = new URL(req.url()), path = url.pathname.replace(/^\/api/, '')
    if (!['fetch', 'xhr'].includes(req.resourceType())) return url.origin === origin ? route.continue() : route.abort()
    if (url.origin !== origin) return route.abort()
    if (req.method() !== 'GET') writes.push({ path, auth: req.headers().authorization })
    let data = []
    if (path === '/main/dday') data = { status: 'NO_TRIP' }
    if (path === '/notifications/unread-count') data = { unreadCount: 0 }
    if (path === '/travel-cards') data = [{ cardId: 1, title: 'A 계정의 여행', startDate: '2099-01-01', endDate: '2099-01-02' }]
    if (path === '/travel-cards/1') data = { cardId: 1, timeline: [{ entryId: 10, type: 'PHOTO', imageUrl: origin + '/favicon.png', comment: 'A 계정 코멘트' }] }
    return route.fulfill({ json: data })
  })
  await page.goto(origin + '/login')
  await page.evaluate(async () => {
    const { startAuthSession } = await import('/src/shared/libs/token-storage.ts')
    startAuthSession({ accessToken: 'account-A', refreshToken: 'refresh-A' })
    window.confirmations = 0
    window.confirm = () => { window.confirmations += 1; return false }
  })
  await page.goto(origin + '/record/1/edit?entryId=10')
  // A full navigation creates a fresh window, so install the confirm fixture again.
  await page.evaluate(() => {
    window.confirmations = 0
    window.confirm = () => { window.confirmations += 1; return false }
  })
  await page.getByRole('textbox').fill('A 계정에서 작성 중인 내용')
  const secondTab = await context.newPage()
  try {
    await secondTab.goto(origin + '/login')
    await secondTab.evaluate(async () => {
      const { startAuthSession } = await import('/src/shared/libs/token-storage.ts')
      startAuthSession({ accessToken: 'account-B', refreshToken: 'refresh-B' })
    })
    await page.waitForURL('**/login')
    await page.getByText('단디 시작하기', { exact: true }).waitFor()
    check(await page.getByRole('textbox').count() === 0, 'old account editor must unmount even with an unsaved draft')
    check(await page.evaluate(() => window.confirmations) === 0, 'account switch must bypass the draft blocker')
    check(await page.evaluate(() => localStorage.getItem('accessToken')) === 'account-B', 'other tab login must remain intact')
    check(writes.length === 0, 'account switch must not submit the old account draft')
    await page.goto(origin + '/record/1/edit?entryId=10')
    await page.getByRole('textbox').fill('다른 탭의 로그아웃 후 남기면 안 되는 내용')
    await secondTab.evaluate(() => {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    })
    await page.waitForURL('**/login')
    await page.getByText('단디 시작하기', { exact: true }).waitFor()
    check(await page.getByRole('textbox').count() === 0, 'logout by an older tab must also remove the editor')
    return 'PASS account switch: real shared-storage tabs, old editor removed, blocker bypassed, new session retained, no writes'
  } finally {
    await secondTab.close()
    await context.unroute('**/*')
  }
}
