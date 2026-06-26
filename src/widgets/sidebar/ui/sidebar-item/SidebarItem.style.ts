import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const ItemLink = styled(Link)<{
  $isParentActive: boolean
}>`
  display: flex;
  width: 100%;
  align-items: center;
  gap: clamp(1rem, 1.65vw, 1.1875rem);
  color: ${({ $isParentActive }) =>
    $isParentActive ? '#1478c8' : '#777d86'};
  text-decoration: none;
  outline: none;

  svg {
    color: currentColor;
  }

  svg path,
  svg circle,
  svg rect,
  svg line,
  svg polyline,
  svg polygon {
    fill: currentColor;
    stroke: currentColor;
  }

  &:hover,
  &:focus-visible {
    color: #1478c8;
    text-decoration: none;
  }
`

export const IconWrapper = styled.span`
  display: flex;
  width: clamp(1.55rem, 2.25vw, 1.875rem);
  height: clamp(1.55rem, 2.25vw, 1.875rem);
  flex: 0 0 clamp(1.55rem, 2.25vw, 1.875rem);
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
  color: ${({ $isParentActive }) =>
    $isParentActive ? '#111111' : '#1f1f1f'};
  font-size: clamp(1.25rem, 1.75vw, 1.5rem);
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.2;
  white-space: nowrap;
`
