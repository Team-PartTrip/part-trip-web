// Local app with isolated API responses; no production account data is changed.
export default async function verifyAuditFixes(page, origin = 'http://localhost:5173') {
  const check = (value, message) => { if (!value) throw Error(message) }
  let recovered = false, accessibilityRequests = 0, deleteRequests = 0, failDelete = false
  let releaseUpload, notifyUploadStarted
  const card = { cardId: 11, cityName: '부산', title: '회귀 검증 여행', startDate: '2099-01-01', endDate: '2099-01-02', photoCount: 0 }
  const runtimeErrors = []
  page.on('pageerror', error => runtimeErrors.push(error.message))
  page.setDefaultTimeout(7000)
  await page.unroute('**/*')
  await page.addInitScript(() => {
    localStorage.setItem('accessToken', 'audit-fixture')
    localStorage.setItem('refreshToken', 'audit-refresh')
    sessionStorage.clear()
    window.auditAllowLeave = false
    window.auditConfirmations = 0
    window.confirm = () => { window.auditConfirmations++; return window.auditAllowLeave }
  })
  await page.route('**/*', async route => {
    const request = route.request(), url = new URL(request.url()), path = url.pathname.replace(/^\/api/, '')
    if (url.origin === origin) return route.continue()
    if (!url.pathname.startsWith('/api/')) return route.abort()
    const headers = { 'access-control-allow-origin': origin, 'access-control-allow-credentials': 'true', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' }
    if (request.method() === 'OPTIONS') return route.fulfill({ status: 204, headers })
    if (request.method() === 'DELETE' && path === '/travel-cards') {
      deleteRequests++
      await new Promise(resolve => setTimeout(resolve, 800))
      return route.fulfill({ headers, status: failDelete ? 500 : 200, json: failDelete ? { message: 'fixture failure' } : 'deleted' })
    }
    if (request.method() === 'POST' && path === '/travel-cards/11/entries') {
      await new Promise(resolve => { releaseUpload = resolve; notifyUploadStarted() })
      return route.fulfill({ headers, json: { entryId: 1 } })
    }
    check(request.method() === 'GET', `Unexpected API write: ${path}`)
    if (path === '/main/tour-place/1/accessibility') {
      accessibilityRequests++
      return route.fulfill({ headers, json: recovered
        ? { status: 'FOUND', matched: true, items: [{ key: 'RESTROOM', label: '화장실', text: '복구된 편의 시설' }] }
        : { status: 'UNAVAILABLE', matched: false, items: [] } })
    }
    let data = []
    if (path === '/profile/myInfo') data = { userId: 'B', nickName: '계정 B' }
    if (path === '/notifications/unread-count') data = { unreadCount: 0 }
    if (path === '/main/dday') data = { status: 'NO_TRIP' }
    if (path === '/travel-cards') data = [card]
    if (path === '/travel-cards/11') data = { ...card, timeline: [] }
    if (path === '/planners/7') data = { plannerId: 7, title: '캐시 검증', cityName: '부산', startDate: '2099-01-01', endDate: '2099-01-02', role: 'OWNER', status: 'PLANNING' }
    if (path === '/planners/7/schedule') data = { plannerId: 7, days: [{ date: '2099-01-01', slots: [{ slotId: 1, tourPlaceId: 1, place: { tourPlaceId: 1, name: '캐시 검증 장소', category: '관광지' } }] }] }
    if (path === '/planners/7/members') data = [{ userId: 'B', nickName: '계정 B', role: 'OWNER' }]
    return route.fulfill({ headers, json: data })
  })
  const plannerLink = () => page.getByRole('navigation', { name: '메인 메뉴' }).getByRole('link', { name: '플래너', exact: true })
  const pickPhoto = async () => {
    await page.locator('input[type=file]').evaluate(element => {
      const files = new DataTransfer()
      files.items.add(new File([Uint8Array.from(atob('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a6uoAAAAASUVORK5CYII='), c => c.charCodeAt(0))], 'audit.png', { type: 'image/png' }))
      element.files = files.files
      element.dispatchEvent(new Event('change', { bubbles: true }))
    })
  }
  await page.goto(origin + '/main')
  await page.getByRole('button', { name: '여행 플래너 시작', exact: true }).waitFor()
  const oldDraft = await page.evaluate(async () => {
    const auth = await import('/src/shared/libs/token-storage.ts')
    const draft = await import('/src/widgets/planner/model/planner-creation.ts')
    auth.startAuthSession({ accessToken: 'A', refreshToken: 'refresh-A' })
    draft.writePlannerCreationDraft({ cityName: '부산', regionCode: '26', regionName: '부산광역시', startDate: '2099-01-01', endDate: '2099-01-02' })
    auth.clearAuthTokens()
    auth.startAuthSession({ accessToken: 'B', refreshToken: 'refresh-B' })
    return draft.readPlannerCreationDraft()
  })
  check(oldDraft == null, 'Previous account draft survived login')
  await page.getByRole('button', { name: '여행 플래너 시작', exact: true }).click()
  check(await page.locator('#planner-city-name').inputValue() === '', 'Previous account city displayed')
  await page.evaluate(() => sessionStorage.setItem('parttrip:planner-creation-draft', 'old-account'))
  const other = await page.context().newPage()
  try {
    await other.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort())
    await other.goto(origin + '/login')
    await other.evaluate(() => localStorage.setItem('parttrip:auth-session', 'new-account-session'))
    await page.waitForURL('**/login**')
    check(await page.evaluate(() => sessionStorage.getItem('parttrip:planner-creation-draft')) === null, 'Cross-tab draft survived account change')
  } finally { await other.close() }
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 })
    await page.goto(origin + '/record/write')
    await page.locator('#trip-card-comment').waitFor()
    await pickPhoto()
    await page.locator('#trip-card-comment').fill('보존할 메모')
    await plannerLink().click()
    await page.waitForFunction(() => window.auditConfirmations > 0)
    check(new URL(page.url()).pathname === '/record/write', 'Cancelled navigation left photo editor')
    check(await page.getByRole('button', { name: 'audit.png 선택 해제', exact: true }).count() === 1, 'Cancelled navigation lost photo')
    check(await page.locator('#trip-card-comment').inputValue() === '보존할 메모', 'Cancelled navigation lost comment')
    await page.screenshot({ path: `output/playwright/audit-followup-photo-draft-${width}.png` })
    await page.evaluate(() => { window.auditAllowLeave = true })
    await plannerLink().click()
    await page.getByRole('tablist', { name: '여행 계획 상태' }).waitFor()
    await page.goBack()
    await page.locator('#trip-card-comment').waitFor()
    await page.locator('#trip-card-comment').fill('메모만 있어도 보호')
    await page.evaluate(() => { window.auditAllowLeave = false; window.auditConfirmations = 0 })
    await plannerLink().click()
    await page.waitForFunction(() => window.auditConfirmations > 0)
    check(new URL(page.url()).pathname === '/record/write', 'Comment-only draft is unprotected')
    await page.locator('#trip-card-comment').fill('')
    await pickPhoto()
    const started = new Promise(resolve => { notifyUploadStarted = resolve })
    await page.getByRole('button', { name: '여행카드에 담기', exact: true }).click()
    await started
    await plannerLink().click()
    check(new URL(page.url()).pathname === '/record/write', 'Navigation allowed during upload')
    releaseUpload()
    await page.getByRole('status').filter({ hasText: '1장의 사진을 여행카드에 추가했어요.' }).waitFor()
    await plannerLink().click()
    await page.getByRole('tablist', { name: '여행 계획 상태' }).waitFor()
    recovered = false
    accessibilityRequests = 0
    await page.goto(origin + '/planner/7')
    const details = page.locator('details').filter({ has: page.getByText('캐시 검증 장소', { exact: true }) })
    await details.locator('summary').click()
    await details.getByText('지금은 확인할 수 없어요', { exact: true }).waitFor()
    recovered = true
    await details.locator('summary').click()
    await details.locator('summary').click()
    await details.getByText('복구된 편의 시설', { exact: true }).waitFor()
    check(accessibilityRequests === 2, 'UNAVAILABLE response did not refetch')
    await details.locator('summary').click()
    await details.locator('summary').click()
    await details.getByText('복구된 편의 시설', { exact: true }).waitFor()
    check(accessibilityRequests === 2, 'FOUND response cache was lost')
    failDelete = true
    deleteRequests = 0
    await page.goto(origin + '/trip-cards/delete')
    await page.getByRole('checkbox').first().check()
    await page.getByRole('button', { name: '1개 삭제하기', exact: true }).evaluate(element => { element.click(); element.click() })
    await page.getByRole('button', { name: '삭제 중…', exact: true }).waitFor()
    check(await page.getByRole('checkbox').first().isDisabled(), 'Selection enabled during delete')
    check(await page.getByRole('button', { name: '취소', exact: true }).isDisabled(), 'Cancel enabled during delete')
    await page.getByText('여행카드를 삭제하지 못했어요.', { exact: true }).waitFor()
    check(deleteRequests === 1, 'Duplicate delete request')
    failDelete = false
    await page.getByRole('button', { name: '1개 삭제하기', exact: true }).click()
    await page.getByText('선택한 카드가 삭제됐어요.', { exact: true }).waitFor()
    check(deleteRequests === 2, 'Failed delete did not release the lock for retry')
  }
  check(runtimeErrors.length === 0, runtimeErrors.join('; '))
  return 'PASS: account draft cleanup including cross-tab change, photo/comment draft protection, upload navigation lock, unavailable recovery, found cache, delete deduplication and retry, desktop/mobile'
}
