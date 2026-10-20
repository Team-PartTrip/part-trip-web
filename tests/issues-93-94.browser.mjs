// Local fixtures only; no real account or server writes.
export default async function verifyHomeAndGuardian(page, origin='http://127.0.0.1:5174') {
 const open=async query=>page.goto(origin+'/tests/issues-93-94-regressions.html?'+query)
 const hero=()=>page.getByRole('button',{name:'오늘 일정 보기',exact:true}).locator('..')
 for(const [width,height] of [[1440,1000],[390,844]]) {
  await page.setViewportSize({width,height});await open('case=during')
  await hero().locator('img').waitFor()
  await page.waitForFunction(()=>document.querySelector('section img[src*="home-hero"]')?.naturalWidth>0)
  if(!await hero().locator('img').getAttribute('src').then(src=>src.includes('home-hero')))throw Error('명소 사진 우선 선택 실패')
  if(await hero().getByText(/감천문화마을|오늘 \d+곳|확정된 일정 ·/).count())throw Error('홈 경로·장소 수 잔존')
  await page.getByRole('region',{name:'오늘 갈 곳'}).getByText('감천문화마을',{exact:true}).waitFor()
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('홈 가로 넘침')
  await page.screenshot({path:`output/playwright/issue-93-home-${width}.png`})
  await open('mode=guardian')
  await page.getByText('감천문화마을 · 직접 고른 숙소 · 장소 13 · 흰여울문화마을',{exact:true}).waitFor()
  await page.getByText('등록된 장소가 없어요.',{exact:true}).waitFor()
  if(await page.evaluate(()=>window.fixtureRequests.some(path=>path.includes('tour-place'))))throw Error('보호자 이름 조회용 불필요 요청')
  if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('보호자 가로 넘침')
  await page.screenshot({path:`output/playwright/issue-94-guardian-${width}.png`,fullPage:true})
 }
 await open('case=before');await page.getByText('다가오는 여행',{exact:true}).waitFor();await page.getByText('다가오는 여행',{exact:true}).locator('..').locator('img').waitFor()
 await open('case=empty');await page.getByText('오늘 확정된 일정이 없어요.',{exact:true}).waitFor()
 for(const kind of ['no-image','broken','none']) {
  const imageFailure=kind==='broken'?page.waitForResponse(response=>response.url().includes('missing-hero-photo')):null
  await open('case='+kind)
  const card=kind==='none'?page.getByRole('button',{name:'여행 플래너 시작',exact:true}).locator('..'):hero()
  await card.waitFor()
  if(imageFailure)await imageFailure
  await page.waitForFunction(()=>window.fixtureRequests.includes('/main/dday'))
  await page.waitForFunction(()=>![...document.querySelectorAll('section img')].some(img=>img.getAttribute('src')?.includes('missing-hero-photo')))
  if(await card.locator('img').count())throw Error('사진 없음·오류·여행 없음 배경 처리 실패: '+kind)
 }
 await open('case=during&contrast');await hero().locator('img').waitFor()
 const colors=await hero().evaluate(el=>({text:getComputedStyle(el).color,scrim:getComputedStyle(el.querySelector('[aria-hidden]'),'::after').backgroundColor}))
 if(colors.text!=='rgb(255, 255, 255)'||!colors.scrim.includes('0.76'))throw Error('고대비 글씨·오버레이 누락')
 await page.screenshot({path:'output/playwright/issue-93-contrast.png'})
 return 'PASS: #93 photo priority, before/during/no-trip, image failure, empty itinerary, contrast; #94 nested place names, null slots, ID fallback, no extra places request; desktop/mobile'
}
