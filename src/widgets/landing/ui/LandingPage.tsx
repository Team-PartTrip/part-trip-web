import { Link } from '@tanstack/react-router'
import { dandiAppLogoUrl } from '@/shared/assets'
import { paths } from '@/shared/config'
import { DandiWordmark } from '@/shared/ui/dandi-wordmark/DandiWordmark'
import blocksShotUrl from '../assets/app-blocks.jpg'
import portfolioQrUrl from '../assets/portfolio-qr.jpg'
import scheduleShotUrl from '../assets/app-schedule.jpg'
import { ClockIcon, DatabaseIcon, DocumentIcon, RestroomIcon, RouteIcon, WalkIcon, WheelchairIcon } from './LandingIcons'
import * as S from './LandingPage.styles'
import { Reveal } from './Reveal'

const careLines = [
  { icon: WalkIcon, title: '오래 걷기 힘들면', body: '많이 걷지 않아도 되는 곳을 가까운 순서로 이어요.' },
  { icon: WheelchairIcon, title: '휠체어를 쓰면', body: '계단과 비탈이 적고 편의 시설 정보가 있는 곳을 먼저 골라요.' },
  { icon: RestroomIcon, title: '화장실이 걱정되면', body: '화장실 정보가 있는 곳은 미리 알려 드려요.' },
  { icon: RouteIcon, title: '길이 헷갈리면', body: '몇 번 버스를 타고 몇 분 걷는지 보여 주고, 카카오맵 길 안내로 이어 드려요.' },
]

const trustItems = [
  { icon: ClockIcon, title: '위치는 12시간만', body: '여행 중 앱에서 공유를 켠 동안만 보내고, 12시간이 지나면 지워요.' },
  { icon: DatabaseIcon, title: '믿을 수 있는 정보로', body: '한국관광공사, 구글 장소 정보, 카카오 지도를 바탕으로 일정을 짜요.' },
  { icon: DocumentIcon, title: '방침은 모두 공개', body: '어떤 정보를 왜 받는지 개인정보처리방침에 적어 두었어요.' },
]

export function LandingHeader() {
  return (
    <S.Header>
      <S.HeaderInner>
        <S.Brand to="/" aria-label="단디 홈">
          <img src={dandiAppLogoUrl} alt="" width={36} height={36} />
          <DandiWordmark height={24} />
        </S.Brand>
        <S.HeaderLink to={paths.login}>시작하기</S.HeaderLink>
      </S.HeaderInner>
    </S.Header>
  )
}

export function LandingPage() {
  return (
    <S.Page>
      <LandingHeader />

      <main>
        <S.Hero aria-labelledby="landing-title">
          <Reveal>
            <S.Eyebrow>시니어를 위한 여행 플래너</S.Eyebrow>
          </Reveal>
          <Reveal delay={120}>
            <S.HeroTitle id="landing-title">
              덜 걷고 덜 헤매는
              <br />
              내 걸음에 맞춘 여행
            </S.HeroTitle>
          </Reveal>
          <Reveal delay={240}>
            <S.HeroLead>
              가고 싶은 지역과 다니기 불편한 점만 알려 주세요.
              <br />
              쉬엄쉬엄 다닐 수 있는 하루를 짜 드려요.
            </S.HeroLead>
          </Reveal>
          <Reveal delay={360}>
            <S.PrimaryAction to={paths.login}>여행 계획 시작하기</S.PrimaryAction>
          </Reveal>
          <Reveal delay={480}>
            <S.HeroStage>
              <S.HeroPhone>
                <img src={scheduleShotUrl} alt="단디 앱에서 AI가 짠 대구 1일차 일정. 장소마다 버스 번호와 걷는 시간, 길 안내 버튼, 화장실 정보가 보인다" />
              </S.HeroPhone>
              <S.FloatChip $side="left" $top="22%" aria-hidden="true">
                <S.ChipDot $tone="blue" />
                버스 급행1 · 22분
              </S.FloatChip>
              <S.FloatChip $side="right" $top="38%" aria-hidden="true">
                <S.ChipDot $tone="green" />
                장애인 화장실 있음
              </S.FloatChip>
              <S.FloatChip $side="left" $top="58%" aria-hidden="true">
                <S.ChipDot $tone="orange" />
                걸어서 9분
              </S.FloatChip>
            </S.HeroStage>
          </Reveal>
        </S.Hero>

        <S.Story aria-labelledby="landing-step1">
          <S.StoryText>
            <Reveal>
              <S.StepLabel>1단계</S.StepLabel>
              <S.StoryTitle id="landing-step1">
                어디로 갈지,
                <br />
                무엇이 불편한지만
              </S.StoryTitle>
              <S.StoryBody>
                지역을 고르고 휠체어, 오래 걷기, 계단 중 불편한 점을 알려 주세요. 피하는 음식도 골라 두면 다음 여행 때 그대로 기억해요.
              </S.StoryBody>
            </Reveal>
          </S.StoryText>
          <Reveal delay={150}>
            <S.Backdrop $tone="blue">
              <S.Phone>
                <img src={blocksShotUrl} alt="여행지와 취향을 고르는 화면. 시 · 도 목록과 다니실 때 불편한 점 선택지가 보인다" />
              </S.Phone>
            </S.Backdrop>
          </Reveal>
        </S.Story>

        <S.Story $reverse aria-labelledby="landing-step2">
          <S.StoryText>
            <Reveal>
              <S.StepLabel>2단계</S.StepLabel>
              <S.StoryTitle id="landing-step2">
                잠깐 기다리면
                <br />
                하루 일정이 나와요
              </S.StoryTitle>
              <S.StoryBody>
                되도록 가까운 곳끼리 이어서 짜고, 장소 사이를 무엇을 타고 몇 분 가는지도 함께 보여 드려요. 마음에 안 드는 곳은 바꿀 수 있어요.
              </S.StoryBody>
            </Reveal>
          </S.StoryText>
          <Reveal delay={150}>
            <S.Backdrop $tone="orange">
              <S.Phone>
                <img src={scheduleShotUrl} alt="AI가 짠 일정 화면. 서문시장, 막삼가 대구 교동 본점, 대구 메리어트 호텔 순서와 버스 · 지하철 경로가 보인다" />
              </S.Phone>
            </S.Backdrop>
          </Reveal>
        </S.Story>

        <S.Story aria-labelledby="landing-step3">
          <S.StoryText>
            <Reveal>
              <S.StepLabel>3단계</S.StepLabel>
              <S.StoryTitle id="landing-step3">
                멀리 사는 자녀도
                <br />
                같이 볼 수 있어요
              </S.StoryTitle>
              <S.StoryBody>
                자녀를 보호자로 연결하면 여행 일정과, 앱에서 위치 공유를 켜 둔 동안의 현재 위치를 볼 수 있어요. 같이 가는 일행은 링크 하나로 같은 일정에 들어와요.
              </S.StoryBody>
            </Reveal>
          </S.StoryText>
          <Reveal delay={150}>
            <S.Backdrop $tone="green">
              <S.Phone $drawn aria-label="보호자 화면 예시: 부모님의 지금 위치와 여행 일정">
                <S.MockTitle>엄마의 여행</S.MockTitle>
                <S.MockLabel>지금 위치</S.MockLabel>
                <S.MockCard>
                  <S.MockMap aria-hidden="true">
                    <span />
                  </S.MockMap>
                  <strong>방금 전 위치</strong>
                  <S.MockButton>지도에서 보기</S.MockButton>
                </S.MockCard>
                <S.MockLabel>여행 일정</S.MockLabel>
                <S.MockRow>
                  <strong>대구 가을 나들이</strong>
                  <span>11.10 ~ 11.11 · 계획 확정</span>
                </S.MockRow>
              </S.Phone>
            </S.Backdrop>
          </Reveal>
        </S.Story>

        <S.Story $reverse aria-labelledby="landing-step4">
          <S.StoryText>
            <Reveal>
              <S.StepLabel>4단계</S.StepLabel>
              <S.StoryTitle id="landing-step4">
                다녀온 곳은
                <br />
                사진과 함께 남아요
              </S.StoryTitle>
              <S.StoryBody>
                여행 중에 찍은 사진을 여행카드에 담으면 찍은 곳이 지도에 남아요. 다녀온 시 · 도는 따로 모아서 볼 수 있어요.
              </S.StoryBody>
            </Reveal>
          </S.StoryText>
          <Reveal delay={150}>
            <S.Backdrop $tone="orange">
              <S.Phone $drawn aria-label="여행카드 예시: 대구 가을 나들이, 사진 3장">
                <S.MockTitle>대구 가을 나들이</S.MockTitle>
                <S.MockLabel>남긴 사진</S.MockLabel>
                <S.MockCard>
                  <S.MockMap aria-hidden="true">
                    <span />
                  </S.MockMap>
                  <strong>사진 3장</strong>
                  <S.MockButton>찍은 곳 지도에서 보기</S.MockButton>
                </S.MockCard>
                <S.MockLabel>다녀온 곳</S.MockLabel>
                <S.MockRow>
                  <strong>방문한 시 · 도 1곳</strong>
                  <span>대구</span>
                </S.MockRow>
              </S.Phone>
            </S.Backdrop>
          </Reveal>
        </S.Story>

        <S.Care aria-labelledby="landing-care">
          <Reveal>
            <S.CareTitle id="landing-care">
              단디는
              <br />
              이런 것까지 챙겨요
            </S.CareTitle>
          </Reveal>
          <S.CareList>
            {careLines.map(({ icon: Icon, title, body }, index) => (
              <Reveal key={title} as="li" delay={index * 80}>
                <S.CareIcon>
                  <Icon />
                </S.CareIcon>
                <h3>{title}</h3>
                <p>{body}</p>
              </Reveal>
            ))}
          </S.CareList>
        </S.Care>

        <S.Trust aria-labelledby="landing-trust">
          <Reveal>
            <S.TrustTitle id="landing-trust">위치와 개인정보는 이렇게 다뤄요</S.TrustTitle>
          </Reveal>
          <S.TrustList>
            {trustItems.map(({ icon: Icon, title, body }, index) => (
              <Reveal key={title} as="li" delay={index * 80}>
                <S.TrustIcon>
                  <Icon size={24} />
                </S.TrustIcon>
                <h3>{title}</h3>
                <p>{body}</p>
              </Reveal>
            ))}
          </S.TrustList>
          <S.TrustLink to={paths.privacy}>개인정보처리방침 보기</S.TrustLink>
        </S.Trust>

        <S.Closing aria-labelledby="landing-closing">
          <Reveal>
            <S.ClosingTitle id="landing-closing">
              다음 여행은
              <br />
              단디와 함께 떠나 보세요
            </S.ClosingTitle>
          </Reveal>
          <Reveal delay={150}>
            <S.InverseAction to={paths.login}>여행 계획 시작하기</S.InverseAction>
          </Reveal>
        </S.Closing>
      </main>

      <S.Footer>
        <span>단디 · 우공이산</span>
        <Link to={paths.privacy}>개인정보처리방침</Link>
      </S.Footer>

      <S.QrDock to="/portfolio" aria-label="단디 포트폴리오 보기">
        <img src={portfolioQrUrl} alt="포트폴리오로 연결되는 QR 코드" width={357} height={357} />
        <span>포트폴리오 보기</span>
      </S.QrDock>
    </S.Page>
  )
}