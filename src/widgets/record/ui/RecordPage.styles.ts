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

export const Empty = styled.div`
  display: flex;
  min-height: 240px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
  strong { color: ${({ theme }) => theme.colors.text.strong}; }
`

export const TimelineCard = styled.section`
  min-height: 620px;
  border-radius: 28px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`

export const TimelineHeading = styled.h2`
  margin: 0 0 16px;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 15px;
  line-height: 20px;
`

export const TimelineItems = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-left: 16px;
  &::before { position: absolute; top: 12px; bottom: 12px; left: 4px; width: 1px; background: ${({ theme }) => theme.colors.border.soft}; content: ''; }
`

export const TimelineItem = styled.article`
  position: relative;
  display: flex;
  min-height: 116px;
  align-items: center;
  gap: 16px;
  padding-left: 18px;
  img { width: 160px; height: 84px; flex: 0 0 160px; border-radius: 12px; object-fit: cover; }
  @media (max-width: 640px) { align-items: flex-start; flex-wrap: wrap; img { width: 120px; height: 84px; flex-basis: 120px; } }
`

export const Dot = styled.span`
  position: absolute;
  top: 50%;
  left: -16px;
  width: 10px;
  height: 10px;
  border: 2px solid ${({ theme }) => theme.colors.background.default};
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.brand.primary};
  box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.brand.primary};
  transform: translateY(-50%);
`

export const TimelineCopy = styled.div`
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 4px;
  small { color: ${({ theme }) => theme.colors.brand.primary}; font-size: 11px; font-weight: 600; }
  strong { color: ${({ theme }) => theme.colors.text.strong}; font-size: 15px; }
  span { overflow: hidden; color: ${({ theme }) => theme.colors.text.muted}; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }
`

export const ViewButton = styled.button`
  min-height: 36px;
  border: 1px solid ${({ theme }) => theme.colors.brand.strong};
  border-radius: 10px;
  padding: 0 12px;
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.brand.strong};
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  &:disabled { cursor: not-allowed; opacity: .5; }
`

export const FooterActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
  button { min-height: 36px; border: 1px solid ${({ theme }) => theme.colors.brand.strong}; border-radius: 10px; padding: 0 14px; background: ${({ theme }) => theme.colors.background.default}; color: ${({ theme }) => theme.colors.brand.strong}; cursor: pointer; font-size: 12px; font-weight: 600; }
`
