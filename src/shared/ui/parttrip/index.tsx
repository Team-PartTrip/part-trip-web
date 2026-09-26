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
