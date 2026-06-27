import styled from 'styled-components'

export const Page = styled.main`
  display: flex;
  min-height: 100vh;
  align-items: flex-start;
  justify-content: center;
  padding: clamp(7rem, 31.8vh, 19.5625rem) 1rem 3rem;
  background: ${({ theme }) => theme.colors.background.default};

  @media (max-height: 50rem) {
    align-items: center;
    padding-block: 3rem;
  }

  @media (max-width: 40rem) {
    align-items: center;
    padding-block: 2rem;
  }
`
