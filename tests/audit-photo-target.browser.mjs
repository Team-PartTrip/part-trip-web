// Run with playwright-cli run-code. All API writes are fulfilled locally.
export default async function verifyPhotoTarget(page, origin = 'http://127.0.0.1:5189') {
  page.setDefaultTimeout(8000)
  await page.unroute('**/*')
  const check = (ok, message) => { if (!ok) throw new Error(message) }
  const image = { name: 'photo.png', mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jZioAAAAASUVORK5CYII=', 'base64') }
  let removed = false
  const writes = []
  await page.addInitScript(() => localStorage.setItem('accessToken', 'fixture'))
  await page.route('**/*', async route => {
    const req = route.request(), url = new URL(req.url()), path = url.pathname.replace(/^\/api/, '')
    if (!['fetch', 'xhr'].includes(req.resourceType())) return url.origin === origin ? route.continue() : route.abort()
    if (url.origin !== origin) return route.abort()
    if (req.method() !== 'GET') { writes.push(path); return route.fulfill({ json: { entryId: 10 } }) }
    let data = []
    if (path === '/main/dday') data = { status: 'NO_TRIP' }
    if (path === '/notifications/unread-count') data = { unreadCount: 0 }
    if (path === '/travel-cards') data = [
      ...(!removed ? [{ cardId: 1, title: '선택한 여행', startDate: '2099-01-01', endDate: '2099-01-02' }] : []),
      { cardId: 2, title: '다른 여행', startDate: '2098-01-01', endDate: '2098-01-02' },
    ]
    return route.fulfill({ json: data })
  })
  for (const width of [1440, 390]) {
    removed = false
    await page.setViewportSize({ width, height: 1000 })
    await page.goto(origin + '/trip-cards/new?cardId=999')
    await page.getByRole('alert').filter({ hasText: '선택한 여행카드를 찾을 수 없어요' }).waitFor()
    await page.locator('input[type=file]').setInputFiles(image)
    check(await page.getByRole('button', { name: '여행카드에 담기' }).isDisabled(), 'missing explicit ID must not fall back')
    await page.getByLabel('여행카드', { exact: true }).selectOption('2')
    await page.getByRole('button', { name: '여행카드에 담기' }).click()
    await page.getByText('1장의 사진을 여행카드에 추가했어요.', { exact: true }).waitFor()
    check(writes.at(-1) === '/travel-cards/2/entries', 'explicit reselection must choose the right target')
    await page.goto(origin + '/trip-cards/new?cardId=1')
    await page.getByRole('heading', { name: '선택한 여행 · 2099.01.01 시작', exact: true }).waitFor()
    check(await page.getByLabel('여행카드', { exact: true }).inputValue() === '1', 'numeric URL ID must select its card without fallback')
    await page.locator('input[type=file]').setInputFiles(image)
    const writeCount = writes.length
    removed = true
    await page.evaluate(() => {
      Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'hidden' })
      window.dispatchEvent(new Event('visibilitychange'))
      Object.defineProperty(document, 'visibilityState', { configurable: true, value: 'visible' })
      window.dispatchEvent(new Event('visibilitychange'))
    })
    await page.getByRole('alert').filter({ hasText: '선택한 여행카드를 찾을 수 없어요' }).waitFor()
    check(await page.getByRole('button', { name: '여행카드에 담기' }).isDisabled(), 'removed target must disable upload')
    check(await page.getByAltText('photo.png', { exact: true }).count() === 1, 'draft photo must be retained')
    check(writes.length === writeCount, 'missing target must not write to a different card')
    await page.screenshot({ path: `output/playwright/audit-photo-target-${width}.png`, fullPage: true })
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'no horizontal overflow')
  }
  console.log('PASS photo target: invalid ID, explicit reselection, removal during editing, retained draft; desktop and mobile')
}
