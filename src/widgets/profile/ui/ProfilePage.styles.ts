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

export const ProfileBody = styled.section`
  display: grid;
  gap: 24px;
  grid-template-columns: 420px minmax(0, 1fr);
  min-height: 240px;
  @media (max-width: 860px) { grid-template-columns: 1fr; }
`

export const ProfileCard = styled.article`
  display: flex;
  min-height: 240px;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
  border-radius: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  h2 { margin: 0; color: ${({ theme }) => theme.colors.text.strong}; font-size: 18px; }
  p { margin: 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 13px; }
`

export const Avatar = styled.div`
  display: grid;
  width: 32px;
  height: 32px;
  place-items: center;
  overflow: hidden;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 11px;
  font-weight: 600;
  img { display: block; width: 100%; height: 100%; object-fit: cover; }
`

export const StatsCard = styled.section`
  min-height: 240px;
  border-radius: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`

export const SectionTitle = styled.h2`
  margin: 0 0 16px;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 15px;
  line-height: 20px;
`

export const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  height: 168px;
  align-items: center;
  > div { display: grid; grid-template-columns: auto auto; grid-template-rows: auto auto; align-content: center; justify-content: center; gap: 6px; border-right: 1px solid ${({ theme }) => theme.colors.border.subtle}; }
  > div:last-child { border-right: 0; }
  small { grid-column: 1 / -1; color: ${({ theme }) => theme.colors.text.muted}; font-size: 11px; }
  span { align-self: end; color: ${({ theme }) => theme.colors.brand.strong}; font-size: 13px; font-weight: 700; }
  strong { color: ${({ theme }) => theme.colors.brand.strong}; font-size: 24px; line-height: 28px; }
`

export const LowerBody = styled.section`
  display: grid;
  gap: 24px;
  grid-template-columns: minmax(0, 1fr) 360px;
  margin-top: 24px;
  @media (max-width: 860px) { grid-template-columns: 1fr; }
`

export const RecentTrips = styled.section`
  min-height: 240px;
  border-radius: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`

export const RecentGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`

export const RecentTrip = styled.button`
  overflow: hidden;
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
  strong { padding-top: 12px; font-size: 15px; }
  span { padding-top: 4px; color: ${({ theme }) => theme.colors.text.muted}; font-size: 12px; }
`

export const SettingsCard = styled.section`
  min-height: 240px;
  border-radius: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`

export const SettingsButton = styled.button<{ $danger?: boolean }>`
  display: flex;
  width: 100%;
  min-height: 36px;
  align-items: center;
  justify-content: space-between;
  border: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle};
  padding: 0;
  background: transparent;
  color: ${({ $danger, theme }) => ($danger ? theme.colors.status.error : theme.colors.text.strong)};
  cursor: pointer;
  font-size: 12px;
  text-align: left;
  &:last-child { border-bottom: 0; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 18px; }
`

export const Empty = styled.div`
  display: grid;
  min-height: 160px;
  place-items: center;
  grid-column: 1 / -1;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 13px;
`
