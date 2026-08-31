import { Link } from '@tanstack/react-router'
import styled, { css, keyframes } from 'styled-components'

type InputProps = { $compact?: boolean }

const codeCaretBlink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`

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

export const Field = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 6px;
`

export const FieldHint = styled.small`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 12px;
  line-height: 16px;
`

export const VerificationCodeForm = styled.form`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 14px;
`

export const Input = styled.input<InputProps>`
  width: 100%;
  height: ${({ $compact }) => ($compact ? '36px' : '44px')};
  min-width: 0;
  border: 1px solid var(--pt-border-default);
  border-radius: 12px;
  padding: 0 16px;
  background: var(--pt-bg-soft);
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 16px;
  line-height: 22px;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.brand.primary};
    box-shadow: ${({ theme }) => theme.shadows.inputFocus};
  }

  &:disabled { cursor: not-allowed; opacity: 0.6; }
  &::placeholder { color: var(--pt-text-placeholder); }
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

export const PrimaryButton = styled.button<{ $strong?: boolean }>`
  ${buttonStyles}
  border: 1px solid transparent;
  background: ${({ theme }) => theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.text.inverse};

  &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.brand.primaryHover}; }
`

export const SecondaryButton = styled(Link)<{ $filled?: boolean }>`
  ${buttonStyles}
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 14px;
  background: ${({ $filled, theme }) => ($filled ? theme.colors.brand.primary : theme.colors.background.default)};
  color: ${({ $filled, theme }) => ($filled ? theme.colors.text.inverse : theme.colors.brand.strong)};

  &:hover { background: ${({ theme }) => theme.colors.background.muted}; }
`

export const OutlineButton = styled.button`
  ${buttonStyles}
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.brand.strong};

  &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.background.muted}; }
`

export const CodeSendButton = styled.button`
  ${buttonStyles}
  min-height: 40px;
  border: 1px solid ${({ theme }) => theme.colors.brand.strong};
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 12px;
`

export const InlineVerificationRow = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 12px;

  ${Input} { width: 288px; flex: 0 0 288px; }
  ${CodeSendButton} {
    width: 100px;
    height: 44px;
    min-height: 44px;
    border: 0;
    border-radius: 12px;
    padding: 0;
    background: ${({ theme }) => theme.colors.brand.primary};
    box-shadow: 0 4px 10px rgb(26 110 191 / 16%);
    color: ${({ theme }) => theme.colors.text.inverse};
  }
`

export const GoogleButton = styled.button`
  ${buttonStyles}
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.brand.strong};

  &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.background.muted}; }
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

export const HintRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  margin-top: 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 12px;
  line-height: 20px;
`

export const InlineLink = styled(Link)`
  color: ${({ theme }) => theme.colors.brand.primary};
  text-decoration: none;
`

export const Footer = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 12px;
  line-height: 16px;
  text-align: center;

  a {
    color: ${({ theme }) => theme.colors.brand.primary};
    text-decoration: none;
  }
`

export const Message = styled.p<{ $tone?: 'error' | 'success' }>`
  margin: 0;
  color: ${({ $tone, theme }) => ($tone === 'error' ? theme.colors.status.error : theme.colors.status.success)};
  font-size: 12px;
  line-height: 16px;
`

export const VerificationPanel = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 20px;
`

export const VerificationIllustration = styled.div`
  display: none;
`

export const EnvelopeIcon = styled.div`
  display: none;
`

export const VerificationContent = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  gap: 14px;
`

export const VerificationTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 18px;
  font-weight: 700;
`

export const VerificationDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 13px;
  text-align: center;
`

export const CodeInput = styled.input`
  width: 100%;
  height: 54px;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 12px;
  padding: 0 16px;
  background: ${({ theme }) => theme.colors.background.soft};
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 20px;
  letter-spacing: 0.35em;
  outline: none;

  &:focus { box-shadow: ${({ theme }) => theme.shadows.inputFocus}; }
`

export const CodeInputGroup = styled.div`
  position: relative;
  display: grid;
  width: 100%;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 8px;
`

export const CodeHiddenInput = styled.input`
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  border: 0;
  opacity: 0;
`

export const CodeSlot = styled.span<{ $active?: boolean }>`
  display: grid;
  height: 54px;
  place-items: center;
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.background.soft};
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 20px;

  ${({ $active, theme }) => $active && css`
    border-color: ${theme.colors.brand.primary};
    box-shadow: ${theme.shadows.inputFocus};
    &::after {
      width: 2px;
      height: 24px;
      border-radius: 999px;
      background: ${theme.colors.brand.primary};
      content: '';
      animation: ${codeCaretBlink} 1s steps(1, end) infinite;
    }
  `}
`

export const VerificationActions = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
`

export const BackButton = styled.button`
  ${buttonStyles}
  border: 1px solid ${({ theme }) => theme.colors.border.soft};
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.muted};
`
