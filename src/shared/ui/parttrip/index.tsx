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
  height: ${({ $height = '1rem' }) => $height};
  border-radius: ${({ $radius = '0.375rem' }) => $radius};
  background: linear-gradient(90deg, #edf3f8 25%, #f8fbfd 37%, #edf3f8 63%);
  background-size: 400% 100%;
  animation: ${skeletonShimmer} 1.4s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const Page = styled.div`
  width: min(100%, 75rem);
  margin: 0 auto;
`

export const PageHeader = styled.header`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-bottom: 1.5rem;
`

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: clamp(1.625rem, 3vw, 2rem);
  font-weight: 700;
  line-height: 2.5rem;
`

export const Subtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.9375rem;
  line-height: 1.375rem;
`

export const Card = styled.section`
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radii.xl};
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`

const buttonStyle = css<{ $variant?: ButtonVariant }>`
  display: inline-flex;
  min-height: 2.875rem;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 0.0625rem solid transparent;
  border-radius: 0.875rem;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.375rem;
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
        padding-inline: 0.5rem;

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
  padding: 0.25rem 0.5rem;
  background: var(--pt-bg-info);
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1rem;
  white-space: nowrap;
`

export const Tabs = styled.nav`
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  border-bottom: 0.0625rem solid ${({ theme }) => theme.colors.border.soft};
`

export const Tab = styled.button<{ $active?: boolean }>`
  min-width: 8.25rem;
  height: 2.75rem;
  border: 0;
  border-bottom: 0.125rem solid ${({ $active, theme }) => ($active ? theme.colors.brand.primary : 'transparent')};
  padding: 0 0.75rem;
  background: transparent;
  color: ${({ $active, theme }) => ($active ? theme.colors.brand.strong : theme.colors.text.muted)};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  white-space: nowrap;
`

export const Input = styled.input`
  width: 100%;
  min-width: 0;
  height: 2.875rem;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 0 1rem;
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
  height: 2.875rem;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 0 0.75rem;
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
  min-height: 8.75rem;
  resize: vertical;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: 1rem;
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
  min-height: 11.25rem;
  place-items: center;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
`

export const ErrorState = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.status.error};
  font-size: 0.875rem;
`

export const FormField = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 0.8125rem;
  font-weight: 600;

  small {
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: 0.75rem;
    font-weight: 400;
  }
`

export const Stack = styled.div<{ $gap?: number }>`
  display: flex;
  flex-direction: column;
  gap: ${({ $gap = 16 }) => `${$gap / 16}rem`};
`

export const Grid = styled.div<{ $columns?: string }>`
  display: grid;
  gap: 1.5rem;
  grid-template-columns: ${({ $columns = 'repeat(2, minmax(0, 1fr))' }) => $columns};

  @media (max-width: 47.5rem) {
    grid-template-columns: 1fr;
  }
`
