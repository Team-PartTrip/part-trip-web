import { Link } from 'react-router-dom'
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
  color: ${({ theme }) => theme.colors.text.muted};
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
  width: 20px;
  height: 20px;
  flex: 0 0 20px;
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
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
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
