import styled from 'styled-components'

export const Page = styled.div`
  width: min(100%, 1200px);
  margin: 0 auto;
`

export const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;

  @media (max-width: 560px) { flex-direction: column; }
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
`

export const HeaderActions = styled.div`
  display: flex;
  gap: 8px;
`

export const FilterRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 13px;
  select { min-width: 220px; border: 1px solid ${({ theme }) => theme.colors.border.default}; border-radius: 10px; padding: 10px 12px; background: ${({ theme }) => theme.colors.background.default}; color: ${({ theme }) => theme.colors.text.strong}; }
  @media (max-width: 560px) { align-items: stretch; flex-direction: column; select { width: 100%; } }
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
  strong { color: ${({ theme }) => theme.colors.text.strong}; }
`

export const Timeline = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-left: 20px;

  &::before { position: absolute; top: 12px; bottom: 12px; left: 5px; width: 1px; background: ${({ theme }) => theme.colors.border.soft}; content: ''; }
`

export const TimelineItem = styled.div`
  position: relative;
`

export const Dot = styled.span`
  position: absolute;
  top: 28px;
  left: -20px;
  width: 11px;
  height: 11px;
  border: 2px solid ${({ theme }) => theme.colors.background.default};
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.brand.primary};
  box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.brand.primary};
`

export const RecordCard = styled.article`
  display: flex;
  min-height: 116px;
  align-items: center;
  gap: 16px;
  border-radius: 20px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};

  > img { width: 120px; height: 84px; flex: 0 0 120px; border-radius: 12px; object-fit: cover; }
  @media (max-width: 560px) { align-items: flex-start; > img { width: 88px; height: 72px; flex-basis: 88px; } }
`

export const RecordCopy = styled.div`
  min-width: 0;
  flex: 1;
  small { color: ${({ theme }) => theme.colors.text.muted}; font-size: 12px; }
  h2 { margin: 4px 0; color: ${({ theme }) => theme.colors.text.strong}; font-size: 18px; }
  p { margin: 0; overflow: hidden; color: ${({ theme }) => theme.colors.text.muted}; font-size: 13px; text-overflow: ellipsis; white-space: nowrap; }
`

export const ViewButton = styled.button`
  min-width: 64px;
  min-height: 36px;
  border: 1px solid ${({ theme }) => theme.colors.brand.strong};
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.brand.strong};
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  &:disabled { cursor: not-allowed; opacity: 0.5; }
`

export const PhotoGrid = styled.div`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  button { overflow: hidden; border: 0; border-radius: 12px; padding: 0; background: transparent; cursor: pointer; aspect-ratio: 1; }
  img { display: block; width: 100%; height: 100%; object-fit: cover; }
  @media (max-width: 760px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
`
