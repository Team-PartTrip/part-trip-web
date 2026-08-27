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

export const State = styled.p`
  padding: 64px 0;
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
`

export const MapBody = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(0, 1fr) 360px;
  @media (max-width: 860px) { grid-template-columns: 1fr; }
`

export const MapCard = styled.section`
  position: relative;
  min-height: 580px;
  border-radius: 28px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.muted};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  img { display: block; width: 100%; height: 420px; margin-top: 32px; object-fit: contain; }
  @media (max-width: 560px) { min-height: 360px; padding: 16px; img { height: 260px; } }
`

export const SectionTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 15px;
  line-height: 20px;
`

export const MapLegend = styled.div`
  position: absolute;
  bottom: 24px;
  left: 24px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-width: 150px;
  border-radius: 8px;
  padding: 8px 12px;
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 11px;
  span { width: 8px; height: 8px; border-radius: 50%; background: ${({ theme }) => theme.colors.brand.primary}; }
`

export const CountryStats = styled.aside`
  display: flex;
  min-height: 580px;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  border-radius: 28px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  h2 { margin: 0; color: ${({ theme }) => theme.colors.text.strong}; font-size: 24px; }
  > strong { color: ${({ theme }) => theme.colors.brand.strong}; font-size: 32px; }
  p, > span { margin: 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 12px; line-height: 18px; }
  button { margin-top: auto; }
  @media (max-width: 860px) { min-height: 280px; }
`

export const Badge = styled.span`
  border-radius: 999px;
  padding: 5px 8px;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 11px;
`

export const CountryRecordsLayout = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: 360px minmax(0, 1fr);
  @media (max-width: 860px) { grid-template-columns: 1fr; }
`

export const CountryList = styled.section`
  min-height: 460px;
  border-radius: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`

export const CountryRow = styled.button<{ $active: boolean }>`
  display: block;
  width: 100%;
  min-height: 44px;
  border: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 8px;
  padding: 0 12px;
  background: ${({ $active, theme }) => ($active ? theme.colors.background.muted : 'transparent')};
  color: ${({ theme }) => theme.colors.text.strong};
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
  text-align: left;
`

export const CountryPhotos = styled.section`
  display: grid;
  align-content: start;
  gap: 24px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`

export const CountryPhoto = styled.button`
  overflow: hidden;
  min-height: 230px;
  border: 0;
  border-radius: 20px;
  padding: 0 0 16px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  color: ${({ theme }) => theme.colors.text.strong};
  cursor: pointer;
  text-align: left;
  img { display: block; width: 100%; height: 128px; object-fit: cover; }
  strong, span { display: block; padding-inline: 16px; }
  strong { padding-top: 14px; font-size: 15px; }
  span { padding-top: 4px; color: ${({ theme }) => theme.colors.text.muted}; font-size: 11px; }
`

export const AchievementStats = styled.section`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-bottom: 16px;
  @media (max-width: 760px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
`

export const AchievementStat = styled.article`
  display: flex;
  min-height: 120px;
  flex-direction: column;
  justify-content: center;
  gap: 5px;
  border-radius: 16px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  small, span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 11px; }
  strong { color: ${({ theme }) => theme.colors.brand.strong}; font-size: 22px; }
`

export const AchievementMap = styled.section`
  min-height: 470px;
  border-radius: 28px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.muted};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  img { display: block; width: 100%; height: 390px; margin-top: 24px; object-fit: contain; }
`

export const Empty = styled.div`
  display: grid;
  min-height: 180px;
  place-items: center;
  grid-column: 1 / -1;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 13px;
  text-align: center;
`
