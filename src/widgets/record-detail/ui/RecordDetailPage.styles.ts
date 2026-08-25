import styled from 'styled-components'

export const Page = styled.main`
  min-height: 100%;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.strong};
`

export const Content = styled.section`
  width: min(100%, 1200px);
  min-width: 0;
  margin: 0 auto;
  padding: 0 0 60px;
  @media (max-width: 47.9375rem) { padding: 0 0 48px; }
`

export const TopBar = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 22px;
  gap: 16px;
  h1 { margin: 0; color: ${({ theme }) => theme.colors.text.strong}; font-size: 32px; line-height: 40px; }
  p { margin: 6px 0 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 15px; }
  > div:last-child { display: flex; flex-wrap: wrap; gap: 8px; }
  button { border: 0; border-radius: 10px; padding: 10px 14px; background: transparent; color: #1a6ebf; cursor: pointer; font: inherit; font-weight: 700; }
  button:last-child { background: #1a6ebf; color: #fff; }
`

export const ErrorMessage = styled.p`
  margin: 0 0 16px;
  border-radius: 10px;
  padding: 12px 16px;
  background: #fff1f2;
  color: #b42318;
`

export const EditForm = styled.form`
  display: grid;
  gap: 18px;
  border: 1px solid #e1e9f3;
  border-radius: 24px;
  padding: 28px;
  background: #fff;
  h1 { margin: 0; }
  label { display: grid; gap: 8px; font-weight: 700; }
  input, textarea { width: 100%; border: 1px solid #dce6f2; border-radius: 10px; padding: 12px; font: inherit; }
  textarea { min-height: 180px; resize: vertical; }
  > div:last-child { display: flex; justify-content: flex-end; gap: 8px; }
  button { border: 0; border-radius: 9px; padding: 10px 18px; cursor: pointer; }
  button[type='submit'] { background: #1a6ebf; color: #fff; }
`

export const DateFields = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  @media (max-width: 36rem) { grid-template-columns: 1fr; }
`

export const Layout = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  align-items: start;
`

export const DetailBody = styled.section`
  display: grid;
  height: 560px;
  gap: 24px;
  grid-template-columns: minmax(0, 1fr) 456px;
  @media (max-width: 900px) { height: auto; grid-template-columns: 1fr; }
`

export const RecordPhoto = styled.div`
  min-width: 0;
  overflow: hidden;
  border-radius: 28px;
  background: #dcecf6;
  img { display: block; width: 100%; height: 560px; object-fit: cover; }
  @media (max-width: 900px) { img { height: 360px; } }
`

export const RecordDetailCard = styled.section`
  display: flex;
  min-width: 0;
  height: 560px;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  overflow: hidden;
  border-radius: 28px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  h1 { margin: 0; color: ${({ theme }) => theme.colors.text.strong}; font-size: 26px; line-height: 32px; }
  p { margin: 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 14px; }
  button { margin-top: 4px; min-height: 46px; border: 1px solid ${({ theme }) => theme.colors.brand.strong}; border-radius: 12px; padding: 12px 24px; background: ${({ theme }) => theme.colors.background.default}; color: ${({ theme }) => theme.colors.brand.strong}; cursor: pointer; font-weight: 600; }
  @media (max-width: 900px) { height: auto; min-height: 260px; }
`

export const Badge = styled.span`
  border-radius: 999px;
  padding: 4px 8px;
  background: #e8f2ff;
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 12px;
`

export const RecordDescription = styled.p`
  max-width: 100%;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 15px !important;
  line-height: 22px;
`

export const Body = styled.section`
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 20px;
  grid-column: 1;
  @media (max-width: 44rem) { grid-template-columns: 1fr; }
`

const Panel = styled.section`
  border: 1px solid #e1e9f3;
  border-radius: 20px;
  padding: 22px;
  background: #fff;
  h2 { margin: 0 0 14px; font-size: 20px; }
`

export const Schedule = styled(Panel)`
  article { display: grid; grid-template-columns: 72px 1fr; gap: 12px; border-top: 1px solid #edf2f7; padding: 14px 0; }
  article:first-of-type { border-top: 0; padding-top: 0; }
  strong { color: #1a6ebf; font-size: 13px; }
  ul { margin: 0; padding-left: 18px; color: #5f6670; font-size: 14px; line-height: 1.7; }
`

export const MapPanel = styled.aside`
  position: relative;
  grid-column: 2;
  grid-row: 1 / span 2;
  height: 100%;
  min-height: 540px;
  overflow: hidden;
  border: 1px solid #d8e4f0;
  border-radius: 24px;
  background: #dcecf6;
  > div:last-child { position: absolute; right: 20px; bottom: 20px; left: 20px; display: flex; flex-direction: column; border-radius: 14px; padding: 14px; background: rgb(255 255 255 / 92%); }
  span { color: #727780; font-size: 12px; }
  @media (max-width: 61.25rem) { grid-column: 1; grid-row: auto; min-height: 300px; }
`

export const MapGrid = styled.div`
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgb(255 255 255 / 45%) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 45%) 1px, transparent 1px), linear-gradient(35deg, transparent 44%, #b5d5e8 45% 48%, transparent 49%);
  background-size: 42px 42px, 42px 42px, 180px 180px;
`

export const MapPin = styled.span`
  position: absolute;
  top: 42%;
  left: 52%;
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border: 8px solid rgb(255 255 255 / 85%);
  border-radius: 50%;
  background: #1a6ebf;
  color: #fff !important;
  box-shadow: 0 8px 20px rgb(26 110 191 / 35%);
`

export const StateCard = styled.div`
  display: grid;
  min-height: 360px;
  place-items: center;
  align-content: center;
  gap: 10px;
  border-radius: 24px;
  padding: 30px;
  background: #fff;
  color: #727780;
  text-align: center;
  h1, p { margin: 0; }
  h1 { color: #111827; font-size: 24px; }
  button { margin-top: 10px; border: 0; border-radius: 10px; padding: 12px 18px; background: #1a6ebf; color: #fff; cursor: pointer; }
`
