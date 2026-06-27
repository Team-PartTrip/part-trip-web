import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const ItemLink = styled(Link)<{ $isParentActive: boolean }>`
  display: flex;
  width: 100%;
  height: 1.3125rem;
  align-items: center;
  gap: 0.625rem;
  color: ${({ $isParentActive }) => ($isParentActive ? '#1478c8' : '#727780')};
  text-decoration: none;
  outline: none;

  svg {
    color: currentColor;
  }

  &:hover,
  &:focus-visible {
    color: #1478c8;
  }

  @media (max-width: 47.9375rem) {
    width: 2.5rem;
    height: 2.5rem;
    justify-content: center;
    border-radius: 0.75rem;
  }
`

export const IconWrapper = styled.span`
  display: flex;
  width: 1.125rem;
  height: 1.1875rem;
  flex: 0 0 1.125rem;
  align-items: center;
  justify-content: center;
  color: currentColor;

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`

export const Text = styled.span<{ $isParentActive: boolean }>`
  color: currentColor;
  font-size: 1rem;
  font-weight: ${({ $isParentActive }) => ($isParentActive ? 600 : 400)};
  letter-spacing: -0.02rem;
  line-height: 1.3;
  white-space: nowrap;

  @media (max-width: 63.9375rem) {
    position: absolute;
    width: 0.0625rem;
    height: 0.0625rem;
    overflow: hidden;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    white-space: nowrap;
  }
`
