import styled from 'styled-components'

export const Page = styled.main`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  align-items: center;
  padding: 313px 1rem 3rem;
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

export const ErrorMessage = styled.p`
  margin: 1rem 0 0;
  color: ${({ theme }) => theme.colors.status.error};
  font-size: 0.875rem;
`
