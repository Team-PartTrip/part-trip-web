import styled from 'styled-components'

export const Page = styled.main`display: flex; min-height: 100vh; background: #f4f8fc; @media (max-width: 47.9375rem) { flex-direction: column; }`
export const Logo = styled.div`img { display: block; width: 11.3125rem; max-width: 100%; height: auto; }`
export const Content = styled.section`min-width: 0; flex: 1; padding: clamp(2rem, 6vw, 5rem);`
export const Header = styled.header`
  max-width: 42rem;
  span { color: ${({ theme }) => theme.colors.brand.strong}; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.12em; }
  h1 { margin: 0.5rem 0; color: ${({ theme }) => theme.colors.text.strong}; font-size: clamp(2rem, 6vw, 3.5rem); }
  p { margin: 0; color: ${({ theme }) => theme.colors.text.muted}; line-height: 1.7; }
`
export const Grid = styled.div`
  display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 1rem; margin-top: 3rem;
  @media (max-width: 60rem) { grid-template-columns: 1fr; }
`
export const Card = styled.article`
  min-height: 12rem; border-radius: 1.5rem; padding: 1.5rem; background: white; box-shadow: 0 0.75rem 2rem rgb(13 31 64 / 7%);
  strong { color: ${({ theme }) => theme.colors.brand.primary}; font-size: 0.8rem; }
  p { margin: 2rem 0 0.5rem; color: ${({ theme }) => theme.colors.text.strong}; font-size: 1.1rem; font-weight: 700; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.75rem; }
`
export const HomeButton = styled.button`
  margin-top: 2rem; border: 0; border-radius: ${({ theme }) => theme.radii.button}; padding: 0.875rem 1.25rem; background: ${({ theme }) => theme.colors.brand.primary}; color: white; cursor: pointer; font: inherit; font-weight: 700;
`
