import { useState } from 'react'
import catAvatarUrl from '@shared/assets/community-avatar-cat.png'
import dogAvatarUrl from '@shared/assets/community-avatar-dog.png'
import communityDaNangUrl from '@shared/assets/community-destination-danang.jpg'
import communitySwissUrl from '@shared/assets/community-destination-swiss.jpg'
import communityTokyoUrl from '@shared/assets/community-destination-tokyo.jpg'
import italyUrl from '@shared/assets/community-italy.jpg'
import swissUrl from '@shared/assets/community-swiss.jpg'
import vietnamUrl from '@shared/assets/community-vietnam.jpg'
import logoUrl from '@shared/assets/logo.png'
import { MENUS, Sidebar } from '@widgets/sidebar'

import * as S from './CommunityPage.styles'

const categories = ['자유게시판', '여행 후기', '경로/일정 공유'] as const

function QuestionPost() {
  return (
    <S.QuestionCard>
      <S.Author><img src={catAvatarUrl} alt="" /><div><strong>계획적인 탐험가</strong><span>15분 전</span></div></S.Author>
      <h2>일본 교토 숙소 추천 부탁드려요! ⛩️</h2>
      <p>다음 달에 부모님 모시고 교토 3박 4일 여행 갑니다. 가와라마치 쪽이랑 교토역 근처 중에 어디가 더 이동하기 편할까요? 부모님이 걷는 걸 힘들어하셔서 위치 좋은 료칸이나 호텔 추천해주시면 감사하겠습니다!</p>
      <S.Reactions><span>♡ <b>8</b></span><span>▢ <b>12</b></span></S.Reactions>
    </S.QuestionCard>
  )
}

function PhotoPost() {
  return (
    <S.PhotoCard>
      <S.Author><img src={dogAvatarUrl} alt="" /><div><strong>TRAVLR 에디터 ⎈</strong><span>어제 · 여행꿀팁</span></div></S.Author>
      <S.PhotoGrid><img src={vietnamUrl} alt="베트남 풍경" /><img src={italyUrl} alt="이탈리아 골목" /><S.MorePhoto><img src={swissUrl} alt="스위스 알프스" /><span>+4</span></S.MorePhoto></S.PhotoGrid>
      <S.PhotoCopy><h2>초보 여행자를 위한 짐 싸기 꿀팁 TOP 5 🎒</h2><p>설레는 첫 해외여행, 무엇을 챙겨야 할지 막막하시죠? 베테랑 여행 에디터가 알려주는 부피 1/2로 줄</p></S.PhotoCopy>
      <S.Reactions><span className="heart">♡ <b>452</b></span><span>▢ <b>89</b></span></S.Reactions>
    </S.PhotoCard>
  )
}

export function CommunityPage() {
  const [category, setCategory] = useState<(typeof categories)[number]>('자유게시판')

  return (
    <S.Page>
      <Sidebar logo={<S.Logo src={logoUrl} alt="PartTrip" />} menus={MENUS} />
      <S.Content>
        <h1>커뮤니티</h1>
        <S.Tabs>{categories.map((item) => <button type="button" key={item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</S.Tabs>
        <S.Layout>
          <S.Feed>
            <S.Column><QuestionPost /><PhotoPost /><QuestionPost /></S.Column>
            <S.Column><PhotoPost /><QuestionPost /><QuestionPost /></S.Column>
          </S.Feed>
          <S.Aside>
            <S.CreateButton type="button">⊕ 게시글 작성하기</S.CreateButton>
            <S.Trending>
              <header><h2>인기 여행지</h2><button type="button">전체보기</button></header>
              <S.Destination><img src={communityTokyoUrl} alt="도쿄" /><div><strong>도쿄, 일본</strong><span>최근 24시간 1.2k+ 언급</span></div></S.Destination>
              <S.Destination><img src={communityDaNangUrl} alt="다낭" /><div><strong>다낭, 베트남</strong><span>인기 급상승 중 🔥</span></div></S.Destination>
              <S.Destination><img src={communitySwissUrl} alt="인터라켄" /><div><strong>인터라켄, 스위스</strong><span>여름 휴가 추천 1위</span></div></S.Destination>
            </S.Trending>
          </S.Aside>
        </S.Layout>
      </S.Content>
    </S.Page>
  )
}
