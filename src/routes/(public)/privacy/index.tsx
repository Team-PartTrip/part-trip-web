import { createFileRoute } from '@tanstack/react-router'
import styled from 'styled-components'

export const Route = createFileRoute('/(public)/privacy/')({ component: PrivacyPage })

const sections = [
  ['collection', '수집하는 개인정보'],
  ['purpose', '이용 목적'],
  ['location', '위치정보'],
  ['retention', '보유 기간과 파기'],
  ['sharing', '제3자 제공'],
  ['transfer', '처리 위탁과 국외 이전'],
  ['rights', '이용자의 권리와 행사 방법'],
  ['security', '안전성 확보 조치'],
  ['children', '만 14세 미만 아동'],
  ['contact', '개인정보 보호책임자'],
  ['changes', '방침 변경'],
] as const

const Page = styled.main`
  min-height: 100dvh;
  padding: 3rem 1.5rem 5rem;
  background: ${({ theme }) => theme.colors.background.subtle};

  @media (max-width: 40rem) {
    padding: 1rem 0.75rem 2.5rem;
  }
`

const Article = styled.article`
  width: min(100%, 60rem);
  margin: 0 auto;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 1rem;
  padding: clamp(1.75rem, 6vw, 4.5rem);
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.default};
  line-height: 1.75;

  h1,
  h2,
  h3 {
    color: ${({ theme }) => theme.colors.text.strong};
    line-height: 1.35;
  }

  h1 {
    margin: 0;
    font-size: clamp(1.875rem, 5vw, 2.625rem);
    letter-spacing: -0.03em;
  }

  h2 {
    margin: 0 0 1.25rem;
    font-size: clamp(1.25rem, 3vw, 1.5rem);
    letter-spacing: -0.02em;
    scroll-margin-top: 1.5rem;
  }

  h3 {
    margin: 1.5rem 0 0.5rem;
    font-size: 1.0625rem;
  }

  p {
    max-width: 72ch;
    margin: 0 0 0.875rem;
  }

  ul {
    max-width: 72ch;
    margin: 0.75rem 0 1.25rem;
    padding-left: 1.3em;
  }

  li + li {
    margin-top: 0.5rem;
  }

  a {
    color: ${({ theme }) => theme.colors.brand.strong};
    text-decoration-thickness: 0.0625rem;
    text-underline-offset: 0.1875rem;
  }

  a:hover {
    color: ${({ theme }) => theme.colors.brand.primaryHover};
  }

  .effective-date {
    display: inline-block;
    margin-top: 0.875rem;
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: 0.875rem;
  }

  .contents {
    margin-top: 2.25rem;
    border-block: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
    padding: 1.25rem 0;
  }

  .contents h2 {
    margin-bottom: 0.75rem;
    font-size: 1rem;
  }

  .contents ul {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.375rem 1.25rem;
    max-width: none;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .contents li + li {
    margin-top: 0;
  }

  .contents a {
    display: inline-flex;
    min-height: 2.5rem;
    align-items: center;
    font-size: 0.875rem;
  }

  .section {
    border-bottom: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
    padding: 2.25rem 0;
  }

  .section:last-child {
    border-bottom: 0;
    padding-bottom: 0;
  }

  .table-scroll {
    overflow-x: auto;
    margin: 1.25rem 0;
    border: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
    border-radius: 0.75rem;
    scrollbar-color: ${({ theme }) => theme.colors.border.default} transparent;
    scrollbar-width: thin;
  }

  .table-scroll:focus-visible {
    outline: 0.1875rem solid ${({ theme }) => theme.colors.shadow.focus};
    outline-offset: 0.1875rem;
  }

  table {
    width: 100%;
    min-width: 42.5rem;
    border-collapse: collapse;
    text-align: left;
    font-size: 0.875rem;
    line-height: 1.65;
  }

  th,
  td {
    border-bottom: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
    padding: 0.8125rem 0.9375rem;
    vertical-align: top;
  }

  thead th {
    background: ${({ theme }) => theme.colors.background.soft};
    color: ${({ theme }) => theme.colors.text.strong};
    font-weight: 700;
    white-space: nowrap;
  }

  tbody th {
    min-width: 7rem;
    color: ${({ theme }) => theme.colors.text.strong};
    font-weight: 600;
  }

  tbody tr:last-child th,
  tbody tr:last-child td {
    border-bottom: 0;
  }

  .contact-list {
    padding-left: 1.25em;
  }

  @media (max-width: 40rem) {
    border-radius: 0.75rem;
    padding: 1.75rem 1.125rem 2.25rem;

    .contents ul {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.125rem 0.75rem;
    }

    .contents a {
      font-size: 0.8125rem;
    }

    .section {
      padding: 1.75rem 0;
    }

    table {
      min-width: 38.75rem;
    }
  }
`

function PrivacyPage() {
  return (
    <Page>
      <Article>
        <header>
          <h1>개인정보처리방침</h1>
          <time className="effective-date" dateTime="2026-09-26">2026년 9월 26일부터 시행</time>
        </header>

        <nav className="contents" aria-label="개인정보처리방침 목차">
          <h2>이 문서에서 찾기</h2>
          <ul>
            {sections.map(([id, title], index) => (
              <li key={id}><a href={`#${id}`}>{index + 1}. {title}</a></li>
            ))}
          </ul>
        </nav>

        <section className="section" aria-labelledby="collection">
          <h2 id="collection">1. 수집하는 개인정보</h2>
          <p>단디는 서비스에 꼭 필요한 정보만 모읍니다. 비밀번호 · 전화번호 · 주민등록번호는 받지 않습니다.</p>
          <div className="table-scroll" role="region" aria-label="수집하는 개인정보 표" tabIndex={0}>
            <table>
              <thead><tr><th scope="col">구분</th><th scope="col">항목</th><th scope="col">언제 · 어떻게</th><th scope="col">필수 여부</th></tr></thead>
              <tbody>
                <tr><th scope="row">회원 가입 · 로그인</th><td>이메일, 간편 로그인 식별자, 로그인 방식(구글 · 카카오)</td><td>구글 또는 카카오로 로그인할 때 해당 서비스에서 받음</td><td>필수</td></tr>
                <tr><th scope="row">프로필</th><td>닉네임(자동 생성, 수정 가능), 프로필 사진</td><td>가입 시 자동 생성, 사진은 이용자가 올릴 때</td><td>사진은 선택</td></tr>
                <tr><th scope="row">여행 계획</th><td>여행 제목, 기간, 지역 · 도시, 인원, 고른 여행 지침, 일정, 함께 가는 일행</td><td>일정을 만들거나 초대를 받을 때</td><td>필수(일정을 쓸 때)</td></tr>
                <tr><th scope="row">여행 편의 설정</th><td>선호 이동수단, 계단 이용 가능 여부, 하루에 다닐 장소 수</td><td>마이 → 여행 편의 설정에서 이용자가 고를 때. 고르지 않으면 기본값으로 일정을 짭니다</td><td>선택</td></tr>
                <tr><th scope="row">여행 기록</th><td>사진, 사진의 촬영 시각 · 촬영 위치(사진 파일에 들어 있는 값), 남긴 글</td><td>이용자가 여행카드에 사진을 올릴 때</td><td>선택</td></tr>
                <tr><th scope="row">보호자 연결</th><td>연결된 보호자 · 보호 대상, 초대 코드</td><td>가족 연결을 할 때</td><td>선택</td></tr>
                <tr><th scope="row">실시간 위치</th><td>현재 위치(위도 · 경도), 기록 시각</td><td>위치 공유에 동의하고 여행 중일 때, 앱이 켜져 있는 동안 약 1~2분마다</td><td>선택</td></tr>
                <tr><th scope="row">자동 생성 정보</th><td>서비스 이용 기록, 접속 기록, 알림 내역</td><td>서비스를 쓰는 동안 자동으로</td><td>필수</td></tr>
              </tbody>
            </table>
          </div>
          <p>실시간 위치와 사진 촬영 위치는 아래 “3. 위치정보”에서 따로 설명합니다.</p>
        </section>

        <section className="section" aria-labelledby="purpose">
          <h2 id="purpose">2. 이용 목적</h2>
          <p>모은 정보는 아래 목적에만 씁니다. 목적이 바뀔 때는 미리 알리고 다시 동의를 받습니다.</p>
          <ul>
            <li><strong>회원 관리</strong>: 본인 확인, 로그인 유지, 부정 이용 방지</li>
            <li><strong>여행 일정</strong>: AI 일정 초안 만들기, 일정 편집, 일행 초대</li>
            <li><strong>여행 기록</strong>: 여행카드, 사진을 찍은 곳을 지도에 표시, 대한민국 지도에 다녀온 지역 표시</li>
            <li><strong>보호자 기능</strong>: 가족 연결, 여행 중 보호자에게 현재 위치와 일정 보여주기</li>
            <li><strong>알림</strong>: 일정 확정, 여행카드 생성 등 서비스 알림</li>
            <li><strong>서비스 개선</strong>: 오류 확인과 장애 대응</li>
          </ul>
        </section>

        <section className="section" aria-labelledby="location">
          <h2 id="location">3. 위치정보</h2>
          <p>단디는 두 가지 위치를 다룹니다. 둘 다 이용자가 켜거나 올릴 때만 모입니다.</p>
          <div className="table-scroll" role="region" aria-label="위치정보 처리 기준 표" tabIndex={0}>
            <table>
              <thead><tr><th scope="col">구분</th><th scope="col">보호자 위치 공유</th><th scope="col">사진 촬영 위치</th></tr></thead>
              <tbody>
                <tr><th scope="row">무엇을</th><td>현재 위치(위도 · 경도)와 기록 시각</td><td>사진 파일에 들어 있는 촬영 위치와 시각</td></tr>
                <tr><th scope="row">언제</th><td>위치 공유에 동의하고, 여행 기간이며, 앱이 켜져 있는 동안 약 1~2분마다</td><td>여행카드에 사진을 올릴 때</td></tr>
                <tr><th scope="row">누가 보나</th><td>본인이 연결한 보호자만</td><td>본인(여행카드 주인)만</td></tr>
                <tr><th scope="row">얼마나 보관</th><td>마지막 위치 하나만 남기고, 공유를 끄거나 12시간 동안 새 위치가 없으면 지움</td><td>사진을 지우거나 여행카드를 지울 때까지</td></tr>
                <tr><th scope="row">끄는 법</th><td>마이 → 가족 연결에서 언제든 끄기, 또는 휴대폰 설정에서 위치 권한 끄기</td><td>사진을 올리기 전에 휴대폰 카메라의 위치 저장을 끄기</td></tr>
              </tbody>
            </table>
          </div>
          <p>지도는 휴대폰에 들어 있는 지도(iOS 애플 지도, 안드로이드 구글 지도)로 그립니다. 이때 지도 제공자에게 보이는 화면 범위가 전달될 수 있습니다.</p>
        </section>

        <section className="section" aria-labelledby="retention">
          <h2 id="retention">4. 보유 기간과 파기</h2>
          <p>회원 탈퇴하면 개인정보를 지체 없이 파기합니다. 법에서 따로 보관을 정한 경우만 그 기간 동안 따로 보관합니다.</p>
          <div className="table-scroll" role="region" aria-label="개인정보 보유 기간 표" tabIndex={0}>
            <table>
              <thead><tr><th scope="col">항목</th><th scope="col">보관 기간</th></tr></thead>
              <tbody>
                <tr><th scope="row">회원 정보 · 여행 계획 · 여행 기록</th><td>회원 탈퇴 시까지</td></tr>
                <tr><th scope="row">실시간 위치</th><td>공유를 끄거나 마지막 기록 후 12시간까지</td></tr>
                <tr><th scope="row">보호자 초대 코드</th><td>만든 뒤 24시간</td></tr>
                <tr><th scope="row">접속 기록</th><td>3개월 (통신비밀보호법)</td></tr>
              </tbody>
            </table>
          </div>
          <p>파기할 때 전자 파일은 되살릴 수 없게 지우고, 사진 파일도 서버에서 지웁니다.</p>
        </section>

        <section className="section" aria-labelledby="sharing">
          <h2 id="sharing">5. 제3자 제공</h2>
          <p>단디는 개인정보를 팔거나 다른 회사에 넘기지 않습니다. 다만 이용자가 직접 연결하거나 초대한 사람에게는 아래 정보가 보입니다.</p>
          <ul>
            <li><strong>보호자</strong>: 연결한 부모님의 여행 일정, 위치 공유를 켜 둔 동안의 현재 위치</li>
            <li><strong>함께 가는 일행</strong>: 닉네임, 프로필 사진, 같은 여행의 일정</li>
          </ul>
          <p>법에 따라 수사기관 등이 정해진 절차로 요청하는 경우는 예외입니다.</p>
        </section>

        <section className="section" aria-labelledby="transfer">
          <h2 id="transfer">6. 처리 위탁과 국외 이전</h2>
          <p>서비스를 운영하려고 아래 업체에 일부 업무를 맡깁니다. 회원 데이터가 저장되는 곳은 일본(도쿄)입니다.</p>
          <div className="table-scroll" role="region" aria-label="처리 위탁 및 국외 이전 표" tabIndex={0}>
            <table>
              <thead><tr><th scope="col">업체</th><th scope="col">맡기는 일</th><th scope="col">가는 정보</th><th scope="col">위치</th></tr></thead>
              <tbody>
                <tr><th scope="row">Supabase</th><td>데이터베이스 보관</td><td>이 방침의 모든 항목</td><td>일본(도쿄)</td></tr>
                <tr><th scope="row">Amazon Web Services</th><td>서버 운영, 사진 파일 보관</td><td>이 방침의 모든 항목</td><td>대한민국(서울)</td></tr>
                <tr><th scope="row">OpenAI</th><td>AI 일정 초안 만들기</td><td>여행 도시, 날짜, 인원, 고른 지침, 이동 · 계단 이용 여부. 이름 · 이메일 · 여행 제목은 보내지 않음</td><td>미국</td></tr>
                <tr><th scope="row">Google</th><td>구글 로그인, 장소 검색 · 사진, 안드로이드 지도</td><td>로그인 정보, 검색한 도시 이름</td><td>미국</td></tr>
                <tr><th scope="row">Kakao</th><td>카카오 로그인</td><td>로그인 정보</td><td>대한민국</td></tr>
                <tr><th scope="row">Vercel</th><td>웹 사이트 운영</td><td>접속 기록</td><td>미국</td></tr>
              </tbody>
            </table>
          </div>
          <p>국외로 보내는 정보는 서비스를 쓰는 동안 암호화된 통신(HTTPS)으로 전달되고, 각 업체의 보관 기간은 위 4번과 같습니다. 국외 이전을 원하지 않으면 가입하지 않거나 탈퇴할 수 있지만, 이 경우 서비스를 쓸 수 없습니다.</p>
        </section>

        <section className="section" aria-labelledby="rights">
          <h2 id="rights">7. 이용자의 권리와 행사 방법</h2>
          <p>이용자는 언제든 자기 개인정보를 보고, 고치고, 지우고, 처리를 멈추라고 요청할 수 있습니다.</p>
          <ul>
            <li><strong>앱에서 바로</strong>: 프로필 수정, 사진 · 여행카드 삭제, 보호자 연결 끊기, 위치 공유 끄기, 회원 탈퇴(마이 → 회원 탈퇴)</li>
            <li><strong>요청으로</strong>: 아래 보호책임자에게 이메일로 요청하면 10일 안에 처리하고 결과를 알려드립니다.</li>
            <li><strong>동의 철회</strong>: 위치 공유 동의는 앱 설정에서, 로그인 연동은 구글 · 카카오 계정 설정에서 끊을 수 있습니다.</li>
          </ul>
          <p>보호자가 볼 수 있는 정보는 부모님(보호 대상) 본인이 연결을 끊으면 즉시 보이지 않게 됩니다.</p>
        </section>

        <section className="section" aria-labelledby="security">
          <h2 id="security">8. 안전성 확보 조치</h2>
          <ul>
            <li>앱과 서버 사이의 모든 통신은 HTTPS로 암호화합니다.</li>
            <li>비밀번호를 받지 않고, 로그인은 구글 · 카카오 인증과 만료 시간이 있는 토큰으로만 합니다.</li>
            <li>다른 사람의 여행 · 위치는 연결된 보호자나 같은 일행만 볼 수 있게 서버가 매번 확인합니다.</li>
            <li>개인정보에 접근할 수 있는 사람을 운영진으로 제한합니다.</li>
          </ul>
        </section>

        <section className="section" aria-labelledby="children">
          <h2 id="children">9. 만 14세 미만 아동</h2>
          <p>단디는 만 14세 미만 아동의 가입을 받지 않습니다.</p>
        </section>

        <section className="section" aria-labelledby="contact">
          <h2 id="contact">10. 개인정보 보호책임자</h2>
          <p>개인정보 관련 문의 · 불만 · 피해 구제는 아래로 연락해 주세요.</p>
          <ul className="contact-list">
            <li>책임자: 이준현, 팀장</li>
            <li>이메일: <a href="mailto:2junhyeon@dgsw.hs.kr">2junhyeon@dgsw.hs.kr</a></li>
          </ul>
          <p>단디에서 해결되지 않으면 아래 기관에 문의할 수 있습니다.</p>
          <ul className="contact-list">
            <li>개인정보침해 신고센터: 국번 없이 118</li>
            <li>개인정보 분쟁조정위원회: 1833-6972</li>
          </ul>
        </section>

        <section className="section" aria-labelledby="changes">
          <h2 id="changes">11. 방침 변경</h2>
          <p>이 방침은 2026년 9월 26일부터 적용합니다. 내용이 바뀌면 시행 7일 전(이용자에게 불리한 변경은 30일 전)에 앱과 웹에 알립니다.</p>
        </section>
      </Article>
    </Page>
  )
}
