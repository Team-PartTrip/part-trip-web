// Local browser scenarios with isolated API fixtures; never writes to the real server.
export default async function verifyServerSync(page, origin = 'http://localhost:5173', capture = false) {
  const check = (value, message) => { if (!value) throw Error(message) }
  const errors = [], requests = []
  let preference = { preferredTransport: 'CAR', dailyScheduleCount: 3, canUseStairs: true, usesWheelchair: false, limitedWalking: true, maxWalkingMinutes: 10, avoidFoods: [] }
  let regenerated = false, releaseRegenerate, member = false, started = false, regenerationError = false
  const warning = '직접 포함한 해변의 무장애 정보를 여행 전에 확인해주세요.'
  const place = { tourPlaceId: 11, name: '강릉 해변', category: 'ACTIVITY', description: '바다를 바라보는 산책 장소', typeLabel: '해변', latitude: 37.7, longitude: 128.9 }
  page.setDefaultTimeout(8000)
  await page.unroute('**/*')
  page.removeAllListeners('pageerror')
  page.removeAllListeners('dialog')
  page.on('pageerror', error => errors.push(error.message))
  await page.addInitScript(() => {
    localStorage.setItem('accessToken', 'server-sync-fixture')
    localStorage.setItem('refreshToken', 'server-sync-refresh')
    sessionStorage.clear()
    window.syncConfirmations = []
    window.syncAcceptConfirm = true
    window.confirm = message => { window.syncConfirmations.push(message); return window.syncAcceptConfirm }
    if (location.pathname === '/planner/explore') sessionStorage.setItem('parttrip:planner-creation-draft', JSON.stringify({
      cityName: '강릉', regionName: '강원특별자치도', regionCode: '51', startDate: '2099-01-01', endDate: '2099-01-01', isSolo: true,
      blocks: [{ type: 'COMPANION', value: '혼자' }, { type: 'WALKING', value: '많이 걷기' }, { type: 'BUDGET', value: '저렴하게' }],
    }))
  })
  await page.route('**/*', async route => {
    const request = route.request(), url = new URL(request.url()), path = url.pathname.replace(/^\/api/, '')
    if (!url.pathname.startsWith('/api/')) return url.origin === origin ? route.continue() : route.abort()
    const headers = { 'access-control-allow-origin': origin, 'access-control-allow-credentials': 'true', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' }
    if (request.method() === 'OPTIONS') return route.fulfill({ status: 204, headers })
    requests.push({ method: request.method(), path, body: request.postDataJSON() })
    if (path === '/planners/7/regenerate') {
      check(request.method() === 'POST', 'Wrong regenerate method')
      if (regenerationError) return route.fulfill({ headers, status: 400, body: '직접 수정한 일정은 다시 생성할 수 없습니다.' })
      await new Promise(resolve => { releaseRegenerate = resolve })
      regenerated = true
      return route.fulfill({ headers, json: { plannerId: 7, days: [{ date: '2099-01-01', slots: [{ slotId: 2, place: { ...place, name: '새 추천 해변' } }] }], warnings: [{ tourPlaceId: 11, message: warning }] } })
    }
    if (path === '/planners/generate') return route.fulfill({ headers, json: { plannerId: 7, days: [], warnings: [{ tourPlaceId: 11, message: warning }] } })
    if (path === '/profile/travel-preferences' && request.method() === 'PUT') preference = { ...preference, ...request.postDataJSON() }
    if (request.method() !== 'GET' && !(path === '/profile/travel-preferences' && request.method() === 'PUT')) throw Error(`Unexpected write: ${path}`)
    let data = []
    if (path === '/profile/myInfo') data = { userId: 'owner', nickName: '웹 검증 사용자', email: 'fixture@example.com' }
    if (path === '/profile/travel-preferences') data = preference
    if (path === '/places/address') data = { address: '강릉시 해안로' }
    if (path === '/planners/blocks') data = [
      { type: 'COMPANION', label: '누구와 함께 떠나세요?', multiple: false, options: ['혼자', '가족'] },
      { type: 'DEPARTURE_PLACE', label: '어디에서 출발하세요?', multiple: false, options: ['집 근처', '직접 지정'] },
      { type: 'WALKING', label: '걷기 부담', multiple: false, options: ['10분 이내', '30분 이내', '1시간 이상'] },
      { type: 'LODGING_TYPE', label: '숙박 유형', multiple: false, options: ['호텔', '숙박 없음'] },
    ]
    if (path === '/main/dday') data = { status: 'NO_TRIP' }
    if (path === '/notifications/unread-count') data = { unreadCount: 0 }
    if (path === '/planners/7') data = { plannerId: 7, title: '서버 연동 검증', cityName: '강릉', startDate: started ? '2020-01-01' : '2099-01-01', endDate: '2099-01-02', role: member ? 'MEMBER' : 'OWNER', status: 'PLANNING', memberCount: 2 }
    if (path === '/planners/7/members') data = [{ userId: 'owner', role: member ? 'MEMBER' : 'OWNER', nickName: '웹 검증 사용자' }, { userId: 'friend', role: 'MEMBER', nickName: '동행' }]
    if (path === '/planners/7/survey') data = { plannerId: 7, blocks: [{ type: 'WALKING', value: '10분 이내' }, { type: 'TRAVEL_TYPE', value: '휴양' }] }
    if (path === '/planners/7/schedule') data = { plannerId: 7, cityName: '강릉', days: [{ date: '2099-01-01', slots: [{ slotId: 1, place: { ...place, name: regenerated ? '새 추천 해변' : place.name } }] }], warnings: [] }
    if (path === '/main/tour-place') data = [{ ...place, placeName: place.name }]
    if (path === '/guardians/me') data = Array.from({ length: 5 }, (_, index) => ({ linkId: index + 1, userId: `family-${index}`, nickName: `보호자 ${index + 1}` }))
    if (path === '/guardians/seniors') data = []
    if (path === '/travel-cards') data = [{ cardId: 1, cityName: '강릉', title: '카메라 기록', startDate: '2099-01-01', endDate: '2099-01-02', photoCount: 1 }]
    if (path === '/travel-cards/1') data = { cardId: 1, startDate: '2099-01-01', endDate: '2099-01-02', timeline: [{ entryId: 2, imageUrl: origin + '/favicon.svg', locationSource: 'CAMERA', takenAtSource: 'CAMERA', takenAt: '2099-01-01T12:00:00', type: 'PHOTO' }] }
    return route.fulfill({ headers, json: data })
  })

  await page.goto(origin + '/profile/travel-preferences')
  await page.getByRole('button', { name: '10분 이내', exact: true }).waitFor()
  check(await page.getByRole('button', { name: '10분 이내', exact: true }).getAttribute('aria-pressed') === 'true', 'Saved 10 minutes was not selected')
  await page.getByRole('button', { name: '30분 이내', exact: true }).click()
  await page.getByRole('button', { name: '저장', exact: true }).click()
  await page.getByText('여행 편의 설정을 저장했어요.', { exact: true }).waitFor()
  check(requests.find(request => request.method === 'PUT')?.body.maxWalkingMinutes === 30, 'Walking time was not sent')
  await page.setViewportSize({ width: 1440, height: 1000 })
  if (capture) await page.screenshot({ path: 'output/playwright/server-sync-preferences-desktop.png', fullPage: true })
  await page.setViewportSize({ width: 390, height: 844 })
  check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Preferences overflow mobile viewport')
  if (capture) await page.screenshot({ path: 'output/playwright/server-sync-preferences-mobile.png', fullPage: true })

  await page.goto(origin + '/planner/7')
  await page.getByRole('button', { name: 'AI 일정 다시 만들기', exact: true }).waitFor()
  await page.getByText('일정을 만들 때 선택한 여행 기준', { exact: true }).click()
  await page.getByText('10분 이내', { exact: true }).waitFor()
  await page.getByRole('button', { name: 'AI 일정 다시 만들기', exact: true }).click()
  await page.getByText('일정을 다시 만들고 있어요. 완료될 때까지 기다려주세요.', { exact: true }).waitFor()
  check(await page.getByRole('button', { name: '일정 확정', exact: true }).isDisabled(), 'Confirm enabled during regeneration')
  check(await page.getByRole('button', { name: '일정 편집', exact: true }).count() === 0, 'Editing enabled during regeneration')
  check(requests.filter(request => request.path.endsWith('/regenerate')).length === 1, 'Duplicate regeneration')
  releaseRegenerate()
  await page.getByText(warning, { exact: true }).waitFor()
  await page.getByText('새 추천 해변', { exact: true }).waitFor()
  check(await page.getByRole('button', { name: '30초 후 다시 생성 가능', exact: true }).isDisabled(), 'No cooldown')
  await page.setViewportSize({ width: 1440, height: 1000 })
  if (capture) await page.screenshot({ path: 'output/playwright/server-sync-schedule-desktop.png', fullPage: true })
  await page.setViewportSize({ width: 390, height: 844 })
  check(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Schedule overflows mobile viewport')
  if (capture) await page.screenshot({ path: 'output/playwright/server-sync-schedule-mobile.png', fullPage: true })
  const profileLink = page.getByRole('navigation', { name: '메인 메뉴' }).getByRole('link', { name: '마이', exact: true })
  await profileLink.click()
  await page.getByRole('heading', { name: '마이페이지', exact: true }).waitFor()
  const refreshedSchedule = page.waitForResponse(response => new URL(response.url()).pathname.endsWith('/planners/7/schedule'))
  await page.goBack()
  await refreshedSchedule
  await page.getByText(warning, { exact: true }).waitFor()
  check(requests.filter(request => request.path === '/planners/7/schedule').length >= 2, 'Did not refetch schedule')

  // Re-open without owner permissions; started travel must hide member leaving.
  member = true; started = true
  await page.goto(origin + '/planner/7')
  await page.getByText('함께하는 사람 2명', { exact: true }).waitFor()
  check(await page.getByRole('button', { name: 'AI 일정 다시 만들기', exact: true }).count() === 0, 'Member can regenerate')
  check(await page.getByRole('button', { name: '플래너 나가기', exact: true }).count() === 0, 'Can leave after travel starts')
  started = false
  await page.goto(origin + '/planner/7')
  await page.getByRole('button', { name: '플래너 나가기', exact: true }).waitFor()
  await page.evaluate(() => { window.syncAcceptConfirm = false })
  await page.getByRole('button', { name: '플래너 나가기', exact: true }).click()
  check((await page.evaluate(() => window.syncConfirmations.at(-1))).includes('내 여행카드와 사진·장소 기록이 함께 삭제'), 'Leaving omits record deletion warning')

  await page.goto(origin + '/record/1')
  await page.getByText('카메라로 기록한 위치와 촬영 시각은 수정할 수 없어요.', { exact: true }).waitFor()
  check(await page.getByRole('button', { name: '위치 수정', exact: true }).count() === 0, 'Camera location is editable')
  check(await page.getByRole('button', { name: '촬영 시각 수정', exact: true }).count() === 0, 'Camera time is editable')
  await page.goto(origin + '/profile/guardians')
  await page.getByText('보호자 5', { exact: true }).waitFor()
  check(await page.getByRole('button', { name: '초대 코드 만들기', exact: true }).isDisabled(), 'Guardian limit ignored')

  member = false
  await page.context().grantPermissions(['geolocation'], { origin })
  await page.context().setGeolocation({ latitude: 37.7, longitude: 128.9 })
  await page.goto(origin + '/planner/explore')
  await page.getByRole('heading', { name: '누구와 함께 떠나세요?', exact: true }).waitFor()
  await page.getByRole('button', { name: '다음', exact: true }).click()
  await page.getByRole('button', { name: '지금 있는 곳', exact: true }).click()
  await page.getByText('강릉시 해안로', { exact: true }).waitFor()
  await page.getByRole('button', { name: '다음', exact: true }).click()
  await page.getByRole('button', { name: '10분 이내', exact: true }).click()
  await page.getByRole('button', { name: '숙박 없음', exact: true }).click()
  await page.getByRole('button', { name: '다음', exact: true }).click()
  await page.getByRole('button', { name: '다음', exact: true }).click()
  await page.getByRole('button', { name: 'AI로 일정 만들기', exact: true }).click()
  await page.waitForURL(origin + '/planner/7')
  await page.getByText(warning, { exact: true }).waitFor()
  const generated = requests.find(request => request.path === '/planners/generate')?.body
  check(generated?.blocks.some(block => block.type === 'WALKING' && block.value === '10분 이내'), 'Selected walking time missing in generation')
  check(generated?.blocks.every(block => block.type !== 'BUDGET' && block.value !== '많이 걷기'), 'Obsolete block sent to server')
  check(generated?.departurePoint?.placeName === '강릉시 해안로', 'Server address not used for departure')
  regenerationError = true
  await page.getByRole('button', { name: 'AI 일정 다시 만들기', exact: true }).click()
  await page.getByRole('alert').filter({ hasText: '직접 수정한 일정은 다시 생성할 수 없습니다.' }).waitFor()
  await page.getByText('새 추천 해변', { exact: true }).waitFor()
  check(errors.length === 0, errors.join('\n'))
  return { passed: true, scenarios: ['walking settings', 'survey', 'regeneration lock', 'warnings survive refetch', 'member permissions', 'leaving warning', 'camera lock', 'guardian limit', 'desktop and mobile layouts', 'generation with validated blocks and server address', 'regeneration rejection keeps schedule'], requests: requests.length }
}
