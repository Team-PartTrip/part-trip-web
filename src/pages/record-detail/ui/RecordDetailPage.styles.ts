import styled from 'styled-components'

export const Page = styled.main`
  display: flex;
  min-height: 100dvh;
  background: #f4f8fc;
  color: #111827;
  @media (max-width: 47.9375rem) { flex-direction: column; }
`

export const Logo = styled.img`display: block;`

export const Content = styled.section`
  width: min(100%, 1140px);
  min-width: 0;
  margin: 0 auto;
  padding: 30px 42px 60px;
  @media (max-width: 47.9375rem) { padding: 24px 18px 48px; }
`

export const TopBar = styled.header`
  display: flex;
  justify-content: space-between;
  margin-bottom: 22px;
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
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 24px;
  align-items: start;
  @media (max-width: 61.25rem) { grid-template-columns: 1fr; }
`

export const Hero = styled.section`
  position: relative;
  min-height: 360px;
  overflow: hidden;
  border-radius: 26px;
  background: #142536;
  img { width: 100%; height: 360px; object-fit: cover; }
  &::after { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 30%, rgb(9 24 38 / 78%)); content: ''; }
  @media (max-width: 40rem) { min-height: 280px; img { height: 280px; } }
`

export const HeroOverlay = styled.div`
  position: absolute;
  z-index: 1;
  right: 28px;
  bottom: 26px;
  left: 28px;
  color: #fff;
  span { display: inline-block; border-radius: 999px; padding: 6px 10px; background: rgb(255 255 255 / 20%); font-size: 13px; }
  h1 { margin: 12px 0 6px; font-size: clamp(26px, 4vw, 40px); line-height: 1.2; }
  p { margin: 0; color: #dceafa; font-size: 14px; }
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

export const Memo = styled(Panel)`p { margin: 0; color: #5f6670; line-height: 1.7; }`

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
