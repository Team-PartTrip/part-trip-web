// Local browser fixture: all notification/profile API calls are intercepted.
export default async function verifyNotificationModal(page, origin = 'http://127.0.0.1:5174') {
  let read = false, failRead = false, readRequests = 0
  await page.route('**/*', async route => {
    const request = route.request()
    const path = new URL(request.url()).pathname.replace(/^\/api/, '')
    if (!['fetch', 'xhr'].includes(request.resourceType()) || !/^\/(notifications|profile|region-map)(\/|$)/.test(path)) return route.continue()
    const headers = { 'access-control-allow-origin': origin, 'access-control-allow-headers': '*', 'access-control-allow-methods': '*', 'access-control-allow-credentials': 'true' }
    if (request.method() === 'OPTIONS') return route.fulfill({ status: 204, headers })
    if (path === '/notifications/10/read') {
      readRequests++
      if (failRead) return route.fulfill({ status: 500, json: { message: 'fixture failure' }, headers })
      read = true
      return route.fulfill({ status: 204, headers })
    }
    let data = {}
    if (path === '/profile/myInfo') data = { userId: 'qa', nickName: '검사' }
    if (path === '/notifications/unread-count') data = { unreadCount: read ? 0 : 1 }
    if (path === '/notifications') data = { items: [{ notificationId: 10, type: 'REGION_VISITED', title: '새 지역 방문', body: '인천 여행을 기록했어요.', linkType: 'REGION_MAP', read, createdAt: '2026-10-19T09:00:00+09:00' }], hasNext: false }
    return route.fulfill({ json: data, headers })
  })
  await page.addInitScript(() => localStorage.setItem('accessToken', 'isolated-fixture'))
  const dialog = page.getByRole('dialog', { name: '알림 상세' })
  for (const [width, height] of [[1440, 1000], [390, 844]]) {
    await page.setViewportSize({ width, height })
    await page.goto(origin + '/notifications')
    const trigger = page.getByRole('button', { name: /알림: 새 지역 방문/ })
    await trigger.click()
    await dialog.waitFor({ state: 'visible' })
    await page.locator('button[aria-label="읽은 알림: 새 지역 방문"]').waitFor({ state: 'attached' })
    if (await dialog.getByText('✓ 읽음 처리', { exact: true }).count()) throw Error('제거한 읽음 표시 노출')
    if (new URL(page.url()).pathname !== '/notifications') throw Error('알림 상세로 페이지 이동')
    const box = await dialog.boundingBox()
    if (box.x < 0 || box.x + box.width > width || box.height > height) throw Error('모달 화면 넘침')
    await page.keyboard.press('Tab')
    if (!await dialog.evaluate(el => (document.activeElement === document.body || el.contains(document.activeElement)))) throw Error('모달 밖으로 초점 이동')
    await page.screenshot({ path: `output/playwright/notification-modal-${width}.png` })
    await page.keyboard.press('Escape')
    await dialog.waitFor({ state: 'detached' })
    if (!await trigger.evaluate(el => el === document.activeElement)) throw Error('알림 초점 미복원')
    await trigger.click()
    await dialog.getByRole('button', { name: '닫기', exact: true }).click()
    await dialog.waitFor({ state: 'detached' })
    await trigger.click()
    await page.mouse.click(2, 2)
    await dialog.waitFor({ state: 'detached' })
  }
  if (readRequests !== 1) throw Error('읽은 알림 중복 읽음 요청')
  read = false; failRead = true
  await page.reload()
  await page.getByRole('button', { name: /알림: 새 지역 방문/ }).click()
  await dialog.getByRole('alert').filter({ hasText: '알림을 읽음 처리하지 못했어요.' }).waitFor()
  await dialog.getByRole('button', { name: '닫기', exact: true }).click()
  failRead = false
  await page.getByRole('button', { name: /알림: 새 지역 방문/ }).click()
  await dialog.getByRole('button', { name: '지도 보러가기', exact: true }).click()
  await page.waitForURL('**/profile/map')
  return 'PASS: desktop/mobile modal, no navigation, read state/error, focus, Escape/backdrop/close, related destination'
}
