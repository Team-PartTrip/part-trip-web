// Isolated app API fixtures; no account writes. Run with playwright-cli run-code.
export default async function verifyIssues(page, origin = 'http://localhost:5173') {
  const goToReview = async () => {
    for (let step = 0; step < 20; step++) {
      if (await page.getByRole('button', { name: 'AI로 일정 만들기', exact: true }).count()) return
      await page.getByRole('button', { name: /^(다음|건너뛰기)$/ }).click()
    }
    throw new Error('확인 단계에 도달하지 못했습니다')
  }
  const checks = [], writes = [], polls = [], errors = []
  const check = (ok, label) => { if (!ok) throw Error(label); checks.push(label) }
  page.on('pageerror', error => errors.push(error.message))
  let status = 'DRAFT', count = 3, role = 'OWNER', denied = 0
  let members = [{ userId: 'owner', nickName: '그룹장', role: 'OWNER' }, { userId: 'guest', nickName: '동행', role: 'MEMBER', status: 'ACTIVE' }]
  let preferences = { usesWheelchair: null, limitedWalking: null, canUseStairs: null }
  const draft = { cityName: '경주', regionName: '경북', regionCode: '47', startDate: '2099-01-01', endDate: '2099-01-02', blocks: [] }
  const blocks = [{ type: 'COMPANION', label: '동행', options: ['혼자', '친구', '가족'] }, { type: 'WALKING', label: '걷기 부담', options: ['많이 걷기'] }, { type: 'LODGING_TYPE', label: '숙박 유형', options: ['호텔', '펜션', '숙박 없음'] }]
  const places = [{ tourPlaceId: 1, name: '경주 국수집', typeLabel: '국수 전문점', categoryLabel: '맛집', description: '직접 뽑은 면으로 만드는 국수예요.', address: '경북 경주시 시험길 1', rating: 4.5, imageUrl: origin + '/favicon.png', latitude: 35.79, longitude: 129.33 }, { tourPlaceId: 2, name: '경주 카페', typeLabel: null, description: null, categoryLabel: '카페', address: '경북 경주시 시험길 2' }]
  await page.route('**/*', async route => {
    const req = route.request(), path = new URL(req.url()).pathname.replace(/^\/api/, '')
    if (!['fetch', 'xhr'].includes(req.resourceType()) || !/^\/(profile|main|planners|notifications|guardians)(\/|$)/.test(path)) return route.continue()
    const headers = { 'access-control-allow-origin': origin, 'access-control-allow-headers': '*', 'access-control-allow-methods': '*', 'access-control-allow-credentials': 'true' }
    if (req.method() === 'OPTIONS') return route.fulfill({ status: 204, headers })
    if (req.method() !== 'GET') writes.push({ path, method: req.method(), body: req.postDataJSON() })
    if (path === '/planners/7/members' && req.method() === 'GET') { polls.push(Date.now()); if (denied) return route.fulfill({ status: denied, json: { message: '멤버가 아닙니다' }, headers }) }
    if (path === '/planners/7/members/guest' && req.method() === 'DELETE') members = members.filter(member => member.userId !== 'guest')
    if (path === '/planners/generate') return route.fulfill({ status: 400, json: { message: '검사용 생성 중단' }, headers })
    let data = []
    if (path === '/profile/myInfo') data = { userId: 'owner', nickName: '그룹장' }
    if (path === '/profile/travel-preferences') data = preferences
    if (path === '/planners/blocks') data = blocks
    if (path === '/planners/7') data = { plannerId: 7, title: '경주 여행', status, role, memberCount: count, inviteLink: origin + '/planner/group?inviteCode=test' }
    if (path === '/planners/7/members') data = members
    if (path === '/planners/7/schedule') data = { plannerId: 7, days: [{ date: '2099-01-01', slots: places.map((place, index) => ({ slotId: index + 1, tourPlaceId: place.tourPlaceId, place })) }] }
    if (/\/accessibility$/.test(path)) data = { matched: true, items: [{ key: 'WHEELCHAIR', label: '휠체어', text: '출입구 경사로 있음' }] }
    if (path === '/notifications/unread-count') data = { unreadCount: 0 }
    return route.fulfill({ json: data, headers })
  })
  await page.addInitScript(() => { localStorage.setItem('accessToken', 'isolated-fixture'); sessionStorage.setItem('parttrip:active-planner-id', '7'); window.confirm = () => true; window.alert = message => { const entries = JSON.parse(sessionStorage.getItem('test:alerts') ?? '[]'); entries.push(message); sessionStorage.setItem('test:alerts', JSON.stringify(entries)) } })
  await page.goto(origin + '/planner')
  const criteria = async changes => { await page.evaluate(data => sessionStorage.setItem('parttrip:planner-creation-draft', JSON.stringify(data)), { ...draft, ...changes }); await page.goto(origin + '/planner/explore'); await page.getByRole('button', { name: '혼자', exact: true }).or(page.getByRole('button', { name: '친구', exact: true })).first().waitFor() }
  await criteria({ isSolo: true, endDate: draft.startDate })
  check(await page.getByRole('button', { name: '혼자', exact: true }).getAttribute('aria-pressed') === 'true' && await page.getByRole('button', { name: '친구', exact: true }).count() === 0, '#88 혼자만 표시·미리 선택')
  await page.getByRole('button', { name: '다음', exact: true }).click(); await page.getByRole('button', { name: '건너뛰기', exact: true }).click()
  await page.getByRole('button', { name: '숙박 없음', exact: true }).waitFor()
  check(await page.getByRole('button', { name: '숙박 없음', exact: true }).getAttribute('aria-pressed') === 'true' && await page.getByRole('button', { name: '호텔', exact: true }).count() === 0, '#88 당일치기 숙박 없음만 표시·미리 선택 / WALKING 질문 없음')
  await goToReview(); await page.getByRole('button', { name: 'AI로 일정 만들기', exact: true }).click(); await page.getByText('검사용 생성 중단', { exact: true }).waitFor()
  check(!writes.at(-1).body.blocks.some(block => block.type === 'WALKING'), '#88 이동 편의 미응답이면 WALKING 전송 안 함')
  preferences = { usesWheelchair: true, limitedWalking: false, canUseStairs: false }
  await criteria({ isSolo: false })
  check(await page.getByRole('button', { name: '혼자', exact: true }).count() === 0, '#88 같이 여행에서 혼자 제외')
  await page.getByRole('button', { name: '친구', exact: true }).click(); await page.getByRole('button', { name: '건너뛰기', exact: true }).click(); await page.getByRole('button', { name: '호텔', exact: true }).waitFor()
  check(await page.getByRole('button', { name: '숙박 없음', exact: true }).count() === 0, '#88 숙박 여행에서 숙박 없음 제외')
  await goToReview(); await page.getByRole('button', { name: 'AI로 일정 만들기', exact: true }).click(); await page.getByText('검사용 생성 중단', { exact: true }).waitFor()
  check(writes.at(-1).body.blocks.some(block => block.type === 'WALKING' && block.value === '걷기 최소화'), '#88 휠체어 답으로 WALKING 걷기 최소화 전송')
  await page.evaluate(() => sessionStorage.removeItem('parttrip:planner-creation-draft'))
  await page.goto(origin + '/planner/destination'); await page.getByText('가는 날과 돌아오는 날을 차례로 눌러주세요. 당일치기는 같은 날을 두 번 눌러요.', { exact: true }).waitFor()
  await page.locator('#planner-start-date').click(); await page.getByRole('dialog').locator('button[data-date]:not([disabled])').first().click()
  await page.getByText('돌아오는 날을 눌러주세요. 당일치기면 같은 날을 한 번 더 눌러요.', { exact: true }).waitFor()
  const start = await page.locator('#planner-start-date').getAttribute('aria-label')
  await page.locator('#planner-end-date').click(); await page.getByRole('dialog').locator('button[data-date]:not([disabled])').first().click()
  check((await page.locator('#planner-end-date').getAttribute('aria-label')).split(': ')[1] === start.split(': ')[1], '#88 날짜 안내·같은 날짜 두 번으로 당일치기')
  await page.goto(origin + '/planner/7')
  const card = page.locator('details').filter({ has: page.getByText('경주 국수집', { exact: true }) })
  await card.locator('summary').getByText('국수 전문점', { exact: true }).waitFor()
  check(await card.locator('.place-preview').textContent() === places[0].description, '#89 세부 종류·한 줄 설명')
  const fallback = page.locator('details').filter({ has: page.getByText('경주 카페', { exact: true }) })
  check(await fallback.locator('small').first().textContent() === '카페' && await fallback.locator('.place-preview').textContent() === places[1].address, '#89 null 세부 종류·설명은 분류·주소 대체')
  await card.locator('summary').click(); await card.getByRole('button', { name: '편의 시설 보기' }).click(); await card.getByText('출입구 경사로 있음', { exact: true }).waitFor()
  check(await card.getByRole('img').count() === 1 && await card.getByText('4.5', { exact: true }).count() === 1 && await card.getByRole('link', { name: '지도로 보기' }).count() === 1, '#89 카드 펼치면 사진·분류·평점·주소·설명·편의 시설·지도')
  await page.screenshot({ path: 'output/playwright/issues-88-90-desktop.png', fullPage: true })
  await page.setViewportSize({ width: 375, height: 812 }); check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), '#89 모바일 상세 가로 넘침 없음'); await page.screenshot({ path: 'output/playwright/issues-88-90-mobile.png', fullPage: true }); await page.setViewportSize({ width: 1440, height: 1000 })
  await page.getByRole('button', { name: '일정 편집', exact: true }).click(); check(await page.locator('details').filter({ hasText: '경주 국수집' }).count() === 0, '#89 편집 중 장소 상세 열리지 않음')
  status = 'CONFIRMED'; await page.goto(origin + '/planner/7'); await page.getByRole('button', { name: '내보내기', exact: true }).first().waitFor()
  check(await page.getByRole('button', { name: '초대 단계로', exact: true }).count() === 1, '#90 확정 뒤 내보내기·초대 제공')
  const joinedAt = Date.now(); members = [...members, { userId: 'new', nickName: '새참여자', role: 'MEMBER', status: 'ACTIVE' }]
  await page.getByText('새참여자', { exact: true }).waitFor({ timeout: 6500 }); check(Date.now() - joinedAt < 6500, '#90 실제 5초 주기로 참여 멤버 반영')
  await page.getByRole('button', { name: '내보내기', exact: true }).first().click(); await page.getByText('동행', { exact: true }).waitFor({ state: 'hidden' }); check(writes.some(write => write.method === 'DELETE' && write.path === '/planners/7/members/guest'), '#90 확정 뒤 내보내기 요청·목록 반영')
  for (const code of [400, 403, 404]) {
    denied = 0; await page.goto(origin + '/planner/7'); await page.getByText('새참여자', { exact: true }).waitFor(); const before = await page.evaluate(() => JSON.parse(sessionStorage.getItem('test:alerts') ?? '[]').length); denied = code
    await page.waitForURL(origin + '/planner', { timeout: 6500 }); check((await page.evaluate(() => JSON.parse(sessionStorage.getItem('test:alerts') ?? '[]'))).slice(before).filter(text => text === '이 플래너에서 나가졌어요').length === 1, `#90 ${code} 응답 시 알림 1회·목록 이동`)
  }
  denied = 0; status = 'DONE'; await page.goto(origin + '/planner/7'); await page.getByText('확정된 일정', { exact: true }).waitFor(); const before = polls.length; await page.waitForTimeout(5300)
  check(polls.length === before && await page.getByRole('button', { name: '내보내기', exact: true }).count() === 0 && await page.getByRole('button', { name: '초대 단계로', exact: true }).count() === 0, '#90 DONE 멤버 주기 갱신·내보내기·초대 중지')
  await page.goto(origin + '/planner/invite'); await page.getByText('현재는 초대 링크를 사용할 수 없어요.', { exact: true }).waitFor(); check(await page.getByRole('button', { name: '링크 복사', exact: true }).count() === 0, '#90 DONE 초대 URL 직접 접근해도 링크 숨김')
  count = 1; status = 'DRAFT'; await page.goto(origin + '/planner/7'); await page.getByRole('button', { name: '일정 편집', exact: true }).waitFor(); const soloPolls = polls.length; await page.waitForTimeout(5300); check(polls.length === soloPolls, '#90 혼자 여행 멤버 주기 갱신 없음')
  await page.evaluate(() => sessionStorage.setItem('parttrip:planner-group-settings', JSON.stringify({isSolo:true,memberCount:1})))
  await page.goto(origin + '/planner'); await page.getByRole('button', {name:'여행 계획 만들기',exact:true}).click(); await page.waitForURL(origin + '/planner/destination')
  check(await page.evaluate(() => sessionStorage.getItem('parttrip:planner-group-settings')) === null, '#88 새 여행에서 이전 동행 설정을 가져오지 않음')
  check(errors.length === 0, '브라우저 실행 오류 없음')
  return { checks, apiMode: 'Mock app API; real browser, real 5-second polling; no account writes' }
}
