import { Link } from '@tanstack/react-router'
import styled from 'styled-components'

export const ItemLink = styled(Link)<{ $isParentActive: boolean }>`
  position: relative;
  display: flex;
  width: 100%;
  min-height: 3rem;
  align-items: center;
  gap: 0.625rem;
  border-radius: 0.75rem;
  padding: 0 0.5rem;
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
    width: auto;
    min-width: 3rem;
    height: 3rem;
    flex: 1;
    flex-direction: column;
    gap: 0.125rem;
    justify-content: center;
    padding: 0;
  }
`

export const IconWrapper = styled.span`
  position: relative;
  display: flex;
  width: 1.5625rem;
  height: 1.5625rem;
  flex: 0 0 1.5625rem;
  align-items: center;
  justify-content: center;

  img {
    display: block;
    width: 100%;
    height: 100%;
  }
`

export const Badge = styled.span`
  position: absolute;
  top: -0.3125rem;
  right: -0.5625rem;
  display: inline-flex;
  min-width: 1.125rem;
  height: 1.125rem;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  border: 0.125rem solid ${({ theme }) => theme.colors.background.default};
  border-radius: 62.4375rem;
  padding: 0 0.25rem;
  background: #d94545;
  color: #fff;
  font-size: 0.625rem;
  font-weight: 700;
  line-height: 0.875rem;
`

export const Text = styled.span<{ $isParentActive: boolean }>`
  color: currentColor;
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.375rem;
  white-space: nowrap;

  @media (max-width: 47.9375rem) {
    position: static;
    width: auto;
    height: auto;
    overflow: visible;
    clip: auto;
    clip-path: none;
    font-size: 0.8125rem;
    line-height: 0.9375rem;
  }
`
