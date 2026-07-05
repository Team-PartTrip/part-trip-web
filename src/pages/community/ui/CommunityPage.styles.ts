import styled from 'styled-components'

export const Page = styled.main`
  display: flex;
  min-height: 1590px;
  align-items: flex-start;
  background: #f4f8fc;
  color: #191c1e;
`

export const Logo = styled.img`display: block;`

export const Content = styled.section`
  width: min(1271px, calc(100% - 241px));
  min-width: 0;
  padding: 28px 41px 80px 79px;

  > h1 { margin: 0; font-size: 32px; font-weight: 500; line-height: 48px; letter-spacing: -0.8px; }
`

export const Tabs = styled.div`
  display: inline-flex;
  gap: 8px;
  margin: 16px 0 40px 4px;
  border-radius: 999px;
  padding: 4px;
  background: #eceef0;

  button { height: 36px; border: 0; border-radius: 999px; padding: 0 24px; background: transparent; cursor: pointer; font: inherit; font-size: 14px; }
  button.active { background: #1a6ebf; color: #fff; box-shadow: 0 1px 1px rgb(0 0 0 / 5%); }
`

export const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(680px, 768px) 320px;
  gap: 23px;
  align-items: start;
`

export const Feed = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 350px);
  gap: 46px;
  padding: 0 20px;
`

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const Author = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  img { width: 40px; height: 40px; border-radius: 50%; object-fit: cover; }
  div { display: flex; flex-direction: column; }
  strong { font-size: 16px; font-weight: 400; line-height: 24px; }
  span { color: #717784; font-size: 12px; line-height: 16px; }
`

export const QuestionCard = styled.article`
  min-height: 302px;
  border: 1px solid #e4e2e2;
  border-radius: 20px;
  padding: 16px;
  background: #fff;
  box-shadow: 0 1px 2px rgb(0 0 0 / 5%);

  h2 { margin: 16px 0 8px; color: #005da6; font-size: 16px; line-height: 24px; }
  > p { margin: 0; font-size: 16px; font-weight: 500; line-height: 24px; word-break: keep-all; }
`

export const Reactions = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
  margin-top: 20px;
  color: #404752;
  font-size: 25px;

  span { display: flex; gap: 7px; align-items: center; }
  b { font-size: 16px; font-weight: 400; }
  .heart { color: #d82332; }
  .heart b { color: #404752; }
`

export const PhotoCard = styled.article`
  overflow: hidden;
  border: 1px solid rgb(192 199 212 / 30%);
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 1px 2px rgb(0 0 0 / 5%);

  > ${Author} { padding: 16px; }
  > ${Reactions} { margin: 0; padding: 8px 16px 16px; }
`

export const PhotoGrid = styled.div`
  display: grid;
  height: 316px;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 154px 154px;
  gap: 8px;
  padding: 0 16px;

  > img { width: 100%; height: 154px; border-radius: 12px; object-fit: cover; }
  > img:first-child { grid-row: 1; }
  > img:nth-child(2) { grid-column: 2; grid-row: 1; }
`

export const MorePhoto = styled.div`
  position: relative;
  grid-column: 2;
  grid-row: 2;
  overflow: hidden;
  border-radius: 12px;
  img { width: 100%; height: 154px; object-fit: cover; filter: brightness(55%); }
  span { position: absolute; inset: 0; display: grid; place-items: center; color: #fff; font-size: 20px; }
`

export const PhotoCopy = styled.div`
  padding: 16px 16px 0;
  h2 { margin: 0 0 8px; color: #005da6; font-size: 16px; line-height: 24px; }
  p { margin: 0; color: #424656; font-size: 16px; line-height: 24px; }
`

export const Aside = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: -16px;
`

export const CreateButton = styled.button`
  width: 320px;
  height: 56px;
  border: 0;
  border-radius: 24px;
  background: #1a6ebf;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  box-shadow: 0 10px 15px -3px rgb(0 80 203 / 20%);
`

export const Trending = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 1px solid #c2c6d8;
  border-radius: 32px;
  padding: 25px;
  background: #fff;

  header { display: flex; align-items: center; justify-content: space-between; }
  h2 { margin: 0; font-size: 20px; font-weight: 500; line-height: 28px; }
  header button { border: 0; padding: 0; background: transparent; color: #0050cb; cursor: pointer; font-size: 12px; }
`

export const Destination = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  img { width: 64px; height: 64px; border-radius: 16px; object-fit: cover; }
  div { display: flex; flex: 1; flex-direction: column; }
  strong { font-size: 14px; font-weight: 500; line-height: 20px; }
  span { color: #424656; font-size: 12px; line-height: 16px; }
`
