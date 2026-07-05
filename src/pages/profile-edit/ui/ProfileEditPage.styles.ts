import styled from 'styled-components'

export const Page = styled.main`
  display: flex;
  width: 100%;
  min-height: 100vh;
  background: #f4f8fc;
  @media (max-width: 47.9375rem) { flex-direction: column; }
`

export const Logo = styled.div`
  img { display: block; width: 11.3125rem; max-width: 100%; height: auto; }
`

export const Content = styled.section`
  display: grid;
  min-width: 0;
  flex: 1;
  place-items: center;
  padding: clamp(1rem, 5vw, 4rem);
`

export const State = styled.p`
  color: ${({ theme }) => theme.colors.text.muted};
`
