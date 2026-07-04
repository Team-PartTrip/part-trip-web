import styled from 'styled-components'

export const Page = styled.main`
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #f4f8fc;
  @media (max-width: 47.9375rem) { flex-direction: column; }
`

export const Logo = styled.div`
  img { display: block; width: 11.3125rem; max-width: 100%; height: auto; }
`
