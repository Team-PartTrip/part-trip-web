import styled from 'styled-components'

export const Page = styled.main`
  width: 100%;
  min-width: 0;
  color: ${({ theme }) => theme.colors.text.strong};
`

export const Header = styled.header`
  margin-bottom: 24px;
`

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 32px;
  line-height: 40px;
`

export const Subtitle = styled.p`
  margin: 6px 0 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 15px;
  line-height: 22px;
`

export const Empty = styled.div`
  display: flex;
  min-height: 240px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
  strong { color: ${({ theme }) => theme.colors.text.strong}; }
  button { min-height: 36px; border: 1px solid ${({ theme }) => theme.colors.brand.strong}; border-radius: 10px; padding: 0 14px; background: ${({ theme }) => theme.colors.background.default}; color: ${({ theme }) => theme.colors.brand.strong}; cursor: pointer; font-size: 12px; font-weight: 600; }
`

export const ReportStats = styled.section`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-bottom: 24px;
`

export const Stat = styled.article`
  display: flex;
  min-height: 140px;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  border-radius: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  small, span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 11px; }
  strong { color: ${({ theme }) => theme.colors.brand.strong}; font-size: 28px; line-height: 32px; }
`

export const ReportPhotos = styled.section`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  @media (max-width: 760px) { grid-template-columns: 1fr; }
`

export const ReportPhoto = styled.article`
  overflow: hidden;
  min-height: 340px;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  img { display: block; width: 100%; height: 188px; object-fit: cover; }
  strong, span { display: block; padding-inline: 24px; }
  strong { padding-top: 18px; color: ${({ theme }) => theme.colors.text.strong}; font-size: 15px; }
  span { padding-top: 4px; color: ${({ theme }) => theme.colors.text.muted}; font-size: 12px; }
`
