import styled from 'styled-components'

export const Page = styled.main`
  position: relative;
  display: flex;
  width: 100%;
  min-height: 100vh;
  background: #f4f8fc;
  @media (max-width: 47.9375rem) { flex-direction: column; }
`

export const Backdrop = styled.div`
  position: absolute;
  z-index: 10;
  inset: 0;
  background: rgb(0 0 0 / 20%);
`

export const Logo = styled.div`
  img { display: block; width: 11.3125rem; max-width: 100%; height: auto; }
`

export const Content = styled.section`
  min-width: 0;
  flex: 1;
  padding: 52px 58px;
`

export const State = styled.div`
  display: grid;
  gap: 1rem;
  justify-items: center;
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;

  button { border: 0; border-radius: ${({ theme }) => theme.radii.button}; padding: 0.75rem 1rem; background: ${({ theme }) => theme.colors.brand.primary}; color: white; cursor: pointer; }
`
