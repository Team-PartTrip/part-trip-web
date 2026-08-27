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

export const ReadAll = styled.button`
  margin-left: auto;
  border: 0;
  border-radius: 8px;
  padding: 8px 12px;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.brand.strong};
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  &:disabled { cursor: not-allowed; opacity: .5; }
`

export const List = styled.section`
  margin-top: 24px;
  border-radius: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
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
  grid-template-columns: 10px minmax(0, 1fr) auto;
  border: 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle};
  padding: 14px 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.strong};
  cursor: pointer;
  text-align: left;
  &:last-child { border-bottom: 0; }
  opacity: ${({ $read }) => ($read ? .62 : 1)};
  > small { color: ${({ theme }) => theme.colors.text.muted}; font-size: 10px; white-space: nowrap; }
`

export const StatusDot = styled.span<{ $read?: boolean }>`
  width: 10px;
  height: 10px;
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
