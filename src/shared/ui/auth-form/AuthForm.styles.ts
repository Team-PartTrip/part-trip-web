import { Link } from 'react-router-dom'
import styled, { css } from 'styled-components'

type InputProps = {
  $compact?: boolean
}

export const AuthPage = styled.main`
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  padding: 136px 48px 180px;
  background: #ffffff;

  @media (max-width: 640px) {
    padding: 96px 20px 40px;
  }
`

export const Container = styled.section`
  display: flex;
  width: min(100%, 450px);
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 64px;
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
  color: #1b1b1b;
  font-size: 48px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0;
  text-align: center;

  @media (max-width: 640px) {
    font-size: 40px;
  }
`

export const Body = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 32px;
`

export const Form = styled.form`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 12px;
`

export const Input = styled.input<InputProps>`
  width: 100%;
  height: ${({ $compact }) => ($compact ? '36px' : '44px')};
  min-width: 0;
  border: 0.2px solid #e6e6e6;
  border-radius: 14px;
  padding: ${({ $compact }) => ($compact ? '0 16px' : '0 16px')};
  background: #ffffff;
  box-shadow: 0 1px 5px 1px rgb(0 0 0 / 5%);
  color: #1b1b1b;
  font: inherit;
  font-size: ${({ $compact }) => ($compact ? '16px' : '20px')};
  font-weight: ${({ $compact }) => ($compact ? 600 : 500)};
  line-height: 1;
  letter-spacing: 0;
  outline: none;

  &::placeholder {
    color: #adadad;
    opacity: 1;
  }

  &:focus {
    border-color: #5587f6;
    box-shadow:
      0 1px 5px 1px rgb(0 0 0 / 5%),
      0 0 0 3px rgb(85 135 246 / 18%);
  }
`

export const PhoneField = styled.div`
  display: flex;
  width: 100%;
  height: 44px;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  border: 0.2px solid #e6e6e6;
  border-radius: 14px;
  padding: 0 16px;
  background: #ffffff;
  box-shadow: 0 1px 5px 1px rgb(0 0 0 / 5%);
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
  border-top: 6px solid #777777;
  border-right: 5px solid transparent;
  border-left: 5px solid transparent;
`

export const PhoneInput = styled.input`
  width: 100%;
  min-width: 0;
  border: 0;
  padding: 0;
  color: #1b1b1b;
  font: inherit;
  font-size: 20px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0;
  outline: none;

  &::placeholder {
    color: #adadad;
    opacity: 1;
  }
`

export const VerificationField = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: minmax(0, 1fr) 85px;
  align-items: center;
  gap: 8px;
`

const buttonStyles = css`
  display: inline-flex;
  width: 100%;
  height: 50px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  padding: 0 34px;
  cursor: pointer;
  font: inherit;
  font-size: 20px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0;
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
  background: #5587f6;
  color: #fafafa;

  &:hover {
    background: #4b79df;
  }
`

export const SecondaryButton = styled(Link)`
  ${buttonStyles}
  border: 1px solid #5587f6;
  background: #ffffff;
  color: #5587f6;

  &:hover {
    background: #f8fbff;
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
  border: 0.5px solid #1a6ebf;
  border-radius: 10px;
  padding: 0 8px;
  background: #ffffff;
  color: #1a6ebf;
  cursor: pointer;
  font: inherit;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0;
  white-space: nowrap;

  &:hover {
    background: #f8fbff;
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
  color: #adadad;
  font-size: 16px;
  font-weight: 500;
  line-height: 1;
  letter-spacing: 0;
`

export const InlineLink = styled(Link)`
  color: #5587f6;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

export const Message = styled.p<{ $tone?: 'error' | 'success' }>`
  margin: 0;
  color: ${({ $tone }) => ($tone === 'error' ? '#dc2626' : '#5587f6')};
  font-size: 14px;
  font-weight: 500;
  line-height: 1.3;
  letter-spacing: 0;
`
