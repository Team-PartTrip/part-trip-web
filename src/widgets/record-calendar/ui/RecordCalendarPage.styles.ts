import styled from 'styled-components'

export const Page = styled.div`width: min(100%, 1200px); margin: 0 auto;`
export const Header = styled.header`display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 24px; @media (max-width: 600px) { flex-direction: column; }`
export const Title = styled.h1`margin: 0; color: ${({ theme }) => theme.colors.text.strong}; font-size: 32px; line-height: 40px;`
export const Subtitle = styled.p`margin: 6px 0 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 15px;`
export const BackButton = styled.button`min-height: 46px; border: 1px solid ${({ theme }) => theme.colors.brand.strong}; border-radius: 12px; padding: 12px 20px; background: ${({ theme }) => theme.colors.background.default}; color: ${({ theme }) => theme.colors.brand.strong}; cursor: pointer; font-weight: 600;`
export const CalendarCard = styled.section`border-radius: 28px; padding: 24px; background: ${({ theme }) => theme.colors.background.default}; box-shadow: ${({ theme }) => theme.shadows.subtle};`
export const MonthBar = styled.div`display: flex; align-items: center; justify-content: center; gap: 24px; margin-bottom: 24px; color: ${({ theme }) => theme.colors.text.strong}; button { width: 36px; height: 36px; border: 0; border-radius: 50%; background: ${({ theme }) => theme.colors.background.muted}; color: ${({ theme }) => theme.colors.brand.strong}; cursor: pointer; font-size: 24px; }`
export const Weekdays = styled.div`display: grid; grid-template-columns: repeat(7, 1fr); color: ${({ theme }) => theme.colors.text.muted}; font-size: 12px; text-align: center; span { padding: 10px 0; }`
export const Grid = styled.div`display: grid; grid-template-columns: repeat(7, 1fr); border-top: 1px solid ${({ theme }) => theme.colors.border.subtle}; border-left: 1px solid ${({ theme }) => theme.colors.border.subtle};`
export const Cell = styled.div<{ $empty: boolean }>`position: relative; min-height: 100px; border-right: 1px solid ${({ theme }) => theme.colors.border.subtle}; border-bottom: 1px solid ${({ theme }) => theme.colors.border.subtle}; padding: 12px; background: ${({ $empty, theme }) => ($empty ? theme.colors.background.subtle : theme.colors.background.default)}; color: ${({ theme }) => theme.colors.text.strong}; font-size: 13px; @media (max-width: 560px) { min-height: 64px; padding: 8px; }`
export const EventDot = styled.span`position: absolute; top: 36px; left: 50%; width: 8px; height: 8px; border-radius: 50%; background: ${({ theme }) => theme.colors.brand.primary}; transform: translateX(-50%);`
export const Note = styled.p`margin: 16px 0 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 13px; text-align: center;`
