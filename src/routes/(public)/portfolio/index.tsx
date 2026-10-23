import { createFileRoute } from '@tanstack/react-router'
import styled from 'styled-components'
import { LandingHeader } from '@/widgets/landing'

export const Route = createFileRoute('/(public)/portfolio/')({ component: PortfolioPage })

const PAGE_COUNT = 26
const pages = Array.from({ length: PAGE_COUNT }, (_, index) => index + 1)

const Page = styled.div`
  min-height: 100dvh;
  background: ${({ theme }) => theme.colors.background.muted};
  word-break: keep-all;
`

const Main = styled.main`
  width: min(100% - 2rem, 64rem);
  margin: 0 auto;
  padding: 2.5rem 0 5rem;
`

const Intro = styled.header`
  margin-bottom: 1.5rem;

  h1 {
    margin: 0;
    color: ${({ theme }) => theme.colors.text.strong};
    font-size: clamp(1.75rem, 4.5vw, 2.5rem);
    font-weight: 800;
    letter-spacing: -0.035em;
    line-height: 1.3;
  }

  p {
    margin: 0.5rem 0 0;
    color: ${({ theme }) => theme.colors.text.default};
    font-size: 1.0625rem;
    line-height: 1.6;
  }
`

const Slides = styled.ol`
  display: grid;
  gap: 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
`

const Slide = styled.li`
  margin: 0;

  img {
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: 16 / 9;
    border: 1px solid ${({ theme }) => theme.colors.border.subtle};
    border-radius: 0.75rem;
    background: ${({ theme }) => theme.colors.background.default};
  }

  span {
    display: block;
    margin-top: 0.375rem;
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: 0.875rem;
    text-align: right;
  }
`

// 발표 자료를 쪽마다 그림으로 보여 준다. 휴대폰 브라우저는 PDF 를 끼워 넣으면 첫 쪽만 보여 주는 경우가 많아서
// PDF 를 바로 쓰지 않고 쪽 그림을 세로로 늘어놓는다 (public/portfolio/01.jpg ~)
function PortfolioPage() {
  return (
    <Page>
      <LandingHeader />
      <Main>
        <Intro>
          <h1>단디 포트폴리오</h1>
          <p>2026 나르샤 프로젝트 · 팀 우공이산. 시니어를 위한 AI 맞춤 여행 플래너 발표 자료예요.</p>
        </Intro>
        <Slides aria-label="포트폴리오 쪽 목록">
          {pages.map((page) => (
            <Slide key={page}>
              <img
                src={`/portfolio/${String(page).padStart(2, '0')}.jpg`}
                alt={`단디 포트폴리오 ${page}쪽`}
                width={1440}
                height={810}
                loading={page === 1 ? 'eager' : 'lazy'}
                decoding="async"
              />
              <span>{page} / {PAGE_COUNT}</span>
            </Slide>
          ))}
        </Slides>
      </Main>
    </Page>
  )
}
