import { createLink } from '@tanstack/react-router'
import styled, { css } from 'styled-components'

export const AuthPage = styled.main`
  display: flex;
  min-height: 100dvh;
  align-items: flex-start;
  justify-content: center;
  padding: 152px 20px 108px;
  background: ${({ theme }) => theme.colors.background.default};
  border: 1px solid #d8dddd;
  border-radius: 14px;
  box-shadow: 0 4px 14px rgb(15 33 51 / 5%);

  @media (max-width: 600px) {
    padding: 40px 20px;
    border: 0;
    border-radius: 0;
    box-shadow: none;
  }
`

export const Container = styled.section`
  display: flex;
  width: min(100%, 560px);
  height: 720px;
  min-height: 720px;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  justify-content: center;
  border: 1px solid #e6edf4;
  border-radius: 16px;
  padding: 32px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: 0 4px 14px rgb(15 33 51 / 5%);

  @media (max-width: 600px) {
    min-height: 0;
    padding: 28px 20px;
  }
`

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`

export const Brand = styled.span`
  img {
    display: block;
    width: 180px;
    height: auto;
    aspect-ratio: 362 / 86;
  }
`

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 30px;
  font-weight: 700;
  line-height: 38px;
  text-align: center;
`

export const Subtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 15px;
  line-height: 22px;
  text-align: center;
`

export const Body = styled.div`
  display: flex;
  width: min(100%, 400px);
  flex-direction: column;
`

export const Form = styled.form<{ $spacious?: boolean }>`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: ${({ $spacious }) => ($spacious ? '20px' : '14px')};
`

const buttonStyles = css`
  display: inline-flex;
  width: 100%;
  min-height: 54px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  padding: 12px 24px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  line-height: 22px;
  text-align: center;
  text-decoration: none;

  &:disabled { cursor: not-allowed; opacity: 0.6; }
`

const SecondaryButtonBase = styled.a<{ $filled?: boolean }>`
  ${buttonStyles}
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 14px;
  background: ${({ $filled, theme }) => ($filled ? theme.colors.brand.primary : theme.colors.background.default)};
  color: ${({ $filled, theme }) => ($filled ? theme.colors.text.inverse : theme.colors.brand.strong)};

  &:hover { background: ${({ theme }) => theme.colors.background.muted}; }
`

export const SecondaryButton = createLink(SecondaryButtonBase)

export const GoogleButton = styled.button`
  ${buttonStyles}
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.brand.strong};

  &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.background.muted}; }
`

export const KakaoButton = styled.button`
  ${buttonStyles}
  border: 1px solid #fee500;
  background: #fee500;
  color: #191919;

  &:hover:not(:disabled) { background: #fdd835; }
`

export const GoogleLoginContainer = styled.div`
  display: flex;
  width: 100%;
  min-height: 54px;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  > div {
    width: 100% !important;
    height: 54px !important;
  }

  > div > div,
  [role='button'] { width: 100% !important; }

  [role='button'] {
    height: 54px !important;
    min-height: 54px !important;
    display: flex !important;
    align-items: center;
    justify-content: center;
  }
`

export const Actions = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 14px;
  margin-top: 6px;
`

export const Divider = styled.div`
  display: flex;
  width: 100%;
  height: 24px;
  align-items: center;
  gap: 16px;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 14px;
  line-height: 20px;

  &::before, &::after {
    height: 1px;
    flex: 1;
    background: ${({ theme }) => theme.colors.border.default};
    content: '';
  }
`

export const Message = styled.p<{ $tone?: 'error' | 'success' }>`
  margin: 0;
  color: ${({ $tone, theme }) => ($tone === 'error' ? theme.colors.status.error : theme.colors.status.success)};
  font-size: 12px;
  line-height: 16px;
`
