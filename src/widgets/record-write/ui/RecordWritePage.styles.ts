import styled from 'styled-components'

export const Page = styled.main`
  width: 100%;
  min-width: 0;
  color: ${({ theme }) => theme.colors.text.strong};
`

export const Logo = styled.img`display: block;`

export const Content = styled.section`
  width: 100%;
  min-width: 0;
  padding-bottom: 60px;
`

export const Header = styled.header`
  margin-bottom: 24px;
  h1 { margin: 0; color: ${({ theme }) => theme.colors.text.strong}; font-size: 32px; line-height: 40px; }
  p { margin: 6px 0 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 15px; line-height: 22px; }
`

export const Layout = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  @media (max-width: 860px) { grid-template-columns: 1fr; }
`

export const Preview = styled.aside`
  display: flex;
  min-height: 560px;
  flex-direction: column;
  align-items: flex-start;
  overflow: hidden;
  border-radius: 20px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  img { display: block; width: 100%; height: 320px; border-radius: 12px; object-fit: cover; }
  p { margin: 12px 0 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 12px; }
  label { margin-top: 12px; border: 1px solid ${({ theme }) => theme.colors.brand.primary}; border-radius: 10px; padding: 10px 14px; color: ${({ theme }) => theme.colors.brand.primary}; cursor: pointer; font-size: 12px; font-weight: 700; }
  input { position: absolute; width: 1px; height: 1px; overflow: hidden; opacity: 0; }
  @media (max-width: 860px) { min-height: 320px; img { height: 220px; } }
`

export const Form = styled.form`
  display: flex;
  min-height: 560px;
  flex-direction: column;
  gap: 14px;
  border-radius: 20px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`

export const FormHeading = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 15px;
`

export const PlaceLabel = styled.p`
  margin: -6px 0 6px;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 12px;
`

export const BasicFields = styled.details`
  display: grid;
  gap: 14px;
  summary { cursor: pointer; color: var(--pt-text-muted); font-size: 12px; }
`

export const Field = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 6px;
  label { color: ${({ theme }) => theme.colors.text.strong}; font-size: 12px; font-weight: 600; }
  input, textarea { width: 100%; border: 1px solid ${({ theme }) => theme.colors.border.default}; border-radius: 12px; padding: 0 14px; color: ${({ theme }) => theme.colors.text.strong}; font: inherit; outline: none; }
  input { height: 46px; }
  textarea { min-height: 108px; padding-block: 14px; line-height: 1.6; resize: vertical; }
  input:focus, textarea:focus { border-color: ${({ theme }) => theme.colors.brand.primary}; box-shadow: 0 0 0 3px rgb(85 135 246 / 13%); }
`

export const DateFields = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  @media (max-width: 560px) { grid-template-columns: 1fr; }
`

export const ErrorMessage = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.status.error};
  font-size: 13px;
`

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: auto;
`
