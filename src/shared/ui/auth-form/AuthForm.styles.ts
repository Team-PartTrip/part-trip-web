import { Link } from 'react-router-dom'
import styled, { css, keyframes } from 'styled-components'

type InputProps = {
  $compact?: boolean
}

const codeCaretBlink = keyframes`
  0%,
  49% {
    opacity: 1;
  }

  50%,
  100% {
    opacity: 0;
  }
`

export const AuthPage = styled.main`
  display: flex;
  min-height: 100dvh;
  align-items: center;
  justify-content: center;
  padding: 136px 48px 180px;
  background: ${({ theme }) => theme.colors.background.default};

  @media (max-width: 640px) {
    padding: 40px 20px;
  }
`

export const Container = styled.section`
  display: flex;
  width: min(100%, 600px);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 48px;

  @media (max-width: 640px) {
    gap: 36px;
  }
`

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`

export const Logo = styled.img`
  width: 181px;
  height: 43px;
  object-fit: contain;
`

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.default};
  font-size: 48px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: -2.4px;
  text-align: center;

  @media (max-width: 640px) {
    font-size: 40px;
  }
`

export const Body = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 48px;
`

export const Form = styled.form`
  display: flex;
  align-items: center;
  width: 100%;
  flex-direction: column;
  gap: 12px;
`

export const VerificationCodeForm = styled.form`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  gap: 32px;
`

export const Input = styled.input<InputProps>`
  width: 100%;
  height: ${({ $compact }) => ($compact ? '36px' : '44px')};
  min-width: 0;
  border: 0.2px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.input};
  padding: ${({ $compact }) => ($compact ? '0 16px' : '0 16px')};
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.input};
  color: ${({ theme }) => theme.colors.text.default};
  font: inherit;
  font-size: ${({ $compact }) => ($compact ? '16px' : '20px')};
  font-weight: ${({ $compact }) => ($compact ? 600 : 500)};
  line-height: 1;
  letter-spacing: 0;
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.placeholder};
    opacity: 1;
  }

  &:focus {
    border-color: ${({ theme }) => theme.colors.border.interactive};
    box-shadow: ${({ theme }) => theme.shadows.inputFocus};
  }
`

export const PhoneField = styled.div`
  display: flex;
  width: 100%;
  height: 44px;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  border: 0.2px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.radii.input};
  padding: 0 16px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.input};
`

export const CountryButton = styled.button`
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 2px;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;
`

export const FlagText = styled.span`
  display: inline-flex;
  width: 29px;
  height: 29px;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  line-height: 1;
`

export const Chevron = styled.span`
  width: 0;
  height: 0;
  border-top: 6px solid ${({ theme }) => theme.colors.text.muted};
  border-right: 5px solid transparent;
  border-left: 5px solid transparent;
`

export const PhoneInput = styled.input`
  width: 100%;
  min-width: 0;
  border: 0;
  padding: 0;
  color: ${({ theme }) => theme.colors.text.default};
  font: inherit;
  font-size: 20px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0;
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.placeholder};
    opacity: 1;
  }
`

export const VerificationField = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: minmax(0, 1fr) 96px;
  align-items: center;
  gap: 8px;

  @media (max-width: 420px) {
    grid-template-columns: 1fr;
  }
`

const buttonStyles = css`
  display: inline-flex;
  width: 100%;
  height: 50px;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii.button};
  padding: 0 34px;
  cursor: pointer;
  font: inherit;
  font-size: 20px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.6px;
  text-align: center;
  text-decoration: none;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
`

export const PrimaryButton = styled.button`
  ${buttonStyles}
  border: 0;
  background: ${({ theme }) => theme.colors.brand.primary};
  color: ${({ theme }) => theme.colors.text.inverse};

  &:hover {
    background: ${({ theme }) => theme.colors.brand.primaryHover};
  }
`

export const SecondaryButton = styled(Link)`
  ${buttonStyles}
  border: 1px solid ${({ theme }) => theme.colors.brand.primary};
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.brand.primary};

  &:hover {
    background: ${({ theme }) => theme.colors.background.muted};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
`

export const CodeSendButton = styled.button`
  display: inline-flex;
  width: 100%;
  height: 35px;
  align-items: center;
  justify-content: center;
  border: 0.5px solid ${({ theme }) => theme.colors.brand.strong};
  border-radius: ${({ theme }) => theme.radii.button};
  padding: 0 8px;
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.brand.strong};
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0;
  white-space: nowrap;

  &:hover {
    background: ${({ theme }) => theme.colors.background.muted};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
`

export const Actions = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 16px;
`

export const HintRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
  color: ${({ theme }) => theme.colors.text.placeholder};
  font-size: 16px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0;
`

export const InlineLink = styled(Link)`
  color: ${({ theme }) => theme.colors.brand.primary};
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

export const Message = styled.p<{ $tone?: 'error' | 'success' }>`
  margin: 0;
  color: ${({ $tone, theme }) =>
    $tone === 'error' ? theme.colors.status.error : theme.colors.status.success};
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: 0;
`

export const VerificationPanel = styled.div`
  display: grid;
  width: min(100%, 560px);
  grid-template-columns: 168px minmax(0, 1fr);
  align-items: center;
  gap: 34px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    justify-items: center;
    gap: 24px;
  }
`

export const VerificationIllustration = styled.div`
  display: flex;
  width: 148px;
  height: 148px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.background.subtle};
`

export const EnvelopeIcon = styled.div`
  position: relative;
  display: flex;
  width: 96px;
  height: 68px;
  align-items: center;
  justify-content: center;
  border-radius: 8px 8px 18px 18px;
  background:
    linear-gradient(
        145deg,
        transparent 49%,
        ${({ theme }) => theme.colors.brand.accent} 50%
      )
      left bottom / 50% 44% no-repeat,
    linear-gradient(
        215deg,
        transparent 49%,
        ${({ theme }) => theme.colors.brand.accent} 50%
      )
      right bottom / 50% 44% no-repeat,
    ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 24px;
  letter-spacing: 2px;

  strong {
    position: absolute;
    top: 14px;
    right: 12px;
    color: ${({ theme }) => theme.colors.brand.successStrong};
    font-size: 30px;
    line-height: 1;
  }
`

export const VerificationContent = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  gap: 14px;
`

export const VerificationTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.default};
  font-size: 24px;
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: 0;
  text-align: center;
`

export const VerificationDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 17px;
  font-weight: 600;
  line-height: 1.35;
  letter-spacing: 0;
  text-align: center;

  strong {
    color: ${({ theme }) => theme.colors.brand.success};
  }
`

export const CodeInput = styled.input`
  width: min(100%, 522px);
  height: 76px;
  border: 0;
  border-radius: 0;
  background:
    linear-gradient(
        ${({ theme }) => theme.colors.background.soft},
        ${({ theme }) => theme.colors.background.soft}
      )
      0 0 / calc((100% - 90px) / 6) 100% no-repeat,
    linear-gradient(
        ${({ theme }) => theme.colors.background.soft},
        ${({ theme }) => theme.colors.background.soft}
      )
      calc((100% - 90px) / 6 + 18px) 0 / calc((100% - 90px) / 6) 100%
      no-repeat,
    linear-gradient(
        ${({ theme }) => theme.colors.background.soft},
        ${({ theme }) => theme.colors.background.soft}
      )
      calc(((100% - 90px) / 6 + 18px) * 2) 0 / calc((100% - 90px) / 6) 100%
      no-repeat,
    linear-gradient(
        ${({ theme }) => theme.colors.background.soft},
        ${({ theme }) => theme.colors.background.soft}
      )
      calc(((100% - 90px) / 6 + 18px) * 3) 0 / calc((100% - 90px) / 6) 100%
      no-repeat,
    linear-gradient(
        ${({ theme }) => theme.colors.background.soft},
        ${({ theme }) => theme.colors.background.soft}
      )
      calc(((100% - 90px) / 6 + 18px) * 4) 0 / calc((100% - 90px) / 6) 100%
      no-repeat,
    linear-gradient(
        ${({ theme }) => theme.colors.background.soft},
        ${({ theme }) => theme.colors.background.soft}
      )
      calc(((100% - 90px) / 6 + 18px) * 5) 0 / calc((100% - 90px) / 6) 100%
      no-repeat;
  color: ${({ theme }) => theme.colors.text.default};
  font-family:
    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono',
    monospace;
  font-size: 48px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.72ch;
  line-height: 1;
  outline: none;
  text-align: left;

  &::placeholder {
    color: transparent;
  }

  &:focus {
    filter: drop-shadow(0 0 0 rgb(85 135 246 / 0%));
  }

  @media (max-width: 640px) {
    height: 62px;
    padding-left: 14px;
    background:
      linear-gradient(
          ${({ theme }) => theme.colors.background.soft},
          ${({ theme }) => theme.colors.background.soft}
        )
        0 0 / calc((100% - 40px) / 6) 100% no-repeat,
      linear-gradient(
          ${({ theme }) => theme.colors.background.soft},
          ${({ theme }) => theme.colors.background.soft}
        )
        calc((100% - 40px) / 6 + 8px) 0 / calc((100% - 40px) / 6) 100%
        no-repeat,
      linear-gradient(
          ${({ theme }) => theme.colors.background.soft},
          ${({ theme }) => theme.colors.background.soft}
        )
        calc(((100% - 40px) / 6 + 8px) * 2) 0 / calc((100% - 40px) / 6) 100%
        no-repeat,
      linear-gradient(
          ${({ theme }) => theme.colors.background.soft},
          ${({ theme }) => theme.colors.background.soft}
        )
        calc(((100% - 40px) / 6 + 8px) * 3) 0 / calc((100% - 40px) / 6) 100%
        no-repeat,
      linear-gradient(
          ${({ theme }) => theme.colors.background.soft},
          ${({ theme }) => theme.colors.background.soft}
        )
        calc(((100% - 40px) / 6 + 8px) * 4) 0 / calc((100% - 40px) / 6) 100%
        no-repeat,
      linear-gradient(
          ${({ theme }) => theme.colors.background.soft},
          ${({ theme }) => theme.colors.background.soft}
        )
        calc(((100% - 40px) / 6 + 8px) * 5) 0 / calc((100% - 40px) / 6) 100%
        no-repeat;
    font-size: 38px;
    letter-spacing: 0.45ch;
  }
`

export const CodeInputGroup = styled.div`
  position: relative;
  display: grid;
  width: min(100%, 522px);
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: 18px;
  cursor: text;

  &[aria-disabled='true'] {
    cursor: not-allowed;
    opacity: 0.65;
  }

  @media (max-width: 640px) {
    gap: 8px;
  }
`

export const CodeHiddenInput = styled.input`
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  border: 0;
  padding: 0;
  background: transparent;
  caret-color: transparent;
  color: transparent;
  font-size: 16px;
  opacity: 0;
  outline: none;
`

export const CodeSlot = styled.span<{ $active?: boolean }>`
  position: relative;
  display: grid;
  height: 84px;
  place-items: center;
  background: ${({ theme }) => theme.colors.background.default};
  border: 1.5px solid #d8dddd;
  color: ${({ theme }) => theme.colors.text.default};
  box-sizing: border-box;
  border-radius: 25px;

  font-size: 48px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  letter-spacing: -2.4px;
  text-align: center;

  ${({ $active, theme }) =>
    $active &&
    css`
      &::after {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 3px;
        height: 57px;
        border-radius: 999px;
        background: ${theme.colors.text.default};
        content: '';
        transform: translate(-50%, -50%);
        animation: ${codeCaretBlink} 1s steps(1, end) infinite;
      }
    `}

  @media (max-width: 640px) {
    height: 62px;
    font-size: 38px;
  }
`

export const VerificationActions = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
`

export const BackButton = styled.button`
  ${buttonStyles}
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.default};
  font-weight: 700;

  &:hover {
    background: ${({ theme }) => theme.colors.background.muted};
  }
`
