// Run against a separate local browser: pass this function to playwright-cli run-code.
// API calls are intercepted; this test does not modify a real account.
export default async function verifyIssueFollowups(page) {
 await page.unroute('**/*');
 const origin='http://localhost:5173';const results=[];const writes=[];const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 const check=(ok,label)=>{if(!ok)throw Error(label);results.push(label)};
 const image=origin+'/src/shared/assets/dandi-app-logo.png';
 const cards=[{cardId:7,cityName:'경주',regionCode:'47',regionName:'경북',startDate:'2026-11-24',endDate:'2026-12-09',photoCount:1,coverImageUrl:image},{cardId:8,cityName:'부산',regionCode:'26',startDate:'2026-01-01',endDate:'2026-01-02',photoCount:0}];
 const notifications=[{notificationId:1,title:'오늘 일정',body:'오늘은 경주월드 · 불국사 일정이에요.',linkType:'PLANNER',linkId:7,category:'SCHEDULE',read:true},{notificationId:2,title:'새 지역 방문',body:'경북 여행을 기록했어요.',linkType:'REGION_MAP',category:'RECORD',read:true}];
 const pref={preferredTransport:'CAR',dailyScheduleCount:3,canUseStairs:false,usesWheelchair:null,limitedWalking:null,avoidFoods:[]};
 let generated;
 await page.route('**/*',async route=>{
  const req=route.request();const url=new URL(req.url());const path=url.pathname.replace(/^\/api/,'');
  if(!['fetch','xhr'].includes(req.resourceType())||!/^\/(profile|main|planners|travel-cards|notifications|guardians|places|region-map)(\/|$)/.test(path))return route.continue();
  const headers={'access-control-allow-origin':origin,'access-control-allow-headers':'*','access-control-allow-methods':'*','access-control-allow-credentials':'true'};
  if(req.method()==='OPTIONS')return route.fulfill({status:204,headers});
  if(req.method()!=='GET')writes.push({path,body:req.postDataJSON()});
  let data=[];
  if(path==='/profile/myInfo')data={userId:'me',nickName:'망개',imgUrl:null};
  if(path==='/profile/travel-preferences')data=pref;
  if(path==='/main/dday')data={status:'BEFORE',cityName:'경주',regionName:'경북',startDate:'2026-11-24',endDate:'2026-12-09',dday:'D-1'};
  if(path==='/main/festivals')data=[{title:'축제',startDate:'2026-11-24',endDate:'2026-12-01',category:'문화',location:'경주'}];
  if(path==='/planners')data=[{plannerId:7,title:'경주 가을여행',cityName:'경주',startDate:'2026-11-24',endDate:'2026-12-09',status:'CONFIRMED',role:'OWNER',memberCount:1}];
  if(path==='/planners/7')data={plannerId:7,title:'경주 가을여행',cityName:'경주',status:'CONFIRMED',role:'OWNER',memberCount:1};
  if(path==='/planners/7/schedule')data={plannerId:7,days:[{date:'2026-11-24',slots:[{slotId:1,tourPlaceId:1,place:{tourPlaceId:1,name:'불국사',latitude:35.79,longitude:129.33}}]}]};
  if(path==='/planners/blocks')data=[{type:'COMPANION',label:'누구와 함께 떠나세요?',options:['혼자','친구']},{type:'TRAVEL_TYPE',label:'여행 타입',options:['자연','힐링']},{type:'MUST_INCLUDE',label:'반드시 포함할 곳',options:['식당','행사']},{type:'EXCLUDE',label:'제외할 곳',options:['식당']}];
  if(path==='/planners/generate'){generated=req.postDataJSON();return route.fulfill({status:400,json:{message:'검증용 생성 중단'},headers})}
  if(path==='/travel-cards')data=cards;
  if(path==='/travel-cards/7')data={cardId:7,startDate:cards[0].startDate,endDate:cards[0].endDate,timeline:[{type:'PLACE',placeName:'불국사',latitude:35.79,longitude:129.33,date:'2026-11-24'},{type:'PHOTO',entryId:71,imageUrl:image,placeName:'불국사',latitude:35.79,longitude:129.33,locationSource:'MANUAL',takenAtSource:'MANUAL',takenAt:'2026-11-24T10:00:00Z'}]};
  if(path==='/travel-cards/8')data={cardId:8,timeline:[]};
  if(path==='/places/search')data=[{name:'경주역',address:'경북 경주시',latitude:35.8,longitude:129.2}];
  if(path==='/notifications')data={items:notifications,hasNext:false};
  if(path==='/notifications/unread-count')data={unreadCount:0};
  if(path==='/region-map')data={trips:[{tripCardId:7,regionCode:'47',cityName:'경주'}],visited:[{regionCode:'47',regionName:'경북',tripCount:1}]};
  return route.fulfill({json:data,headers});
 });
 await page.addInitScript(()=>{localStorage.setItem('accessToken','isolated-browser-mock');sessionStorage.removeItem('parttrip:active-planner-id');sessionStorage.setItem('parttrip:planner-creation-draft',JSON.stringify({cityName:'경주',regionName:'경북',regionCode:'47',startDate:'2099-01-01',endDate:'2099-01-02',blocks:[]}))});
 await page.goto(origin+'/planner/7');await page.getByRole('heading',{name:'경주 가을여행',exact:true}).waitFor();check(await page.getByText('확정된 일정',{exact:true}).count()===1,'#84 새 탭 세션 없이 URL로 확정 일정 조회');check(await page.getByRole('list',{name:'여행 플래너 진행 단계'}).count()===0,'#84 확정 일정 만들기 단계 숨김');
 await page.goto(origin+'/planner/destination');await page.getByRole('heading',{name:'국내 도시 · 기간'}).waitFor();check(true,'#77 도시 · 기간 제목');
 await page.goto(origin+'/planner/explore');await page.getByRole('button',{name:'혼자',exact:true}).waitFor();await page.getByRole('button',{name:'혼자',exact:true}).click();await page.getByRole('button',{name:'다른 곳 찾기',exact:true}).waitFor();check(await page.getByRole('button',{name:'우리 집으로'}).count()===0,'#86 집 미등록 계정도 출발지 질문 표시');check(await page.getByRole('button',{name:'건너뛰기',exact:true}).count()===1,'#78 선택하지 않은 질문 건너뛰기');
 await page.getByRole('button',{name:'다른 곳 찾기',exact:true}).click();await page.getByRole('textbox',{name:'장소 검색'}).fill('경주역');await page.getByRole('button',{name:'경주역 경북 경주시'}).click();await page.getByRole('dialog').waitFor({state:'hidden'});
 await page.getByRole('button',{name:'나머지는 기본으로 만들기',exact:true}).click();await page.getByRole('button',{name:'AI로 일정 만들기',exact:true}).click();await page.getByText('검증용 생성 중단',{exact:true}).waitFor();check(generated?.departure?.name==='경주역'||JSON.stringify(generated).includes('경주역'),'#78 동행 선택 후 확인·생성 바로 이동 / #86 출발지 전달');
 // Edit optional place names and verify actual request payload.
 await page.getByRole('button',{name:'이전',exact:true}).click(); // foods
 for(let i=0;i<3;i++)await page.getByRole('button',{name:'이전',exact:true}).click(); // include
 await page.locator('#place-names-MUST_INCLUDE').waitFor();await page.locator('#place-names-MUST_INCLUDE').fill(' 경주월드, 불국사 ');
 await page.getByRole('button',{name:'다음',exact:true}).click();await page.locator('#place-names-EXCLUDE').fill('첨성대');
 await page.getByRole('button',{name:'나머지는 기본으로 만들기',exact:true}).click();await page.getByRole('button',{name:'AI로 일정 만들기',exact:true}).click();await page.getByText('검증용 생성 중단',{exact:true}).waitFor();
 check(generated.blocks.filter(b=>b.type==='MUST_INCLUDE').map(b=>b.value).join(',')==='경주월드,불국사'&&!JSON.stringify(generated.blocks).includes('식당'),'#82 실제 장소 이름만 포함·제외 요청');
 await page.goto(origin+'/trip-cards');await page.getByRole('button',{name:/경주/}).first().waitFor();const cardSize=await page.getByRole('button',{name:/경주/}).first().boundingBox();check(cardSize.width>300&&cardSize.height>300,'#81 카드 크기 복구');check(await page.getByText('함께한 사람',{exact:true}).count()===0&&await page.getByLabel('여행카드 페이지').count()===0,'#81 미지원 통계·고정 페이지 점 제거');
 await page.goto(origin+'/record/8');await page.getByRole('heading',{name:'아직 남긴 사진이 없어요'}).waitFor();check(await page.getByRole('img',{name:/기록 사진/}).count()===0&&await page.getByRole('button',{name:'위치 수정'}).count()===0,'#80 사진 없는 상세에 시안 사진·수정 버튼 없음');
 await page.goto(origin+'/record/8/edit');await page.getByRole('heading',{name:'아직 남긴 사진이 없어요'}).waitFor();check(await page.getByRole('img',{name:'여행 사진'}).count()===0,'#80 사진 없는 편집에 시안 이미지 없음');
 await page.goto(origin+'/record/7');await page.getByRole('button',{name:'위치 수정'}).waitFor();check(await page.getByText('AI 해설',{exact:true}).count()===0,'#80 AI 배지 제거');await page.getByRole('button',{name:'위치 수정'}).click();await page.getByRole('textbox',{name:'장소 검색'}).fill('경주역');await page.getByRole('button',{name:'경주역 경북 경주시'}).click();await page.getByRole('dialog').waitFor({state:'hidden'});check(writes.some(x=>x.path==='/travel-cards/7/entries/71/metadata'&&x.body.placeName==='경주역'),'#80 장소 검색으로 위치 수정 요청');
 await page.goto(origin+'/record/map');await page.getByRole('heading',{name:'방문 장소',exact:true}).waitFor();check(await page.getByRole('link',{name:'불국사 지도 보기'}).count()>0&&await page.getByText('2026.11.24',{exact:true}).count()>0,'#79 국내 방문 장소·실제 지도 링크 / #87 날짜 점 표기');check(await page.locator('img[alt*="도심 지도"]').count()===0,'#79 시안 지도 제거');
 await page.goto(origin+'/notifications');await page.getByText('오늘은 경주월드 · 불국사 일정이에요.',{exact:true}).waitFor();check(true,'#83 목록 본문 표시');check(await page.getByRole('button',{name:'플래너',exact:true}).count()===1&&await page.getByRole('button',{name:'기록',exact:true}).count()===1,'#87 알림 분류 통일');
 await page.getByRole('button',{name:'읽은 알림: 오늘 일정'}).click();await page.getByRole('button',{name:'일정 보러가기'}).click();await page.waitForURL('**/planner/7');check(true,'#83 PLANNER 알림에서 ID 포함 일정 이동');
 await page.goto(origin+'/notifications/2');await page.getByRole('button',{name:'지도 보러가기'}).click();await page.waitForURL('**/profile/map');await page.getByText('방문한 시·도 1 / 17',{exact:true}).waitFor();check(true,'#83 REGION_MAP 이동 / #87 17개 시·도 방문 집계');
 await page.goto(origin+'/profile');await page.getByText('여행 편의 설정과 가족 연결을 관리해요',{exact:true}).waitFor();check(await page.getByText('이동수단 · 하루 일정 개수 · 계단 이용').count()===0,'#87 마이페이지 설명 갱신');check(await page.getByText('가족 연결',{exact:true}).count()>0,'#87 가족 연결 메뉴');
 await page.goto(origin+'/record/calendar');await page.getByRole('heading',{name:'축제 · 이벤트'}).waitFor();await page.getByText('11.24 – 12.01',{exact:false}).first().waitFor();check(await page.getByText('2026.11.17 – 12.16 (여행 기간 ±1주)',{exact:false}).count()>0,'#77 같은 해 기간 뒤 연도 생략');
 await page.setViewportSize({width:375,height:812});await page.waitForTimeout(100);check(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),'#85 375px 달력 가로 넘침 없음');await page.screenshot({path:'output/playwright/issues-77-87-mobile.png',fullPage:true});await page.setViewportSize({width:1440,height:1000});await page.screenshot({path:'output/playwright/issues-77-87-desktop.png',fullPage:true});
 check(errors.length===0,'브라우저 실행 오류 없음');return {results,writes,apiMode:'Local app with mocked API; no real account writes'};
}
