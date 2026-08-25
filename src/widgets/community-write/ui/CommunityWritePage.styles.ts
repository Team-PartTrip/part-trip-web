import styled from 'styled-components'

export const Page = styled.main`
  min-height: 100%;
  background: transparent;
  color: #191c1e;
`

export const Logo = styled.img`display: block;`

export const Content = styled.section`
  width: min(100%, 940px);
  min-width: 0;
  margin: 0 auto;
  padding: 0 0 64px;
  @media (max-width: 47.9375rem) { padding: 0 0 48px; }
`

export const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
  h1 { margin: 0; font-size: 32px; }
  p { margin: 6px 0 0; color: #727780; }
  > button { border: 0; padding: 10px; background: transparent; color: #727780; cursor: pointer; font: inherit; }
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 22px;
  border: 1px solid #e1e9f3;
  border-radius: 24px;
  padding: 30px;
  background: #fff;
  box-shadow: 0 8px 20px rgb(13 31 64 / 7%);
  @media (max-width: 47.9375rem) { border-radius: 18px; padding: 20px; }
`

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
  label, > span { font-size: 14px; font-weight: 700; }
  input, textarea, select { width: 100%; border: 1px solid #dce5f0; border-radius: 12px; padding: 0 14px; color: #191c1e; font: inherit; outline: none; }
  input, select { height: 48px; }
  textarea { min-height: 220px; padding-block: 14px; line-height: 1.6; resize: vertical; }
  input:focus, textarea:focus, select:focus { border-color: #5587f6; box-shadow: 0 0 0 3px rgb(85 135 246 / 13%); }
`

export const CategoryRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  button { height: 38px; border: 1px solid #dce5f0; border-radius: 999px; padding: 0 16px; background: #fff; color: #5f6670; cursor: pointer; }
  button.active { border-color: #1a6ebf; background: #eaf4ff; color: #1a6ebf; font-weight: 700; }
`

export const UploadArea = styled.div`
  display: flex;
  min-height: 72px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border: 1px dashed #b8c8da;
  border-radius: 14px;
  padding: 16px;
  color: #727780;
  font-size: 14px;
  label { border-radius: 10px; padding: 10px 14px; background: #eef6ff; color: #1a6ebf; cursor: pointer; font-weight: 700; }
  input { position: absolute; width: 1px; height: 1px; overflow: hidden; opacity: 0; }
  @media (max-width: 32rem) { align-items: flex-start; flex-direction: column; }
`

export const ErrorMessage = styled.p`margin: 0; color: #dc2626; font-size: 14px;`

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  button { min-width: 120px; height: 48px; border: 1px solid #dce5f0; border-radius: 12px; background: #fff; color: #5f6670; cursor: pointer; font: inherit; font-weight: 700; }
  button[type='submit'] { border-color: #1a6ebf; background: #1a6ebf; color: #fff; }
  button:disabled { cursor: not-allowed; opacity: 0.65; }
  @media (max-width: 32rem) { button { min-width: 0; flex: 1; } }
`
