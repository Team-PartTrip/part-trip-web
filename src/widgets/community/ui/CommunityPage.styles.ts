import styled from 'styled-components'
import { Skeleton } from '@/shared/ui/parttrip'

export const Page = styled.main`
  min-height: 100%;
  background: transparent;
  color: var(--pt-text-strong);
`

export const Logo = styled.img`display: block;`

export const Content = styled.section`
  width: 100%;
  min-width: 0;
  padding: 0 0 80px;

  > h1 { margin: 0; font-size: 32px; font-weight: 500; line-height: 48px; letter-spacing: -0.8px; }

  @media (max-width: 74.9375rem) {
    padding: 28px 32px 64px;
  }

  @media (max-width: 63.9375rem) {
    padding-inline: 24px;
  }

  @media (max-width: 47.9375rem) {
    padding: 24px 18px 48px;
  }
`

export const Tabs = styled.div`
  display: inline-flex;
  gap: 8px;
  margin: 16px 0 40px 4px;
  border-radius: 999px;
  padding: 4px;
  background: var(--pt-border-subtle);

  button { height: 36px; border: 0; border-radius: 999px; padding: 0 24px; background: transparent; cursor: pointer; font: inherit; font-size: 14px; }
  button.active { background: var(--pt-brand-primary); color: var(--pt-text-inverse); box-shadow: 0 1px 1px rgb(0 0 0 / 5%); }
`

export const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(680px, 768px) 320px;
  gap: 23px;
  align-items: start;

  @media (max-width: 81.25rem) {
    grid-template-columns: 1fr;
  }
`

export const Feed = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 46px;
  padding: 0 20px;

  @media (max-width: 63.9375rem) {
    grid-template-columns: 1fr;
    gap: 24px;
    padding: 0;
  }
`

export const FeedStatus = styled.p`
  grid-column: 1 / -1;
  margin: 2rem 0;
  color: var(--pt-text-muted);
  text-align: center;
`

export const FeedLoading = styled.div`
  display: grid;
  grid-column: 1 / -1;
  gap: 24px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
`

export const LoadingPost = styled(Skeleton)`
  height: 302px;
  border-radius: 20px;
`

export const PostButton = styled.button`
  display: block;
  width: 100%;
  border: 0;
  padding: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  text-align: left;
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
  span { color: var(--pt-text-muted); font-size: 12px; line-height: 16px; }
`

export const QuestionCard = styled.article`
  min-height: 302px;
  border: 1px solid var(--pt-border-default);
  border-radius: 20px;
  padding: 16px;
  background: var(--pt-bg-default);
  box-shadow: 0 1px 2px rgb(0 0 0 / 5%);

  h2 { margin: 16px 0 8px; color: var(--pt-brand-primary); font-size: 16px; line-height: 24px; }
  > p { margin: 0; font-size: 16px; font-weight: 500; line-height: 24px; word-break: keep-all; }
`

export const Reactions = styled.div`
  display: flex;
  gap: 24px;
  align-items: center;
  margin-top: 20px;
  color: var(--pt-text-muted);
  font-size: 25px;

  span { display: flex; gap: 7px; align-items: center; }
  b { font-size: 16px; font-weight: 400; }
  .heart { color: var(--pt-status-error); }
  .heart b { color: var(--pt-text-muted); }
`

export const PhotoCard = styled.article`
  overflow: hidden;
  border: 1px solid rgb(192 199 212 / 30%);
  border-radius: 10px;
  background: var(--pt-bg-default);
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
  span { position: absolute; inset: 0; display: grid; place-items: center; color: var(--pt-text-inverse); font-size: 20px; }
`

export const PhotoCopy = styled.div`
  padding: 16px 16px 0;
  h2 { margin: 0 0 8px; color: var(--pt-brand-primary); font-size: 16px; line-height: 24px; }
  p { margin: 0; color: var(--pt-text-muted); font-size: 16px; line-height: 24px; }
`

export const Aside = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: -16px;

  @media (max-width: 81.25rem) {
    display: grid;
    grid-template-columns: minmax(220px, 320px) minmax(0, 1fr);
    margin: 0 20px;
  }

  @media (max-width: 47.9375rem) {
    grid-template-columns: 1fr;
    margin: 0;
  }
`

export const CreateButton = styled.button`
  width: 100%;
  height: 56px;
  border: 0;
  border-radius: 24px;
  background: var(--pt-brand-primary);
  color: var(--pt-text-inverse);
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  box-shadow: 0 10px 15px -3px rgb(0 80 203 / 20%);
`

export const Trending = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 1px solid var(--pt-border-default);
  border-radius: 32px;
  padding: 25px;
  background: var(--pt-bg-default);

  header { display: flex; align-items: center; justify-content: space-between; }
  h2 { margin: 0; font-size: 20px; font-weight: 500; line-height: 28px; }
  header button { border: 0; padding: 0; background: transparent; color: var(--pt-brand-primary); cursor: pointer; font-size: 12px; }
`

export const Destination = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  img { width: 64px; height: 64px; border-radius: 16px; object-fit: cover; }
  div { display: flex; flex: 1; flex-direction: column; }
  strong { font-size: 14px; font-weight: 500; line-height: 20px; }
  span { color: var(--pt-text-muted); font-size: 12px; line-height: 16px; }
`
