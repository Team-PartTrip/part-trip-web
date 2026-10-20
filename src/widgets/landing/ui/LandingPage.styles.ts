import { Link } from '@tanstack/react-router'
import styled, { css } from 'styled-components'

const mobile = '@media (max-width: 48rem)'
const navy = '#0b2440'

const tones = {
  blue: { soft: '#e8f2ff', strong: '#1a6ebf' },
  orange: { soft: '#fff1e6', strong: '#ff7a35' },
  green: { soft: '#e6f6ef', strong: '#087f5b' },
} as const
type Tone = keyof typeof tones

export const Page = styled.div`
  min-height: 100dvh;
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.default};
  font-size: 1.125rem;
  line-height: 1.6;
  word-break: keep-all;
`

export const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 0.0625rem solid rgb(16 42 66 / 6%);
  background: rgb(255 255 255 / 82%);
  backdrop-filter: saturate(180%) blur(12px);
`

export const HeaderInner = styled.div`
  display: flex;
  width: min(100% - 2rem, 72rem);
  height: 4rem;
  margin: 0 auto;
  align-items: center;
  justify-content: space-between;
`

export const Brand = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.brand.strong};
  text-decoration: none;

  img {
    border-radius: 0.5rem;
  }
`

const focusRing = css`
  &:focus-visible {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.inputFocus};
  }
`

export const HeaderLink = styled(Link)`
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  border-radius: 0.75rem;
  padding: 0 1.125rem;
  background: ${({ theme }) => theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  font-size: 1rem;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    background: ${({ theme }) => theme.colors.brand.primaryHover};
  }

  ${focusRing};
`

export const Hero = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: clamp(4rem, 12vh, 7.5rem) 1rem 0;
  overflow: hidden;
  background:
    radial-gradient(60rem 30rem at 50% -8rem, #dcebff 0%, rgb(220 235 255 / 0%) 70%),
    linear-gradient(#f4f9ff, #ffffff 60%);
  text-align: center;
`

export const Eyebrow = styled.p`
  display: inline-block;
  margin: 0 0 1.5rem;
  border: 0.0625rem solid #cfe2fb;
  border-radius: 999px;
  padding: 0.375rem 1rem;
  background: rgb(255 255 255 / 70%);
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: 1rem;
  font-weight: 700;
`

export const HeroTitle = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: clamp(2.5rem, 7.5vw, 5.25rem);
  font-weight: 800;
  line-height: 1.18;
  letter-spacing: -0.035em;
`

export const HeroLead = styled.p`
  margin: 1.5rem 0 2.5rem;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: clamp(1.125rem, 2.2vw, 1.375rem);
  line-height: 1.7;
`

const actionBase = css`
  display: inline-flex;
  min-height: 3.75rem;
  align-items: center;
  justify-content: center;
  border-radius: 1rem;
  padding: 0 2.25rem;
  font-size: 1.1875rem;
  font-weight: 700;
  text-decoration: none;
  transition: background-color 120ms ease, transform 120ms ease, box-shadow 120ms ease;

  &:active {
    transform: scale(0.98);
  }

  ${focusRing};
`

export const PrimaryAction = styled(Link)`
  ${actionBase};
  background: ${({ theme }) => theme.colors.brand.primary};
  box-shadow: 0 0.75rem 1.75rem rgb(26 110 191 / 28%);
  color: ${({ theme }) => theme.colors.text.inverse};

  &:hover {
    background: ${({ theme }) => theme.colors.brand.primaryHover};
  }
`

export const InverseAction = styled(Link)`
  ${actionBase};
  background: #fff;
  color: ${({ theme }) => theme.colors.brand.strong};

  &:hover {
    background: #eaf3ff;
  }
`

const phoneFrame = css`
  width: min(100%, 21rem);
  margin: 0 auto;
  border: 0.625rem solid #10161f;
  border-radius: 3rem;
  overflow: hidden;
  background: #10161f;
  box-shadow:
    0 2.5rem 5rem rgb(16 42 66 / 18%),
    0 0.5rem 1.5rem rgb(16 42 66 / 10%);

  img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 2.375rem;
  }
`

export const HeroStage = styled.div`
  position: relative;
  width: min(100%, 40rem);
  margin: 4.5rem auto -10rem;

  ${mobile} {
    margin: 3rem auto -6rem;
  }
`

export const HeroPhone = styled.div`
  ${phoneFrame};
  width: min(100%, 23rem);
`

export const FloatChip = styled.div<{ $side: 'left' | 'right'; $top: string }>`
  position: absolute;
  top: ${({ $top }) => $top};
  ${({ $side }) => ($side === 'left' ? 'left: 0;' : 'right: 0;')}
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  border-radius: 1rem;
  padding: 0.75rem 1rem;
  background: rgb(255 255 255 / 92%);
  box-shadow: 0 0.75rem 2rem rgb(16 42 66 / 14%);
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 1rem;
  font-weight: 700;
  white-space: nowrap;
  backdrop-filter: blur(8px);

  ${mobile} {
    display: none;
  }
`

export const ChipDot = styled.span<{ $tone: Tone }>`
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
  background: ${({ $tone }) => tones[$tone].strong};
`

export const Story = styled.section<{ $reverse?: boolean }>`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 5rem;
  padding: 10rem max(1rem, calc((100% - 72rem) / 2)) 6rem;

  ${({ $reverse }) =>
    $reverse &&
    css`
      > :first-child {
        order: 2;
      }
    `}

  ${mobile} {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    padding-block: 6rem 3rem;

    > :first-child {
      order: 0;
    }
  }
`

export const StoryText = styled.div`
  max-width: 32rem;
`

export const StepLabel = styled.p`
  display: inline-block;
  margin: 0 0 1.25rem;
  border-radius: 999px;
  padding: 0.25rem 0.875rem;
  background: ${({ theme }) => theme.colors.background.info};
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: 1rem;
  font-weight: 800;
`

export const StoryTitle = styled.h2`
  margin: 0 0 1.5rem;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: clamp(2rem, 4.5vw, 3.25rem);
  font-weight: 800;
  line-height: 1.25;
  letter-spacing: -0.03em;
`

export const StoryBody = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 1.25rem;
  line-height: 1.75;
`

export const Backdrop = styled.div<{ $tone: Tone }>`
  border-radius: 2.5rem;
  padding: 3.5rem 2rem 0;
  overflow: hidden;
  background: ${({ $tone }) => tones[$tone].soft};

  > div {
    margin-bottom: -6rem;
  }

  ${mobile} {
    border-radius: 1.75rem;
    padding: 2.5rem 1.25rem 0;

    > div {
      margin-bottom: -4rem;
    }
  }
`

export const Phone = styled.div<{ $drawn?: boolean }>`
  ${phoneFrame};

  ${({ $drawn, theme }) =>
    $drawn &&
    css`
      min-height: 34rem;
      padding: 2.75rem 1.25rem 1.5rem;
      background: ${theme.colors.background.soft};
      color: ${theme.colors.text.default};
      text-align: left;
    `}
`

export const MockTitle = styled.p`
  margin: 0 0 1.5rem;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 1.5rem;
  font-weight: 800;
`

export const MockLabel = styled.p`
  margin: 1.5rem 0 0.625rem;
  color: ${({ theme }) => theme.colors.text.strong};
  font-weight: 700;
`

export const MockCard = styled.div`
  display: grid;
  gap: 0.75rem;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 1.25rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background.default};
  text-align: center;

  strong {
    color: ${({ theme }) => theme.colors.text.strong};
  }
`

export const MockMap = styled.div`
  position: relative;
  height: 8rem;
  border-radius: 0.875rem;
  background:
    linear-gradient(90deg, rgb(26 110 191 / 8%) 1px, transparent 1px) 0 0 / 1.5rem 1.5rem,
    linear-gradient(rgb(26 110 191 / 8%) 1px, transparent 1px) 0 0 / 1.5rem 1.5rem,
    #e8f2ff;

  span {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 1.25rem;
    height: 1.25rem;
    border: 0.25rem solid #fff;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.brand.primary};
    box-shadow: 0 0 0 0.625rem rgb(26 110 191 / 18%);
    transform: translate(-50%, -50%);
  }
`

export const MockButton = styled.span`
  display: block;
  border-radius: 0.875rem;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  font-weight: 700;
`

export const MockRow = styled.div`
  display: grid;
  border-radius: 1.25rem;
  padding: 1rem 1.25rem;
  background: ${({ theme }) => theme.colors.background.default};

  strong {
    color: ${({ theme }) => theme.colors.text.strong};
  }

  span {
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: 0.9375rem;
  }
`

export const Care = styled.section`
  margin-top: 6rem;
  padding: 9rem max(1rem, calc((100% - 72rem) / 2));
  background:
    radial-gradient(50rem 25rem at 85% 0%, rgb(26 110 191 / 35%), transparent 70%),
    ${navy};
  color: #fff;

  ${mobile} {
    margin-top: 4rem;
    padding-block: 5.5rem;
  }
`

export const CareTitle = styled.h2`
  margin: 0 0 3.5rem;
  font-size: clamp(2.25rem, 5.5vw, 4rem);
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.035em;
`

export const CareList = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.25rem;
  margin: 0;
  padding: 0;
  list-style: none;

  > li {
    border: 0.0625rem solid rgb(255 255 255 / 10%);
    border-radius: 1.75rem;
    padding: 2rem;
    background: rgb(255 255 255 / 5%);
  }

  h3 {
    margin: 1.25rem 0 0.625rem;
    font-size: clamp(1.375rem, 2.6vw, 1.75rem);
    font-weight: 800;
  }

  p {
    margin: 0;
    color: rgb(255 255 255 / 72%);
    font-size: 1.125rem;
  }

  ${mobile} {
    grid-template-columns: 1fr;

    > li {
      padding: 1.5rem;
    }
  }
`

export const CareIcon = styled.span`
  display: inline-grid;
  width: 3.25rem;
  height: 3.25rem;
  place-items: center;
  border-radius: 1rem;
  background: rgb(255 255 255 / 12%);
  color: #9cc8ff;
`

export const Trust = styled.section`
  width: min(100% - 2rem, 72rem);
  margin: 0 auto;
  padding-block: 8rem 2rem;
  text-align: center;

  ${mobile} {
    padding-block: 5rem 1rem;
  }
`

export const TrustTitle = styled.h2`
  margin: 0 0 2.5rem;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  font-weight: 800;
  letter-spacing: -0.03em;
`

export const TrustList = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  margin: 0;
  padding: 0;
  list-style: none;
  text-align: left;

  > li {
    border: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
    border-radius: 1.5rem;
    padding: 1.75rem;
    background: ${({ theme }) => theme.colors.background.soft};
  }

  h3 {
    margin: 1rem 0 0.5rem;
    color: ${({ theme }) => theme.colors.text.strong};
    font-size: 1.25rem;
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: 1.0625rem;
  }

  ${mobile} {
    grid-template-columns: 1fr;
  }
`

export const TrustIcon = styled.span`
  display: inline-grid;
  width: 2.75rem;
  height: 2.75rem;
  place-items: center;
  border-radius: 0.875rem;
  background: ${({ theme }) => theme.colors.background.info};
  color: ${({ theme }) => theme.colors.brand.primary};
`

export const TrustLink = styled(Link)`
  display: inline-block;
  margin-top: 2rem;
  color: ${({ theme }) => theme.colors.brand.primary};
  font-weight: 700;
`

export const Closing = styled.section`
  display: flex;
  width: min(100% - 2rem, 72rem);
  margin: 6rem auto;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
  border-radius: 2.5rem;
  padding: 6rem 1.5rem;
  background: linear-gradient(135deg, #1a6ebf 0%, #0d4a84 100%);
  color: #fff;
  text-align: center;

  ${mobile} {
    margin-block: 4rem;
    border-radius: 1.75rem;
    padding-block: 4rem;
  }
`

export const ClosingTitle = styled.h2`
  margin: 0;
  font-size: clamp(2.25rem, 6vw, 4rem);
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.035em;
`

export const Footer = styled.footer`
  display: flex;
  width: min(100% - 2rem, 72rem);
  margin: 0 auto;
  justify-content: space-between;
  gap: 1rem;
  border-top: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  padding-block: 1.5rem 2.5rem;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 1rem;

  a {
    color: inherit;
  }
`
