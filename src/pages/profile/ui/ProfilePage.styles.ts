import styled from 'styled-components'

export const Page = styled.main`
  position: relative;
  display: flex;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
  background: #f4f8fc;

  @media (max-width: 58rem) {
    height: auto;
    min-height: 100dvh;
    overflow: visible;
  }

  @media (max-width: 47.9375rem) { flex-direction: column; }
`

export const Backdrop = styled.div`
  position: fixed;
  z-index: 1000;
  inset: 0;
  background: rgb(15 23 42 / 48%);
`

export const Logo = styled.div`
  img { display: block; width: 11.3125rem; max-width: 100%; height: auto; }
`

export const Content = styled.section`
  display: flex;
  height: 100%;
  min-width: 0;
  flex: 1;
  justify-content: center;
  padding: clamp(20px, 5.3vh, 52px) clamp(24px, 3.8vw, 58px);

  @media (max-width: 58rem) {
    height: auto;
    padding: 28px 24px 48px;
  }
`

export const State = styled.div`
  display: grid;
  gap: 1rem;
  justify-items: center;
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;

  button { border: 0; border-radius: ${({ theme }) => theme.radii.button}; padding: 0.75rem 1rem; background: ${({ theme }) => theme.colors.brand.primary}; color: white; cursor: pointer; }
`
