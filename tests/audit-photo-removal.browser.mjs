// Run with playwright-cli run-code. Multipart writes are intercepted locally.
export default async function verifyPhotoRemoval(page, origin = 'http://127.0.0.1:5189') {
  page.setDefaultTimeout(8000)
  await page.unroute('**/*')
  const check = (ok, message) => { if (!ok) throw new Error(message) }
  const image = name => ({ name, mimeType: 'image/png', buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jZioAAAAASUVORK5CYII=', 'base64') })
  let finishUpload
  await page.addInitScript(() => {
    localStorage.setItem('accessToken', 'fixture')
    const revoke = URL.revokeObjectURL.bind(URL)
    window.revokedPhotos = []
    URL.revokeObjectURL = url => { window.revokedPhotos.push(url); revoke(url) }
  })
  await page.route('**/*', async route => {
    const req = route.request(), url = new URL(req.url()), path = url.pathname.replace(/^\/api/, '')
    if (!['fetch', 'xhr'].includes(req.resourceType())) return url.origin === origin ? route.continue() : route.abort()
    if (url.origin !== origin) return route.abort()
    if (req.method() === 'POST') {
      await new Promise(resolve => { finishUpload = resolve })
      return route.fulfill({ json: { entryId: 10 } })
    }
    let data = []
    if (path === '/main/dday') data = { status: 'NO_TRIP' }
    if (path === '/notifications/unread-count') data = { unreadCount: 0 }
    if (path === '/travel-cards') data = [{ cardId: 1, title: '검증 여행', startDate: '2099-01-01', endDate: '2099-01-02' }]
    return route.fulfill({ json: data })
  })
  for (const width of [1440, 390]) {
    finishUpload = undefined
    await page.setViewportSize({ width, height: 1000 })
    await page.goto(origin + '/trip-cards/new?cardId=1')
    await page.locator('input[type=file]').setInputFiles(['a.png', 'b.png', 'c.png', 'wrong.png'].map(image))
    const removedUrl = await page.getByAltText('wrong.png', { exact: true }).getAttribute('src')
    const remove = page.getByRole('button', { name: 'wrong.png 선택 해제', exact: true })
    await remove.focus()
    await page.keyboard.press('Enter')
    check(await page.getByAltText('wrong.png', { exact: true }).count() === 0, 'keyboard removal must remove only the chosen file')
    check(await page.getByRole('button', { name: /선택 해제$/ }).count() === 3, 'other selected files must remain')
    check(await page.evaluate(url => window.revokedPhotos.includes(url), removedUrl), 'removed preview URL must be released')
    await page.locator('input[type=file]').setInputFiles(image('replacement.png'))
    check(await page.getByRole('button', { name: /선택 해제$/ }).count() === 4, 'removal must free a selection slot')
    for (const name of ['a.png', 'b.png', 'c.png']) await page.getByRole('button', { name: `${name} 선택 해제`, exact: true }).click()
    await page.getByRole('textbox', { name: '코멘트' }).fill('선택 변경 후에도 유지할 코멘트')
    await page.getByRole('button', { name: 'replacement.png 선택 해제', exact: true }).click()
    check(await page.getByRole('textbox', { name: '코멘트' }).inputValue() === '선택 변경 후에도 유지할 코멘트', 'removal must keep the comment')
    check(await page.getByRole('button', { name: '여행카드에 담기' }).isDisabled(), 'removing all files must disable upload')
    await page.locator('input[type=file]').setInputFiles(image('final.png'))
    await page.screenshot({ path: `output/playwright/audit-photo-removal-${width}.png`, fullPage: true })
    check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'no horizontal overflow')
    await page.getByRole('button', { name: '여행카드에 담기' }).click()
    check(await page.getByRole('button', { name: 'final.png 선택 해제', exact: true }).isDisabled(), 'uploading photo must not be removable')
    await page.waitForFunction(() => document.querySelector('button[type=submit]')?.textContent.includes('업로드 중'))
    while (!finishUpload) await new Promise(resolve => setTimeout(resolve, 10))
    finishUpload()
    await page.getByText('1장의 사진을 여행카드에 추가했어요.', { exact: true }).waitFor()
  }
  return 'PASS photo removal: keyboard removal, URL cleanup, replacement, empty selection, preserved comment, upload lock; desktop and mobile'
}
