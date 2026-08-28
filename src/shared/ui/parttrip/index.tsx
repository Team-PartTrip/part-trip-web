import { Link } from '@tanstack/react-router'
import styled, { css, keyframes } from 'styled-components'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

const skeletonShimmer = keyframes`
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
`

export const Skeleton = styled.span<{ $width?: string; $height?: string; $radius?: string }>`
  display: block;
  width: ${({ $width = '100%' }) => $width};
  height: ${({ $height = '16px' }) => $height};
  border-radius: ${({ $radius = '6px' }) => $radius};
  background: linear-gradient(90deg, #edf3f8 25%, #f8fbfd 37%, #edf3f8 63%);
  background-size: 400% 100%;
  animation: ${skeletonShimmer} 1.4s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const Page = styled.div`
  width: min(100%, 1200px);
  margin: 0 auto;
`

export const PageHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 24px;
`

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: clamp(26px, 3vw, 32px);
  font-weight: 700;
  line-height: 40px;
`

export const Subtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 15px;
  line-height: 22px;
`

export const Card = styled.section`
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.xl};
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`

const buttonStyle = css<{ $variant?: ButtonVariant }>`
  display: inline-flex;
  min-height: 46px;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid transparent;
  border-radius: 14px;
  padding: 12px 24px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  line-height: 22px;
  text-decoration: none;
  transition: background-color 120ms ease, border-color 120ms ease, color 120ms ease;

  ${({ $variant, theme }) => {
    if ($variant === 'secondary') {
      return css`
        border-color: ${theme.colors.border.subtle};
        background: ${theme.colors.background.default};
        color: ${theme.colors.brand.strong};

        &:hover {
          border-color: ${theme.colors.brand.primary};
          background: ${theme.colors.background.muted};
        }
      `
    }

    if ($variant === 'ghost') {
      return css`
        background: transparent;
        color: ${theme.colors.brand.strong};
        padding-inline: 8px;

        &:hover {
          background: ${theme.colors.background.muted};
        }
      `
    }

    return css`
      background: ${theme.colors.brand.primary};
      color: ${theme.colors.text.inverse};

      &:hover {
        background: ${theme.colors.brand.primaryHover};
      }
    `
  }}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.56;
  }
`

export const Button = styled.button<{ $variant?: ButtonVariant }>`
  ${buttonStyle}
`

export const LinkButton = styled(Link)<{ $variant?: ButtonVariant }>`
  ${buttonStyle}
`

export const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii.round};
  padding: 4px 8px;
  background: var(--pt-bg-info);
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 12px;
  font-weight: 500;
  line-height: 16px;
  white-space: nowrap;
`

export const Tabs = styled.nav`
  display: flex;
  gap: 8px;
  overflow-x: auto;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.soft};
`

export const Tab = styled.button<{ $active?: boolean }>`
  min-width: 132px;
  height: 44px;
  border: 0;
  border-bottom: 2px solid ${({ $active, theme }) => ($active ? theme.colors.brand.primary : 'transparent')};
  padding: 0 12px;
  background: transparent;
  color: ${({ $active, theme }) => ($active ? theme.colors.brand.strong : theme.colors.text.muted)};
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
`

export const Input = styled.input`
  width: 100%;
  min-width: 0;
  height: 46px;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 0 16px;
  background: ${({ theme }) => theme.colors.background.soft};
  color: ${({ theme }) => theme.colors.text.strong};
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.brand.primary};
    box-shadow: ${({ theme }) => theme.shadows.inputFocus};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.placeholder};
  }
`

export const Select = styled.select`
  width: 100%;
  min-width: 0;
  height: 46px;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 0 12px;
  background: ${({ theme }) => theme.colors.background.soft};
  color: ${({ theme }) => theme.colors.text.strong};
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.brand.primary};
    box-shadow: ${({ theme }) => theme.shadows.inputFocus};
  }
`

export const Textarea = styled.textarea`
  width: 100%;
  min-height: 140px;
  resize: vertical;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 16px;
  background: ${({ theme }) => theme.colors.background.soft};
  color: ${({ theme }) => theme.colors.text.strong};
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.brand.primary};
    box-shadow: ${({ theme }) => theme.shadows.inputFocus};
  }
`

export const EmptyState = styled.div`
  display: grid;
  min-height: 180px;
  place-items: center;
  padding: 32px;
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
`

export const ErrorState = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.status.error};
  font-size: 14px;
`

export const FormField = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 13px;
  font-weight: 600;

  small {
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: 12px;
    font-weight: 400;
  }
`

export const Stack = styled.div<{ $gap?: number }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap = 16 }) => `${$gap}px`};
`

export const Grid = styled.div<{ $columns?: string }>`
  display: grid;
  gap: 24px;
  grid-template-columns: ${({ $columns = 'repeat(2, minmax(0, 1fr))' }) => $columns};

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`
