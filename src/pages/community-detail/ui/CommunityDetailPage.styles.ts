import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const Page = styled.main`
  min-height: 100%;
  background: transparent;
  color: #191c1e;
`

export const Logo = styled.img`display: block;`

export const Content = styled.section`
  width: min(100%, 1120px);
  min-width: 0;
  margin: 0 auto;
  padding: 0 0 64px;

  @media (max-width: 47.9375rem) { padding: 0 0 48px; }
`

export const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
`

export const BackButton = styled.button`
  border: 0;
  padding: 8px 0;
  background: transparent;
  color: #1a6ebf;
  cursor: pointer;
  font: inherit;
  font-weight: 700;
`

export const WriteLink = styled(Link)`
  border-radius: 12px;
  padding: 11px 18px;
  background: #1a6ebf;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
`

export const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 300px;
  gap: 24px;
  align-items: start;

  @media (max-width: 64rem) { grid-template-columns: 1fr; }
`

export const Article = styled.article`
  position: relative;
  border: 1px solid #e1e9f3;
  border-radius: 24px;
  padding: 28px;
  background: #fff;
  box-shadow: 0 8px 20px rgb(13 31 64 / 7%);

  > h1 { margin: 12px 0 18px; color: #163954; font-size: clamp(25px, 3vw, 36px); line-height: 1.3; }
  > p { margin: 0; color: #424656; font-size: 17px; line-height: 1.8; white-space: pre-line; }

  @media (max-width: 47.9375rem) { border-radius: 18px; padding: 20px; }
`

export const OwnerActions = styled.div`
  position: absolute;
  top: 20px;
  right: 24px;
  display: flex;
  gap: 8px;
  button { border: 0; background: transparent; color: #5f6670; cursor: pointer; }
  button:last-child { color: #dc2626; }
`

export const EditForm = styled.form`
  display: grid;
  gap: 12px;
  margin-top: 20px;
  input, textarea { width: 100%; border: 1px solid #dce6f2; border-radius: 10px; padding: 12px; font: inherit; }
  textarea { min-height: 180px; resize: vertical; }
  div { display: flex; justify-content: flex-end; gap: 8px; }
  button { border: 0; border-radius: 8px; padding: 9px 16px; cursor: pointer; }
  button[type='submit'] { background: #1a6ebf; color: #fff; }
`

export const Author = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  img { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; }
  div { display: flex; flex-direction: column; }
  strong { font-size: 15px; }
  span { color: #727780; font-size: 12px; }
`

export const Destination = styled.span`
  display: inline-block;
  margin-top: 24px;
  border-radius: 999px;
  padding: 7px 12px;
  background: #eaf4ff;
  color: #1a6ebf;
  font-size: 13px;
  font-weight: 700;
`

export const ImageGrid = styled.div<{ $count: number }>`
  display: grid;
  grid-template-columns: ${({ $count }) => ($count > 1 ? 'repeat(2, minmax(0, 1fr))' : '1fr')};
  gap: 10px;
  margin-top: 26px;
  img { width: 100%; height: 240px; border-radius: 16px; object-fit: cover; }
  img:first-child:last-child { height: 360px; }

  @media (max-width: 40rem) {
    grid-template-columns: 1fr;
    img, img:first-child:last-child { height: 220px; }
  }
`

export const ReactionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
  margin-top: 24px;
  border-top: 1px solid #e7edf7;
  padding-top: 18px;
  color: #5f6670;
  font-size: 14px;
  button { border: 0; padding: 0; background: transparent; color: inherit; cursor: pointer; font: inherit; }
  button.active { color: #d82332; font-weight: 700; }
`

export const Comments = styled.aside`
  border: 1px solid #e1e9f3;
  border-radius: 22px;
  padding: 22px;
  background: #fff;
  h2 { margin: 0 0 16px; font-size: 20px; }
`

export const CommentForm = styled.form`
  display: flex;
  gap: 8px;
  margin-bottom: 14px;

  input { min-width: 0; height: 40px; flex: 1; border: 1px solid #dce6f2; border-radius: 10px; padding: 0 12px; }
  button { width: 64px; border: 0; border-radius: 10px; background: #1a6ebf; color: #fff; cursor: pointer; font-weight: 700; }
  button:disabled { cursor: not-allowed; opacity: 0.5; }
`

export const Comment = styled.article`
  border-top: 1px solid #eef2f7;
  padding: 16px 0;
  &:first-of-type { border-top: 0; padding-top: 0; }
  div { display: flex; justify-content: space-between; gap: 12px; }
  strong { font-size: 14px; }
  span { color: #8a9099; font-size: 11px; }
  p { margin: 8px 0 0; color: #424656; font-size: 14px; line-height: 1.55; }
`

export const CommentEdit = styled.div`
  display: flex;
  gap: 6px;
  margin-top: 8px;
  input { min-width: 0; flex: 1; border: 1px solid #dce6f2; border-radius: 8px; padding: 8px; }
  button { border: 0; border-radius: 8px; padding: 6px 9px; cursor: pointer; }
`

export const CommentActions = styled.div`
  display: flex;
  justify-content: flex-end !important;
  gap: 8px !important;
  margin-top: 6px;
  button { border: 0; padding: 0; background: transparent; color: #727780; cursor: pointer; font-size: 12px; }
  button:last-child { color: #dc2626; }
`

export const EmptyComment = styled.p`margin: 0; color: #8a9099; font-size: 14px;`

export const StateCard = styled.div`
  display: grid;
  min-height: 320px;
  place-items: center;
  align-content: center;
  gap: 10px;
  border: 1px solid #e1e9f3;
  border-radius: 24px;
  padding: 32px;
  background: #fff;
  color: #727780;
  text-align: center;
  h1, p { margin: 0; }
  h1 { color: #191c1e; font-size: 24px; }
  button { margin-top: 12px; border: 0; border-radius: 10px; padding: 12px 18px; background: #1a6ebf; color: #fff; cursor: pointer; }
`
