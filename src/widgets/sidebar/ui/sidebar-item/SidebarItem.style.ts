import { Link } from '@tanstack/react-router'
import styled from 'styled-components'

export const ItemLink = styled(Link)<{ $isParentActive: boolean }>`
  display: flex;
  width: 100%;
  height: 44px;
  align-items: center;
  gap: 10px;
  border-radius: 12px;
  padding: 0 8px;
  background: ${({ $isParentActive, theme }) => ($isParentActive ? theme.colors.background.muted : 'transparent')};
  color: ${({ $isParentActive, theme }) => ($isParentActive ? theme.colors.brand.primary : theme.colors.text.muted)};
  text-decoration: none;
  outline: none;

  &:hover,
  &:focus-visible {
    background: ${({ theme }) => theme.colors.background.muted};
    color: ${({ theme }) => theme.colors.brand.strong};
  }

  @media (max-width: 47.9375rem) {
    width: 25%;
    height: 48px;
    justify-content: center;
    padding: 0;
  }
`

export const IconWrapper = styled.span`
  display: flex;
  width: 25px;
  height: 25px;
  flex: 0 0 25px;
  align-items: center;
  justify-content: center;

  img {
    display: block;
    width: 100%;
    height: 100%;
  }
`

export const Text = styled.span<{ $isParentActive: boolean }>`
  color: currentColor;
  font-size: 15px;
  font-weight: 600;
  line-height: 22px;
  white-space: nowrap;

  @media (max-width: 47.9375rem) {
    position: absolute;
    width: 0.0625rem;
    height: 0.0625rem;
    overflow: hidden;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    white-space: nowrap;
  }
`
