import styled from 'styled-components'

export const Form = styled.form`
  position: fixed;
  z-index: 1001;
  top: 50%;
  left: 50%;
  display: flex;
  width: min(900px, calc(100vw - 48px));
  max-height: calc(100dvh - 48px);
  flex-direction: column;
  gap: 20px;
  overflow: hidden;
  border: 1px solid #e0e9f4;
  border-radius: 26px;
  padding: 28px 32px 24px;
  background: #fff;
  box-shadow: 0 24px 70px rgb(13 31 64 / 22%);
  transform: translate(-50%, -50%);

  @media (max-width: 47.9375rem) {
    width: calc(100vw - 28px);
    max-height: calc(100dvh - 28px);
    gap: 16px;
    border-radius: 20px;
    padding: 22px 18px 18px;
  }
`

export const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;

  h1 { margin: 0; color: #111827; font-size: 28px; line-height: 38px; letter-spacing: -1.1px; }
  p { margin: 2px 0 0; color: #727780; font-size: 13px; }
`

export const CloseButton = styled.button`
  display: grid;
  width: 40px;
  height: 40px;
  flex: 0 0 40px;
  border: 1px solid #dde7f3;
  border-radius: 50%;
  place-items: center;
  background: #f7fafe;
  color: #727780;
  cursor: pointer;
  font-size: 24px;
  line-height: 1;

  &:hover { background: #edf5fc; color: #1a6ebf; }
  &:focus-visible { outline: 3px solid rgb(26 110 191 / 18%); }
`

export const Body = styled.div`
  display: grid;
  min-height: 0;
  grid-template-columns: minmax(0, 1fr) 260px;
  gap: 24px;
  overflow-y: auto;
  padding: 1px 4px 1px 0;

  @media (max-width: 47.9375rem) { grid-template-columns: 1fr; }
`

export const EditorColumn = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 16px;
`

export const Section = styled.section`
  border: 1px solid #e7edf7;
  border-radius: 16px;
  padding: 16px;
  background: #fff;
`

export const SectionHeading = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;

  strong { color: #1e293b; font-size: 15px; }
  span { color: #8b95a3; font-size: 11px; text-align: right; }

  @media (max-width: 30rem) { align-items: flex-start; flex-direction: column; gap: 2px; }
`

export const PhotoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`

export const PhotoPreview = styled.div`
  display: grid;
  width: 76px;
  height: 76px;
  flex: 0 0 76px;
  overflow: hidden;
  border: 1px solid #d8dddd;
  border-radius: 50%;
  place-items: center;
  background: #e6ecf3;
  color: #627085;
  font-size: 28px;
  font-weight: 700;

  img { display: block; width: 100%; height: 100%; object-fit: cover; }
`

export const PhotoActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`

export const PhotoButton = styled.label`
  display: inline-flex;
  height: 38px;
  align-items: center;
  border-radius: 10px;
  padding: 0 14px;
  background: #1a6ebf;
  color: #fff;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;

  input { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  &:hover { background: #075caa; }
  &:focus-within { outline: 3px solid rgb(26 110 191 / 18%); outline-offset: 2px; }
`

export const ResetPhotoButton = styled.button`
  height: 38px;
  border: 1px solid #dde7f3;
  border-radius: 10px;
  padding: 0 13px;
  background: #fff;
  color: #526071;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;

  &:hover { background: #f7fafe; }
`

export const Field = styled.label`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 6px;
  color: #404752;
  font-size: 12px;
  font-weight: 600;

  input {
    width: 100%;
    height: 42px;
    border: 1px solid #dde7f3;
    border-radius: 12px;
    padding: 0 14px;
    background: #f7fafe;
    color: #273244;
    font: inherit;
    font-size: 14px;
    outline: none;
  }

  input:focus { border-color: #1a6ebf; box-shadow: 0 0 0 3px rgb(26 110 191 / 12%); }
  input[aria-invalid='true'] { border-color: #dc2626; }
`

export const PasswordGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 36rem) { grid-template-columns: 1fr; }
`

export const Preview = styled.aside`
  position: sticky;
  top: 0;
  display: flex;
  min-height: 430px;
  align-items: center;
  flex-direction: column;
  border: 1px solid #e0e9f4;
  border-radius: 22px;
  padding: 24px 22px;
  background: #f7fafe;
  text-align: center;

  h2 { width: 100%; margin: 0; color: #111827; font-size: 22px; line-height: 30px; text-align: left; }
  h3 { max-width: 100%; overflow: hidden; margin: 18px 0 0; color: #111827; font-size: 24px; line-height: 32px; text-overflow: ellipsis; white-space: nowrap; }
  p { margin: 3px 0 0; color: #1a6ebf; font-size: 14px; font-weight: 600; }
  small { margin-top: auto; color: #8b95a3; font-size: 11px; line-height: 16px; }

  @media (max-width: 47.9375rem) { position: static; min-height: 300px; }
`

export const PreviewAvatar = styled.div`
  display: grid;
  width: 124px;
  height: 124px;
  overflow: hidden;
  margin-top: 36px;
  border: 1px solid #d8dddd;
  border-radius: 50%;
  place-items: center;
  background: #e6ecf3;
  color: #627085;
  font-size: 44px;
  font-weight: 700;

  img { display: block; width: 100%; height: 100%; object-fit: cover; }
`

export const FieldError = styled.span`
  color: #dc2626;
  font-size: 11px;
  font-weight: 500;
`

export const ErrorMessage = styled.p`
  margin: 8px 0 0;
  color: #dc2626;
  font-size: 12px;
`

export const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #edf1f6;
  padding-top: 18px;
`

const Button = styled.button`
  height: 44px;
  border-radius: 10px;
  padding: 0 18px;
  cursor: pointer;
  font: inherit;
  font-size: 14px;
  font-weight: 700;

  &:disabled { cursor: wait; opacity: 0.55; }
  &:focus-visible { outline: 3px solid rgb(26 110 191 / 18%); outline-offset: 2px; }
`

export const CancelButton = styled(Button)`min-width: 88px; border: 1px solid #dde7f3; background: #fff; color: #526071;`
export const SaveButton = styled(Button)`min-width: 134px; border: 0; background: #1a6ebf; color: #fff;`
