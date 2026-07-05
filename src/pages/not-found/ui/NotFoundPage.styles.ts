import styled from 'styled-components'

export const Page = styled.main`
  display: grid; min-height: 100vh; align-content: center; justify-items: center; padding: 2rem; background: #f4f8fc; text-align: center;
  h1 { margin: 1rem 0 0.5rem; color: ${({ theme }) => theme.colors.text.strong}; }
  p { margin: 0 0 1.5rem; color: ${({ theme }) => theme.colors.text.muted}; }
  a { border-radius: ${({ theme }) => theme.radii.button}; padding: 0.875rem 1.25rem; background: ${({ theme }) => theme.colors.brand.primary}; color: white; font-weight: 700; text-decoration: none; }
`
export const Code = styled.strong`color: ${({ theme }) => theme.colors.brand.primary}; font-size: clamp(4rem, 18vw, 8rem); line-height: 1;`
