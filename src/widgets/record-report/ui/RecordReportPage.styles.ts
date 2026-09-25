import styled from 'styled-components'

export const Page = styled.main`
  width: 100%;
  min-width: 0;
  color: ${({ theme }) => theme.colors.text.strong};
`

export const Header = styled.header`
  margin-bottom: 1.5rem;
`

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 2rem;
  line-height: 2.5rem;
`

export const Subtitle = styled.p`
  margin: 0.375rem 0 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.9375rem;
  line-height: 1.375rem;
`

export const Empty = styled.div`
  display: flex;
  min-height: 15rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  border-radius: 1.25rem;
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
  strong { color: ${({ theme }) => theme.colors.text.strong}; }
  button { min-height: 2.25rem; border: 0.0625rem solid ${({ theme }) => theme.colors.brand.strong}; border-radius: 0.625rem; padding: 0 0.875rem; background: ${({ theme }) => theme.colors.background.default}; color: ${({ theme }) => theme.colors.brand.strong}; cursor: pointer; font-size: 0.75rem; font-weight: 600; }
`

export const ReportStats = styled.section`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-bottom: 1.5rem;
`

export const Stat = styled.article`
  display: flex;
  min-height: 8.75rem;
  flex-direction: column;
  justify-content: center;
  gap: 0.375rem;
  border-radius: 1.25rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  small, span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.6875rem; }
  strong { color: ${({ theme }) => theme.colors.brand.strong}; font-size: 1.75rem; line-height: 2rem; }
`

export const ReportPhotos = styled.section`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  @media (max-width: 47.5rem) { grid-template-columns: 1fr; }
`

export const ReportPhoto = styled.article`
  overflow: hidden;
  min-height: 21.25rem;
  border-radius: 1.25rem;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  img { display: block; width: 100%; height: 11.75rem; object-fit: cover; }
  strong, span { display: block; padding-inline: 1.5rem; }
  strong { padding-top: 1.125rem; color: ${({ theme }) => theme.colors.text.strong}; font-size: 0.9375rem; }
  span { padding-top: 0.25rem; color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.75rem; }
`

export const ReportActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
  button, a { min-height: 2.875rem; border: 0; border-radius: 0.625rem; padding: 0 1.5rem; background: ${({ theme }) => theme.colors.brand.primary}; color: ${({ theme }) => theme.colors.text.inverse}; cursor: pointer; font-weight: 600; display: inline-flex; align-items: center; text-decoration: none; }
  span { color: ${({ theme }) => theme.colors.status.error}; font-size: 0.75rem; }
  button:disabled { cursor: not-allowed; opacity: .6; }
`
