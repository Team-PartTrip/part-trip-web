import styled from 'styled-components'

export const Form = styled.form`
  position: absolute;
  z-index: 11;
  top: 152px;
  left: 497px;
  display: flex;
  width: 760px;
  height: 640px;
  flex-direction: column;
  gap: 20px;
  border: 1px solid #e7edf7;
  border-radius: 28px;
  padding: 30px 32px 28px;
  background: #fff;
  box-shadow: 0 18px 17px rgb(13 31 64 / 14%);
`

export const Header = styled.header`
  display: flex;
  width: 696px;
  height: 58px;
  align-items: flex-start;
  justify-content: space-between;
  h1 { margin: 0; color: #111827; font-size: 30px; line-height: 41px; letter-spacing: -1.2px; }
`

export const CloseButton = styled.button`
  display: grid;
  width: 40px;
  height: 40px;
  border: 1px solid #dde7f3;
  border-radius: 50%;
  place-items: center;
  background: #f7fafe;
  color: #727780;
  cursor: pointer;
  font-size: 24px;
  line-height: 1;
`

export const Body = styled.div`
  display: grid;
  width: 696px;
  height: 458px;
  grid-template-columns: 420px 252px;
  gap: 24px;
`

export const FieldGrid = styled.div`
  display: flex;
  height: 458px;
  flex-direction: column;
  gap: 16px;
`

export const Field = styled.label`
  display: flex;
  height: 68px;
  flex-direction: column;
  gap: 6px;
  color: #404752;
  font-size: 13px;
  font-weight: 600;
  line-height: 18px;
  input { width: 420px; height: 42px; border: 1px solid #dde7f3; border-radius: 12px; padding: 0 14px; background: #f7fafe; color: #727780; font: inherit; font-size: 14px; outline: none; }
  input:focus { border-color: #1a6ebf; box-shadow: 0 0 0 3px rgb(26 110 191 / 12%); }
`

export const Preview = styled.aside`
  display: flex;
  height: 458px;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  border: 1px solid #e0e9f4;
  border-radius: 22px;
  padding: 24px 22px;
  background: #f7fafe;
  h2 { margin: 0; font-size: 22px; line-height: 30px; }
  h3 { margin: 0; font-size: 24px; line-height: 32px; }
  p { margin: -8px 0 0; color: #1a6ebf; font-size: 14px; font-weight: 600; }
`

export const PreviewAvatar = styled.div`
  width: 90px;
  height: 90px;
  border: 1px solid #d8dddd;
  border-radius: 50%;
  background: #e6ecf3;
`

export const ErrorMessage = styled.p`
  margin: 0;
  color: #dc2626;
  font-size: 12px;
`

export const Actions = styled.div`
  display: flex;
  width: 696px;
  height: 44px;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
`

const Button = styled.button`
  height: 44px;
  border-radius: 10px;
  padding: 0 16px;
  cursor: pointer;
  font: inherit;
  font-size: 15px;
  font-weight: 600;
  &:disabled { cursor: wait; opacity: 0.55; }
`

export const CancelButton = styled(Button)`width: 96px; border: 1px solid #dde7f3; background: #fff; color: #1a6ebf;`
export const SaveButton = styled(Button)`width: 116px; border: 0; background: #1a6ebf; color: #fff;`
