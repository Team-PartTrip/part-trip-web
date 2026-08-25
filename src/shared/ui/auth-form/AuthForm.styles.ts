import { Link } from '@/shared/libs/router'
import styled, { css, keyframes } from 'styled-components'

type InputProps = { $compact?: boolean }

const codeCaretBlink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`

export const AuthPage = styled.main`
  display: grid;
  min-height: 100dvh;
  place-items: center;
  padding: 40px 20px;
  background: ${({ theme }) => theme.colors.background.default};
`

export const Container = styled.section`
  display: flex;
  width: min(100%, 560px);
  flex-direction: column;
  align-items: center;
  gap: 20px;
`

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`

export const Brand = styled.span`
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 24px;
  font-weight: 700;
  line-height: 32px;
`

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 32px;
  font-weight: 700;
  line-height: 40px;
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
  border: 1px solid #d5dee6;
  border-radius: 12px;
  padding: 0 16px;
  background: #f7f9fb;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 16px;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.brand.primary};
    box-shadow: ${({ theme }) => theme.shadows.inputFocus};
  }

  &:disabled { cursor: not-allowed; opacity: 0.6; }
  &::placeholder { color: #91a2b5; }
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
  border: 1px solid ${({ theme }) => theme.colors.brand.strong};
  background: ${({ $filled, theme }) => ($filled ? theme.colors.brand.primary : theme.colors.background.default)};
  color: ${({ $filled, theme }) => ($filled ? theme.colors.text.inverse : theme.colors.brand.strong)};

  &:hover { background: ${({ theme }) => theme.colors.background.muted}; }
`

export const OutlineButton = styled.button`
  ${buttonStyles}
  border: 1px solid ${({ theme }) => theme.colors.brand.strong};
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

export const GoogleButton = styled.button`
  ${buttonStyles}
  border: 1px solid ${({ theme }) => theme.colors.brand.strong};
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.brand.strong};

  &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.background.muted}; }
`

export const Actions = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 14px;
`

export const Divider = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 16px;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 14px;

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
  margin-top: -2px;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 12px;
  line-height: 20px;
`

export const InlineLink = styled(Link)`
  color: ${({ theme }) => theme.colors.brand.primary};
  text-decoration: none;
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
