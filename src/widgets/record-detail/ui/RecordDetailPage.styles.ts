import styled from 'styled-components'
import { Skeleton } from '@/shared/ui/parttrip'

export const LoadingLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const LoadingHeader = styled(Skeleton)`
  width: 220px;
  height: 68px;
`

export const LoadingBody = styled.div`
  display: grid;
  gap: 24px;
  margin: 0 24px;
  grid-template-columns: minmax(0, 696px) 432px;
`

export const LoadingPhoto = styled(Skeleton)`
  height: 560px;
  border-radius: 28px;
`

export const LoadingDetail = styled(Skeleton)`
  height: 560px;
  border-radius: 16px;
`

export const Page = styled.main`
  min-height: 100%;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.strong};
`

export const Content = styled.section`
  width: 100%;
  min-width: 0;
  padding: 0 0 60px;
  @media (max-width: 47.9375rem) { padding: 0 0 48px; }
`

export const TopBar = styled.header<{ $comment?: boolean }>`
  display: flex;
  min-height: ${({ $comment }) => ($comment ? '48px' : '68px')};
  align-items: flex-start;
  justify-content: space-between;
  margin: ${({ $comment }) => ($comment ? '32px 32px 24px' : '24px 0 24px')};
  padding-inline: 24px;
  gap: 16px;
  h1 { margin: 0; color: ${({ theme }) => theme.colors.text.strong}; font-size: 30px; line-height: 38px; }
  p { margin: 6px 0 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 15px; line-height: 22px; }
  > div:first-child { display: flex; flex-direction: column; gap: 6px; }
  > div:last-child:not(:first-child) { display: flex; flex-wrap: wrap; gap: 8px; }
  button { width: 112px; height: 48px; border: 1px solid var(--pt-brand-primary); border-radius: 14px; padding: 0 14px; background: var(--pt-bg-default); color: var(--pt-brand-primary); cursor: pointer; font: inherit; font-size: 14px; font-weight: 600; }
  button:disabled { cursor: not-allowed; opacity: .56; }
`

export const ErrorMessage = styled.p`
  margin: 0 0 16px;
  border-radius: 10px;
  padding: 12px 16px;
  background: var(--pt-bg-error);
  color: var(--pt-status-error);
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
  margin: 0 24px;
  grid-template-columns: minmax(0, 696px) 432px;
  @media (max-width: 900px) { height: auto; grid-template-columns: 1fr; }
`

export const RecordPhoto = styled.div`
  position: relative;
  min-width: 0;
  overflow: hidden;
  border-radius: 28px;
  background: var(--pt-bg-muted);
  img { display: block; width: 100%; height: 560px; aspect-ratio: 696 / 560; object-fit: cover; }
  @media (max-width: 900px) { img { height: 360px; } }
`

export const PhotoControls = styled.div`
  position: absolute;
  right: auto;
  bottom: 18px;
  left: 24px;
  display: flex;
  width: 180px;
  height: 40px;
  overflow: hidden;
  align-items: stretch;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`

export const PhotoButton = styled.button`
  flex: 1;
  border: 0;
  padding: 0 10px;
  background: transparent;
  color: ${({ theme }) => theme.colors.brand.strong};
  cursor: pointer;
  font-size: 12px;
  &:disabled { color: ${({ theme }) => theme.colors.text.muted}; cursor: not-allowed; opacity: .5; }
`

export const RecordDetailCard = styled.section`
  display: flex;
  min-width: 0;
  height: 560px;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 16px;
  padding: 24px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  h1 { margin: 0; color: ${({ theme }) => theme.colors.text.strong}; font-size: 26px; line-height: 32px; }
  p { margin: 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 14px; }
  > span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 12px; }
  button { min-height: 46px; border: 1px solid ${({ theme }) => theme.colors.brand.strong}; border-radius: 12px; padding: 12px 24px; background: ${({ theme }) => theme.colors.background.default}; color: ${({ theme }) => theme.colors.brand.strong}; cursor: pointer; font-size: 15px; font-weight: 600; }
  button:disabled { cursor: not-allowed; opacity: .56; }
  @media (max-width: 900px) { height: auto; min-height: 260px; }
`

export const Badge = styled.span`
  border-radius: 999px;
  padding: 4px 8px;
  background: var(--pt-bg-info);
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 12px;
`

export const RecordDescription = styled.p`
  max-width: 100%;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 15px !important;
  line-height: 22px;
`

export const CommentHeading = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 15px;
  line-height: 22px;
`

export const RecordAction = styled.button`
  width: 107px;
  height: 46px;
  flex: 0 0 46px;
`

export const CommentEditLayout = styled.div`
  display: grid;
  margin: 0 32px;
  gap: 24px;
  grid-template-columns: 430px minmax(0, 682px);
  @media (max-width: 860px) { grid-template-columns: 1fr; }
`

export const CommentPhoto = styled.section`
  display: flex;
  width: 430px;
  height: 526px;
  box-sizing: border-box;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  border: 1px solid #dceaf7;
  border-radius: 16px;
  padding: 20px;
  background: var(--pt-bg-default);
  img { display: block; width: 382px; height: 420px; border-radius: 16px; object-fit: cover; }
  h2 { margin: 0; color: var(--pt-text-strong); font-size: 18px; line-height: 22px; }
  span { color: var(--pt-text-muted); font-size: 13px; line-height: 16px; }
  @media (max-width: 860px) { width: 100%; height: auto; img { width: 100%; height: min(420px, 70vw); } }
`

export const CommentForm = styled.form`
  display: flex;
  width: 682px;
  height: 400px;
  box-sizing: border-box;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  border-radius: 16px;
  padding: 24px;
  background: var(--pt-bg-default);
  box-shadow: 0 2px 12px rgb(16 42 66 / 8%);
  h2 { margin: 0; color: var(--pt-text-strong); font-size: 18px; line-height: 22px; }
  p { order: 3; margin: 0; color: var(--pt-text-muted); font-size: 12px; line-height: 15px; }
  textarea { width: 100%; height: 220px; min-height: 220px; resize: none; border: 1px solid var(--pt-border-default); border-radius: 16px; padding: 14px 16px; color: var(--pt-text-strong); font: inherit; }
  button { order: 4; width: 180px; height: 48px; border: 0; border-radius: 14px; padding: 0 16px; background: var(--pt-brand-primary); color: var(--pt-text-inverse); cursor: pointer; font-size: 14px; font-weight: 600; }
  small { color: var(--pt-status-error); font-size: 12px; }
  @media (max-width: 860px) { width: 100%; height: auto; min-height: 400px; }
`

export const EditHistory = styled.section`
  margin-top: 24px;
  border-radius: 20px;
  padding: 24px;
  background: var(--pt-bg-default);
  box-shadow: 0 2px 12px rgb(16 42 66 / 8%);
  h2 { margin: 0 0 12px; color: var(--pt-text-strong); font-size: 15px; }
  div { display: flex; justify-content: space-between; border-bottom: 1px solid var(--pt-border-subtle); padding: 8px 0; font-size: 12px; }
  div span, p { color: var(--pt-text-muted); }
  p { margin: 12px 0 0; font-size: 11px; }
`

export const Body = styled.section`
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 20px;
  grid-column: 1;
  @media (max-width: 44rem) { grid-template-columns: 1fr; }
`

const Panel = styled.section`
  border: 1px solid var(--pt-border-subtle);
  border-radius: 20px;
  padding: 22px;
  background: var(--pt-bg-default);
  h2 { margin: 0 0 14px; font-size: 20px; }
`

export const Schedule = styled(Panel)`
  article { display: grid; grid-template-columns: 72px 1fr; gap: 12px; border-top: 1px solid var(--pt-border-subtle); padding: 14px 0; }
  article:first-of-type { border-top: 0; padding-top: 0; }
  strong { color: var(--pt-brand-primary); font-size: 13px; }
  ul { margin: 0; padding-left: 18px; color: var(--pt-text-muted); font-size: 14px; line-height: 1.7; }
`

export const MapPanel = styled.aside`
  position: relative;
  grid-column: 2;
  grid-row: 1 / span 2;
  height: 100%;
  min-height: 540px;
  overflow: hidden;
  border: 1px solid var(--pt-border-subtle);
  border-radius: 24px;
  background: var(--pt-bg-muted);
  > div:last-child { position: absolute; right: 20px; bottom: 20px; left: 20px; display: flex; flex-direction: column; border-radius: 14px; padding: 14px; background: rgb(255 255 255 / 92%); }
  span { color: var(--pt-text-muted); font-size: 12px; }
  @media (max-width: 61.25rem) { grid-column: 1; grid-row: auto; min-height: 300px; }
`

export const MapGrid = styled.div`
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgb(255 255 255 / 45%) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 45%) 1px, transparent 1px), linear-gradient(35deg, transparent 44%, var(--pt-border-subtle) 45% 48%, transparent 49%);
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
  background: var(--pt-brand-primary);
  color: var(--pt-text-inverse) !important;
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
  background: var(--pt-bg-default);
  color: var(--pt-text-muted);
  text-align: center;
  h1, p { margin: 0; }
  h1 { color: var(--pt-text-strong); font-size: 24px; }
  button { margin-top: 10px; border: 0; border-radius: 10px; padding: 12px 18px; background: var(--pt-brand-primary); color: var(--pt-text-inverse); cursor: pointer; }
`
