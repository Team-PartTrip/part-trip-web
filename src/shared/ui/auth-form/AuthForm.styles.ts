import { createLink } from '@tanstack/react-router'
import styled, { css } from 'styled-components'

export const AuthPage = styled.main`
  display: flex;
  width: 100%;
  min-height: 100dvh;
  box-sizing: border-box;
  align-items: center;
  justify-content: center;
  padding: 0 1.25rem;
  background: ${({ theme }) => theme.colors.background.default};
`

export const Container = styled.section`
  display: flex;
  width: min(100%, 35rem);
  min-height: 100dvh;
  box-sizing: border-box;
  flex-direction: column;
  align-items: center;
  gap: 1.75rem;
  justify-content: center;
  padding: 3rem 2.25rem;
  background: ${({ theme }) => theme.colors.background.default};

  @media (max-width: 37.5rem) {
    padding: 1.75rem 1.25rem;
  }
`

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
`

export const Brand = styled.span`
  img {
    display: block;
    width: 11.25rem;
    height: auto;
    aspect-ratio: 362 / 86;
  }
`

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 1.875rem;
  font-weight: 700;
  line-height: 2.375rem;
  text-align: center;
`

export const Subtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.9375rem;
  line-height: 1.375rem;
  text-align: center;
`

export const Body = styled.div`
  display: flex;
  width: min(100%, 25rem);
  flex-direction: column;
`

export const Form = styled.form<{ $spacious?: boolean }>`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: ${({ $spacious }) => ($spacious ? '1.25rem' : '0.875rem')};
`

const buttonStyles = css`
  display: inline-flex;
  width: 100%;
  min-height: 3.375rem;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.375rem;
  text-align: center;
  text-decoration: none;

  &:disabled { cursor: not-allowed; opacity: 0.6; }
`

const SecondaryButtonBase = styled.a<{ $filled?: boolean }>`
  ${buttonStyles}
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 0.875rem;
  background: ${({ $filled, theme }) => ($filled ? theme.colors.brand.primary : theme.colors.background.default)};
  color: ${({ $filled, theme }) => ($filled ? theme.colors.text.inverse : theme.colors.brand.strong)};

  &:hover { background: ${({ theme }) => theme.colors.background.muted}; }
`

export const SecondaryButton = createLink(SecondaryButtonBase)

const AuthSwitchBase = styled.a`
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.875rem;
  line-height: 1.25rem;
  text-decoration: underline;
  text-underline-offset: 0.1875rem;

  &:hover { color: ${({ theme }) => theme.colors.brand.strong}; }
  &:focus-visible { outline: 0.1875rem solid ${({ theme }) => theme.colors.brand.primary}; outline-offset: 0.125rem; }
`

export const AuthSwitch = createLink(AuthSwitchBase)

export const GoogleButton = styled.button`
  ${buttonStyles}
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 0.875rem;
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.brand.strong};

  &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.background.muted}; }
`

export const KakaoButton = styled.button`
  ${buttonStyles}
  border: 0.0625rem solid #fee500;
  background: #fee500;
  color: #191919;

  &:hover:not(:disabled) { background: #fdd835; }
`

export const GoogleLoginContainer = styled.div`
  display: flex;
  width: 100%;
  min-height: 3.375rem;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  > div {
    width: 100% !important;
    height: 3.375rem !important;
  }

  > div > div,
  [role='button'] { width: 100% !important; }

  [role='button'] {
    height: 3.375rem !important;
    min-height: 3.375rem !important;
    display: flex !important;
    align-items: center;
    justify-content: center;
  }
`

export const Actions = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 0.875rem;
  margin-top: 0.375rem;
`

export const Divider = styled.div`
  display: flex;
  width: 100%;
  height: 1.5rem;
  align-items: center;
  gap: 1rem;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.875rem;
  line-height: 1.25rem;

  &::before, &::after {
    height: 0.0625rem;
    flex: 1;
    background: ${({ theme }) => theme.colors.border.default};
    content: '';
  }
`

export const Message = styled.p<{ $tone?: 'error' | 'success' }>`
  margin: 0;
  color: ${({ $tone, theme }) => ($tone === 'error' ? theme.colors.status.error : theme.colors.status.success)};
  font-size: 0.75rem;
  line-height: 1rem;
`
