import styled from 'styled-components'

export const Page = styled.main`
  min-height: 100%;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.strong};
`

export const Logo = styled.img`display: block;`

export const Content = styled.section`
  width: 100%;
  min-width: 0;
  margin: 0 auto;
  padding: 0 0 60px;
  @media (max-width: 47.9375rem) { padding: 24px 18px 48px; }
`

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  h1 { margin: 0; font-size: 32px; }
  p { margin: 6px 0 0; color: var(--pt-text-muted); }
  > button { border: 0; background: transparent; color: var(--pt-text-muted); cursor: pointer; font: inherit; }
`

export const Layout = styled.div`
  display: grid;
  grid-template-columns: 330px minmax(0, 1fr);
  gap: 24px;
  align-items: start;
  @media (max-width: 58rem) { grid-template-columns: 1fr; }
`

export const Preview = styled.aside`
  display: flex;
  min-height: 420px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 24px;
  padding: 24px;
  background: linear-gradient(145deg, var(--pt-bg-muted), var(--pt-bg-subtle) 55%, var(--pt-border-subtle));
  color: var(--pt-text-strong);
  text-align: center;
  div { display: grid; width: 64px; height: 64px; place-items: center; border-radius: 50%; background: var(--pt-bg-default); color: var(--pt-brand-primary); font-size: 28px; box-shadow: 0 10px 30px rgb(26 110 191 / 20%); }
  strong { margin-top: 22px; font-size: 22px; }
  span { margin-top: 8px; color: var(--pt-text-muted); font-size: 13px; }
  @media (max-width: 58rem) { min-height: 240px; }
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  border: 1px solid var(--pt-border-subtle);
  border-radius: 24px;
  padding: 28px;
  background: var(--pt-bg-default);
  box-shadow: 0 8px 20px rgb(13 31 64 / 7%);
  @media (max-width: 47.9375rem) { border-radius: 18px; padding: 20px; }
`

export const Field = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 8px;
  label { font-size: 14px; font-weight: 700; }
  input, textarea { width: 100%; border: 1px solid var(--pt-border-default); border-radius: 12px; padding: 0 14px; color: var(--pt-text-strong); font: inherit; outline: none; }
  input { height: 48px; }
  textarea { min-height: 170px; padding-block: 14px; line-height: 1.6; resize: vertical; }
  input:focus, textarea:focus { border-color: var(--pt-brand-primary); box-shadow: 0 0 0 3px rgb(85 135 246 / 13%); }
`

export const DateFields = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  @media (max-width: 34rem) { grid-template-columns: 1fr; }
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
