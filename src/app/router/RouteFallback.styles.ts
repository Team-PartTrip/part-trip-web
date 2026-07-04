import styled, { keyframes } from 'styled-components'

const spin = keyframes`to { transform: rotate(360deg); }`

export const Page = styled.main`
  display: grid;
  min-height: 100vh;
  align-content: center;
  justify-items: center;
  gap: 1rem;
  background: #f4f8fc;
  color: ${({ theme }) => theme.colors.text.muted};
`

export const Spinner = styled.span`
  width: 2.5rem;
  height: 2.5rem;
  border: 0.25rem solid #dce8fa;
  border-top-color: ${({ theme }) => theme.colors.brand.primary};
  border-radius: 50%;
  animation: ${spin} 700ms linear infinite;
`
