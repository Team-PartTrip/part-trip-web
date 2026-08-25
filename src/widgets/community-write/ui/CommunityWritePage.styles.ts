import styled from 'styled-components'

export const Page = styled.main`
  min-height: 100%;
  background: transparent;
  color: var(--pt-text-strong);
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
  p { margin: 6px 0 0; color: var(--pt-text-muted); }
  > button { border: 0; padding: 10px; background: transparent; color: var(--pt-text-muted); cursor: pointer; font: inherit; }
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 22px;
  border: 1px solid var(--pt-border-subtle);
  border-radius: 24px;
  padding: 30px;
  background: var(--pt-bg-default);
  box-shadow: 0 8px 20px rgb(13 31 64 / 7%);
  @media (max-width: 47.9375rem) { border-radius: 18px; padding: 20px; }
`

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
  label, > span { font-size: 14px; font-weight: 700; }
  input, textarea, select { width: 100%; border: 1px solid var(--pt-border-default); border-radius: 12px; padding: 0 14px; color: var(--pt-text-strong); font: inherit; outline: none; }
  input, select { height: 48px; }
  textarea { min-height: 220px; padding-block: 14px; line-height: 1.6; resize: vertical; }
  input:focus, textarea:focus, select:focus { border-color: var(--pt-brand-primary); box-shadow: 0 0 0 3px rgb(85 135 246 / 13%); }
`

export const CategoryRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  button { height: 38px; border: 1px solid var(--pt-border-default); border-radius: 999px; padding: 0 16px; background: var(--pt-bg-default); color: var(--pt-text-muted); cursor: pointer; }
  button.active { border-color: var(--pt-brand-primary); background: var(--pt-bg-info); color: var(--pt-brand-primary); font-weight: 700; }
`

export const UploadArea = styled.div`
  display: flex;
  min-height: 72px;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border: 1px dashed var(--pt-border-default);
  border-radius: 14px;
  padding: 16px;
  color: var(--pt-text-muted);
  font-size: 14px;
  label { border-radius: 10px; padding: 10px 14px; background: var(--pt-bg-info); color: var(--pt-brand-primary); cursor: pointer; font-weight: 700; }
  input { position: absolute; width: 1px; height: 1px; overflow: hidden; opacity: 0; }
  @media (max-width: 32rem) { align-items: flex-start; flex-direction: column; }
`

export const ErrorMessage = styled.p`margin: 0; color: var(--pt-status-error); font-size: 14px;`

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  button { min-width: 120px; height: 48px; border: 1px solid var(--pt-border-default); border-radius: 12px; background: var(--pt-bg-default); color: var(--pt-text-muted); cursor: pointer; font: inherit; font-weight: 700; }
  button[type='submit'] { border-color: var(--pt-brand-primary); background: var(--pt-brand-primary); color: var(--pt-text-inverse); }
  button:disabled { cursor: not-allowed; opacity: 0.65; }
  @media (max-width: 32rem) { button { min-width: 0; flex: 1; } }
`
