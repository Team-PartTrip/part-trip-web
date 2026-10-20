// Local component fixtures with mocked uploads; no real account or server writes.
export default async function verifyPhotoUploads(page, origin = 'http://127.0.0.1:5174') {
  page.setDefaultTimeout(5000)
  await page.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort())
  const notice = '여행이 끝난 카드에는 사진을 더 붙일 수 없어요'
  const check = (value, message) => { if (!value) throw Error(message) }
  const open = query => page.goto(`${origin}/tests/issues-96-97-regressions.html?${query}`)
  const select = () => page.getByLabel('여행카드', { exact: true })
  const upload = () => page.getByRole('button', { name: '여행카드에 담기', exact: true })
  const input = () => page.locator('input[type=file]')
  const pick = async () => input().evaluate(el => {
    const files = new DataTransfer()
    for (const [name, type] of [['valid.png', 'image/png'], ['phone.heic', 'image/heic'], ['animation.gif', 'image/gif']]) {
      files.items.add(new File([Uint8Array.from(atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a6uoAAAAASUVORK5CYII='), c => c.charCodeAt(0))], name, { type }))
    }
    el.files = files.files
    el.dispatchEvent(new Event('change', { bubbles: true }))
  })
  for (const [width, height] of [[1440, 1000], [390, 844]]) {
    await page.setViewportSize({ width, height })
    await open('')
    await page.getByRole('status').filter({ hasText: notice }).waitFor()
    check(await upload().isDisabled(), 'Ended trip upload enabled')
    check(await input().isDisabled(), 'Ended trip picker enabled')
    await page.locator('form').evaluate(el => el.requestSubmit())
    await page.getByRole('alert').filter({ hasText: notice }).waitFor()
    check((await page.evaluate(() => fixtureUploads)).length === 0, 'Ended trip reached upload API')
    await select().selectOption('2')
    check(await input().getAttribute('accept') === 'image/jpeg,image/png,image/webp', 'Picker accept mismatch')
    await pick()
    const alert = await page.getByRole('alert').innerText()
    check(alert.includes('phone.heic') && alert.includes('animation.gif') && alert.includes('JPEG, PNG, WebP'), 'Missing rejection advice')
    check(await page.getByRole('button', { name: 'valid.png 선택됨' }).count() === 1, 'Valid photo lost')
    check(await upload().isEnabled(), 'Future trip blocked')
    await select().selectOption('1')
    check(await upload().isDisabled(), 'Changing trip retained enabled upload')
    await page.screenshot({ path: `output/playwright/issues-96-97-ended-${width}.png` })
    await select().selectOption('2')
    check(await page.getByRole('button', { name: 'valid.png 선택됨' }).count() === 1, 'Changing trip lost draft')
    await page.screenshot({ path: `output/playwright/issues-96-97-mixed-${width}.png` })
    check(!await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), 'Horizontal overflow')
    await upload().click()
    await page.getByRole('status').filter({ hasText: '1장의 사진을 여행카드에 추가했어요.' }).waitFor()
    check(JSON.stringify(await page.evaluate(() => fixtureUploads)) === JSON.stringify([{ path: '/travel-cards/2/entries', file: 'valid.png' }]), 'Rejected file uploaded or wrong card')
    await open('detail')
    await page.getByRole('status').filter({ hasText: notice }).waitFor()
    check(await page.getByRole('button', { name: '사진 추가하기' }).count() === 0, 'Ended detail exposes add button')
    await open('detail&active')
    await page.getByRole('button', { name: '사진 추가하기' }).waitFor()
  }
  await open('conflict')
  await select().selectOption('2')
  await pick()
  await upload().click()
  await page.getByRole('alert').filter({ hasText: '여행 종료 후에는 여행 카드를 수정할 수 없습니다.' }).waitFor()
  check(await page.getByRole('button', { name: 'valid.png 선택됨' }).count() === 1, '409 lost draft')
  return 'PASS: desktop/mobile cutoff, submit guard, card switch/draft retention, mixed MIME selection, allowed-only upload, detail entry, mocked 409 message'
}
