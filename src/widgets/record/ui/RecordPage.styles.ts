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
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  min-height: 3rem;
  padding-inline: 1.5rem;
  margin-bottom: 1.5rem;
`

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 1.875rem;
  line-height: 2.375rem;
`

export const YearTabs = styled.nav`
  display: flex;
  max-width: 100%;
  min-height: 2.75rem;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
  button {
    width: 5.5rem;
    height: 2.125rem;
    border: 0;
    border-radius: 0.75rem;
    padding: 0 0.625rem;
    background: ${({ theme }) => theme.colors.background.muted};
    color: ${({ theme }) => theme.colors.brand.primary};
    cursor: pointer;
    font-size: 0.6875rem;
    font-weight: 600;
  }
  button.active {
    background: ${({ theme }) => theme.colors.brand.primary};
    color: ${({ theme }) => theme.colors.text.inverse};
  }

  @media (max-width: 47.9375rem) {
    overflow-x: auto;
    scrollbar-width: none;
    &::-webkit-scrollbar { display: none; }
    button { flex: 0 0 5.5rem; height: 3rem; font-size: 0.875rem; }
  }
`

export const State = styled.p`
  padding: 4rem 0;
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
`

export const LoadingList = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`

export const LoadingRow = styled(Skeleton)`
  height: 7.875rem;
  border-radius: 1rem;
`

export const RecordList = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
`

export const RecordRow = styled.button`
  display: flex;
  min-height: 7.875rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 1rem;
  padding: 1rem;
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
  gap: 0.375rem;
  strong { font-size: 1.0625rem; line-height: 1.25rem; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.8125rem; line-height: 1rem; }
  small { color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.75rem; line-height: 0.9375rem; }
`

export const RecordStatus = styled.span`
  width: 5.75rem;
  height: 2.125rem;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  border-radius: 62.4375rem;
  padding: 0.625rem;
  background: ${({ theme }) => theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.text.inverse};
  font-size: 0.75rem;
  font-weight: 600;
`

export const RowArrow = styled.span`
  flex: 0 0 auto;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 1.375rem;
  font-weight: 400;
`

export const Empty = styled.div`
  display: flex;
  min-height: 13.75rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 1.25rem;
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
  strong { color: ${({ theme }) => theme.colors.text.strong}; }
`
