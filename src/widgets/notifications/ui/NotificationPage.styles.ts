import styled from 'styled-components'
import { Skeleton } from '@/shared/ui/parttrip'

export const Page = styled.main`
  width: 100%;
  min-width: 0;
  color: ${({ theme }) => theme.colors.text.strong};
`

export const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
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

export const ReadAll = styled.button`
  width: 112px;
  height: 48px;
  border: 0;
  border-radius: 14px;
  padding: 0 14px;
  background: ${({ theme }) => theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  &:disabled { cursor: not-allowed; opacity: .5; }
`

export const List = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
  padding: 0;
`

export const LoadingList = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 24px;
`

export const LoadingRow = styled(Skeleton)`
  height: 72px;
  border-radius: 14px;
`

export const NotificationTabs = styled.nav`
  display: flex;
  gap: 28px;
  button {
    min-width: 88px;
    height: 36px;
    border: 0;
    border-radius: 12px;
    padding: 0 16px;
    background: ${({ theme }) => theme.colors.background.muted};
    color: ${({ theme }) => theme.colors.brand.primary};
    cursor: pointer;
    font-size: 11px;
    font-weight: 600;
  }
  button.active {
    background: ${({ theme }) => theme.colors.brand.primary};
    color: ${({ theme }) => theme.colors.text.inverse};
  }
`

export const SectionLabel = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 15px;
  line-height: 18px;
`

export const Empty = styled.div`
  display: flex;
  min-height: 300px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
  strong { color: ${({ theme }) => theme.colors.text.strong}; font-size: 13px; }
  span { font-size: 12px; }
`

export const NotificationItem = styled.button<{ $read: boolean }>`
  display: grid;
  width: 100%;
  min-height: 72px;
  align-items: center;
  gap: 12px;
  grid-template-columns: 8px minmax(0, 1fr) auto;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 14px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  color: ${({ theme }) => theme.colors.text.strong};
  cursor: pointer;
  text-align: left;
  opacity: ${({ $read }) => ($read ? .62 : 1)};
`

export const StatusDot = styled.span<{ $read?: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $read, theme }) => ($read ? theme.colors.border.subtle : theme.colors.brand.primary)};
`

export const NotificationCopy = styled.span`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 4px;
  strong { overflow: hidden; font-size: 13px; text-overflow: ellipsis; white-space: nowrap; }
  span { overflow: hidden; color: ${({ theme }) => theme.colors.text.muted}; font-size: 11px; text-overflow: ellipsis; white-space: nowrap; }
`

export const NotificationCategory = styled.span`
  width: 92px;
  height: 36px;
  box-sizing: border-box;
  border-radius: 12px;
  padding: 10px;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: 10px;
  font-weight: 600;
  text-align: center;
`

export const ErrorMessage = styled.p`
  margin: 0 0 16px;
  color: ${({ theme }) => theme.colors.status.error};
  font-size: 13px;
`

export const Detail = styled.section`
  min-height: 320px;
  border-radius: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  h2 { margin: 0 0 12px; color: ${({ theme }) => theme.colors.text.strong}; font-size: 18px; }
  > p { margin: 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 13px; line-height: 20px; }
`

export const LoadingDetail = styled(Skeleton)`
  width: min(100%, 860px);
  height: 560px;
  border-radius: 16px;
`

export const Feedback = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 16px;
  border-radius: 12px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 12px;
`

export const ActionRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`

export const SettingsCard = styled.section`
  border-radius: 20px;
  padding: 8px 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`

export const LoadingSettings = styled(Skeleton)`
  width: 100%;
  height: 360px;
  border-radius: 16px;
`

export const SettingRow = styled.div`
  display: flex;
  min-height: 77px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle};
  &:last-child { border-bottom: 0; }
  > div { display: flex; flex-direction: column; gap: 4px; }
  strong { color: ${({ theme }) => theme.colors.text.strong}; font-size: 13px; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 11px; }
`

export const Toggle = styled.button<{ $active: boolean }>`
  position: relative;
  width: 52px;
  height: 30px;
  flex: 0 0 52px;
  border: 0;
  border-radius: 999px;
  padding: 0;
  background: ${({ $active, theme }) => ($active ? theme.colors.brand.primary : theme.colors.border.default)};
  cursor: pointer;
  &::after { position: absolute; top: 4px; left: ${({ $active }) => ($active ? '26px' : '4px')}; width: 22px; height: 22px; border-radius: 50%; background: ${({ theme }) => theme.colors.background.default}; content: ''; transition: left 120ms ease; }
  &:disabled { cursor: not-allowed; opacity: .6; }
`
