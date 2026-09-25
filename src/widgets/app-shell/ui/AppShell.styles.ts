import { Link } from '@tanstack/react-router'
import styled from 'styled-components'

export const Root = styled.div`
  display: flex;
  min-height: 100dvh;
  background: ${({ theme }) => theme.colors.background.subtle};
`

export const SkipLink = styled.a`
  position: absolute;
  z-index: 10;
  top: 0.5rem;
  left: 0.5rem;
  padding: 0.75rem 1rem;
  transform: translateY(-160%);
  border-radius: 0.5rem;
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.strong};
  font-weight: 600;

  &:focus-visible {
    transform: translateY(0);
    outline: 0.125rem solid ${({ theme }) => theme.colors.text.strong};
    outline-offset: 0.125rem;
  }
`

export const Content = styled.div`
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;

  @media (max-width: 47.9375rem) {
    padding-bottom: 4rem;
  }
`

export const Topbar = styled.header`
  display: flex;
  width: 100%;
  height: 5rem;
  flex: 0 0 5rem;
  align-items: center;
  gap: 1rem;
  border-bottom: 0.0625rem solid #e6eef5;
  padding: 0 2rem;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: 0 0.125rem 0.5rem rgb(16 42 66 / 4%);

  @media (min-width: 48rem) {
    display: none;
  }

  @media (max-width: 47.9375rem) {
    height: 4rem;
    flex-basis: 4rem;
    padding: 0 1rem;
  }
`

export const TopbarSpacer = styled.div`
  min-width: 0;
  flex: 1;
`

export const MobileLogoLink = styled(Link)`
  display: none;

  img {
    display: block;
    width: 7rem;
    height: auto;
  }

  @media (max-width: 47.9375rem) {
    display: inline-flex;
    min-height: 3rem;
    align-items: center;
  }
`

export const NotificationLink = styled(Link)`
  display: inline-flex;
  width: 4.375rem;
  height: 2.25rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  padding: 0;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 0.75rem;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;

  @media (max-width: 47.9375rem) { display: none; }
`

export const Main = styled.main<{ $fillHeight?: boolean }>`
  min-width: 0;
  flex: 1;
  display: ${({ $fillHeight }) => ($fillHeight ? 'flex' : 'block')};
  flex-direction: column;
  padding: 2.5rem;

  @media (max-width: 68.75rem) {
    padding: 1.75rem;
  }

  @media (max-width: 47.9375rem) {
    padding: 1.5rem 1rem;
  }
`
