import styled from 'styled-components'
import { Skeleton } from '@/shared/ui/parttrip'

export const Page = styled.main`
  width: 100%;
  min-width: 0;
  padding: 2rem;
  box-sizing: border-box;
  color: ${({ theme }) => theme.colors.text.strong};

  @media (max-width: 47.9375rem) {
    padding: 0;
  }
`

export const Header = styled.header`
  display: flex;
  min-height: 3rem;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
`

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 1.875rem;
  line-height: 2.375rem;
`

export const Subtitle = styled.p`
  margin: 0.375rem 0 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.9375rem;
  line-height: 1.375rem;
`

export const ReadAll = styled.button`
  width: 7rem;
  height: 3rem;
  border: 0;
  border-radius: 0.875rem;
  padding: 0 0.875rem;
  background: ${({ theme }) => theme.colors.brand.primary};
  box-shadow: 0 0.25rem 0.3125rem rgb(26 110 191 / 18%);
  color: ${({ theme }) => theme.colors.text.inverse};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  &:disabled { cursor: not-allowed; opacity: .5; }
`

export const List = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding: 0;
  > div { display: flex; flex-direction: column; gap: 0.75rem; }
`

export const LoadingList = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1.5rem;
`

export const LoadingRow = styled(Skeleton)`
  height: 4.5rem;
  border-radius: 0.875rem;
`

export const NotificationTabs = styled.nav`
  display: flex;
  min-height: 2.75rem;
  align-items: flex-start;
  gap: 1.75rem;
  button {
    min-width: 5.5rem;
    height: 2.25rem;
    border: 0;
    border-radius: 0.75rem;
    padding: 0 1rem;
    background: ${({ theme }) => theme.colors.background.muted};
    color: ${({ theme }) => theme.colors.brand.primary};
    cursor: pointer;
    font-size: 0.6875rem;
    font-weight: 600;
  }
  button.active {
    background: ${({ theme }) => theme.colors.brand.primary};
    color: ${({ theme }) => theme.colors.text.inverse};
    box-shadow: 0 0.25rem 0.3125rem rgb(26 110 191 / 16%);
  }

  @media (max-width: 47.9375rem) {
    display: grid;
    gap: 0.5rem;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    button {
      width: 100%;
      min-width: 0;
      height: 3rem;
      padding: 0 0.375rem;
      font-size: 0.875rem;
    }
  }
`

export const SectionLabel = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 0.9375rem;
  line-height: 1.125rem;
`

export const Empty = styled.div`
  display: flex;
  min-height: 18.75rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
  strong { color: ${({ theme }) => theme.colors.text.strong}; font-size: 0.8125rem; }
  span { font-size: 0.75rem; }
`

export const NotificationItem = styled.button<{ $read: boolean }>`
  display: grid;
  width: 100%;
  min-height: 4.5rem;
  align-items: center;
  gap: 0.75rem;
  grid-template-columns: 0.625rem minmax(0, 1fr) auto;
  border: 0.0625rem solid ${({ $read, theme }) => ($read ? theme.colors.border.subtle : theme.colors.border.interactive)};
  border-radius: 0.875rem;
  padding: 1rem;
  background: ${({ $read, theme }) => ($read ? theme.colors.background.soft : theme.colors.background.default)};
  box-shadow: ${({ $read, theme }) => ($read ? 'none' : theme.shadows.subtle)};
  color: ${({ $read, theme }) => ($read ? theme.colors.text.muted : theme.colors.text.strong)};
  cursor: pointer;
  text-align: left;
`

export const StatusDot = styled.span<{ $read?: boolean }>`
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 50%;
  background: ${({ $read, theme }) => ($read ? theme.colors.border.default : theme.colors.brand.primary)};
`

export const NotificationCopy = styled.span<{ $read?: boolean }>`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.25rem;
  strong { overflow: hidden; font-size: 0.875rem; font-weight: ${({ $read }) => ($read ? 400 : 600)}; text-overflow: ellipsis; white-space: nowrap; }
  span { overflow: hidden; color: ${({ $read, theme }) => ($read ? theme.colors.text.placeholder : theme.colors.brand.primary)}; font-size: 0.75rem; text-overflow: ellipsis; white-space: nowrap; }
`

export const NotificationCategory = styled.span<{ $tone: 'primary' | 'accent' | 'success' }>`
  width: 5.75rem;
  height: 2.25rem;
  box-sizing: border-box;
  border-radius: 0.75rem;
  padding: 0.625rem;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ $tone, theme }) => $tone === 'accent' ? theme.colors.brand.accent : $tone === 'success' ? theme.colors.brand.success : theme.colors.brand.primary};
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
`

export const ErrorMessage = styled.p`
  margin: 0 0 1rem;
  color: ${({ theme }) => theme.colors.status.error};
  font-size: 0.8125rem;
`

export const LoadMore = styled.button`
  align-self: center;
  min-width: 8.75rem;
  height: 2.5rem;
  margin: 0.75rem 0 1.5rem;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 0.75rem;
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.brand.primary};
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 600;
  &:disabled { cursor: not-allowed; opacity: .55; }
`

export const Detail = styled.section`
  width: min(100%, 53.75rem);
  min-height: 0;
  box-sizing: border-box;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 1rem;
  padding: 2rem;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  display: flex;
  flex-direction: column;
  gap: 1rem;
  h2 { margin: 0; color: ${({ theme }) => theme.colors.text.strong}; font-size: 1.5rem; line-height: 1.8125rem; }
  > p:first-of-type { margin: 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.9375rem; line-height: 1.5rem; }
  > div:last-child { margin-top: 0; }
  > div:last-child > button { width: 10.625rem; height: 3rem; }
`

export const DetailCategory = styled.span<{ $tone: 'primary' | 'accent' | 'success' }>`
  display: inline-flex;
  width: 5rem;
  height: 2.125rem;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border-radius: 62.4375rem;
  padding: 0.625rem;
  background: ${({ $tone, theme }) => $tone === 'accent' ? theme.colors.brand.accent : $tone === 'success' ? theme.colors.brand.success : theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  font-size: 0.75rem;
  font-weight: 600;
`

export const DetailMeta = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.75rem;
  line-height: 0.9375rem;
`

export const ReadState = styled.div`
  display: flex;
  width: 100%;
  height: 2.75rem;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border-radius: 0.75rem;
  padding: 0.75rem;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.brand.primary};
  font-size: 0.8125rem;
  font-weight: 600;
`

export const LoadingDetail = styled(Skeleton)`
  width: min(100%, 53.75rem);
  height: 22.5rem;
  border-radius: 1rem;
`

export const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0;
`

export const SettingsCard = styled.section`
  border-radius: 1.25rem;
  padding: 0.5rem 1.5rem;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`

export const SettingRow = styled.div`
  display: flex;
  min-height: 4.8125rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  &:last-child { border-bottom: 0; }
  > div { display: flex; flex-direction: column; gap: 0.25rem; }
  strong { color: ${({ theme }) => theme.colors.text.strong}; font-size: 0.8125rem; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.6875rem; }
`

export const SettingsNote = styled.p`
  margin: 0.5rem 0 0.75rem;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.75rem;
  line-height: 1.125rem;
`
