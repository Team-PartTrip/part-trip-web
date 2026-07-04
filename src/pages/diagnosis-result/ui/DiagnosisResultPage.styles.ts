import styled, { keyframes } from 'styled-components'

const pulse = keyframes`
  0%, 100% { transform: scale(0.8); opacity: 0.45; }
  50% { transform: scale(1); opacity: 1; }
`

export const Page = styled.main`
  display: grid;
  min-height: 100vh;
  place-items: center;
  padding: 2rem 1rem;
  background: linear-gradient(145deg, #eef5ff 0%, #ffffff 55%, #edf9f7 100%);
`

export const Card = styled.section`
  width: min(36rem, 100%);
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 2rem;
  padding: clamp(2rem, 6vw, 4rem);
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: 0 1.5rem 4rem rgb(13 31 64 / 12%);
  text-align: center;
`

export const Eyebrow = styled.p`
  margin: 0 0 1rem;
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 0.875rem;
  font-weight: 800;
  letter-spacing: 0.08em;
`

export const Badge = styled.div`
  display: grid;
  width: 4.5rem;
  height: 4.5rem;
  margin: 0 auto 1.25rem;
  border-radius: 1.5rem;
  place-items: center;
  background: #edf4ff;
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: 2rem;
`

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: clamp(1.75rem, 6vw, 2.75rem);
`

export const Description = styled.p`
  margin: 1rem auto 0;
  color: ${({ theme }) => theme.colors.text.muted};
  line-height: 1.7;
`

export const HighlightList = styled.ul`
  display: grid;
  gap: 0.75rem;
  margin: 2rem 0;
  padding: 0;
  list-style: none;

  li {
    border-radius: 0.875rem;
    padding: 0.875rem 1rem;
    background: ${({ theme }) => theme.colors.background.muted};
    color: ${({ theme }) => theme.colors.text.strong};
  }
`

export const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0.75rem;

  @media (max-width: 32rem) {
    grid-template-columns: 1fr;
  }
`

const Button = styled.button`
  min-height: 3.125rem;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.button};
  cursor: pointer;
  font: inherit;
  font-weight: 700;
`

export const PrimaryButton = styled(Button)`
  background: ${({ theme }) => theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
`

export const SecondaryButton = styled(Button)`
  background: ${({ theme }) => theme.colors.background.subtle};
  color: ${({ theme }) => theme.colors.text.strong};
`

export const LoadingDot = styled.span`
  display: block;
  width: 2rem;
  height: 2rem;
  margin: 0 auto 1rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.brand.primary};
  animation: ${pulse} 900ms ease-in-out infinite;
`
