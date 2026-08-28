import styled from 'styled-components'
import { Skeleton } from '@/shared/ui/parttrip'

export const Page = styled.main`
  width: 100%;
  min-width: 0;
  color: ${({ theme }) => theme.colors.text.strong};
`

export const Header = styled.header`
  padding-inline: 24px;
  margin-bottom: 20px;
`

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 30px;
  line-height: 38px;
`

export const YearTabs = styled.nav`
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  button {
    width: 88px;
    height: 34px;
    border: 0;
    border-radius: 12px;
    padding: 0 10px;
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

export const State = styled.p`
  padding: 64px 0;
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
`

export const LoadingList = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

export const LoadingRow = styled(Skeleton)`
  height: 126px;
  border-radius: 16px;
`

export const RecordList = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

export const RecordRow = styled.button`
  display: flex;
  min-height: 126px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 16px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  color: ${({ theme }) => theme.colors.text.strong};
  cursor: pointer;
  text-align: left;
  &:hover { border-color: ${({ theme }) => theme.colors.brand.primary}; }
`

export const RecordCopy = styled.span`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
  strong { font-size: 15px; line-height: 20px; }
  span, small { color: ${({ theme }) => theme.colors.text.muted}; font-size: 11px; line-height: 15px; }
`

export const RecordStatus = styled.span`
  width: 92px;
  height: 34px;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  border-radius: 999px;
  padding: 10px;
  background: ${({ theme }) => theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  font-size: 12px;
  font-weight: 600;
`

export const RowArrow = styled.span`
  flex: 0 0 auto;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 22px;
  font-weight: 400;
`

export const Empty = styled.div`
  display: flex;
  min-height: 220px;
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
