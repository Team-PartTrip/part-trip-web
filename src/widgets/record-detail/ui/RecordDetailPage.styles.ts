import styled from 'styled-components'
import { Skeleton } from '@/shared/ui/parttrip'

export const LoadingLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`

export const LoadingHeader = styled(Skeleton)`
  width: 13.75rem;
  height: 4.25rem;
`

export const LoadingBody = styled.div`
  display: grid;
  gap: 1.5rem;
  margin: 0 1.5rem;
  grid-template-columns: minmax(0, 43.5rem) 27rem;
`

export const LoadingPhoto = styled(Skeleton)`
  height: 35rem;
  border-radius: 1.75rem;
`

export const LoadingDetail = styled(Skeleton)`
  height: 35rem;
  border-radius: 1rem;
`

export const Page = styled.main`
  min-height: 100%;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.strong};
`

export const Content = styled.section`
  width: 100%;
  min-width: 0;
  padding: 0 0 3.75rem;
  @media (max-width: 47.9375rem) { padding: 0 0 3rem; }
`

export const TopBar = styled.header<{ $comment?: boolean }>`
  display: flex;
  min-height: ${({ $comment }) => ($comment ? '3rem' : '4.25rem')};
  align-items: flex-start;
  justify-content: space-between;
  margin: ${({ $comment }) => ($comment ? '2rem 2rem 1.5rem' : '1.5rem 0 1.5rem')};
  padding-inline: 1.5rem;
  gap: 1rem;
  h1 { margin: 0; color: ${({ theme }) => theme.colors.text.strong}; font-size: 1.875rem; line-height: 2.375rem; }
  p { margin: 0.375rem 0 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.9375rem; line-height: 1.375rem; }
  > div:first-child { display: flex; flex-direction: column; gap: 0.375rem; }
  > div:last-child:not(:first-child) { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  button { width: 7rem; height: 3rem; border: 0.0625rem solid var(--pt-brand-primary); border-radius: 0.875rem; padding: 0 0.875rem; background: var(--pt-bg-default); color: var(--pt-brand-primary); cursor: pointer; font: inherit; font-size: 0.875rem; font-weight: 600; }
  button:disabled { cursor: not-allowed; opacity: .56; }
`

export const ErrorMessage = styled.p`
  margin: 0 0 1rem;
  border-radius: 0.625rem;
  padding: 0.75rem 1rem;
  background: var(--pt-bg-error);
  color: var(--pt-status-error);
`

export const DetailBody = styled.section`
  display: grid;
  height: 35rem;
  gap: 1.5rem;
  margin: 0 1.5rem;
  grid-template-columns: minmax(0, 43.5rem) 27rem;
  @media (max-width: 56.25rem) { height: auto; grid-template-columns: 1fr; }
`

export const RecordPhoto = styled.div`
  position: relative;
  min-width: 0;
  overflow: hidden;
  border-radius: 1.75rem;
  background: var(--pt-bg-muted);
  img { display: block; width: 100%; height: 35rem; aspect-ratio: 696 / 560; object-fit: cover; }
  @media (max-width: 56.25rem) { img { height: 22.5rem; } }
`

export const PhotoControls = styled.div`
  position: absolute;
  right: auto;
  bottom: 1.125rem;
  left: 1.5rem;
  display: flex;
  width: 11.25rem;
  height: 2.5rem;
  overflow: hidden;
  align-items: stretch;
  border-radius: 62.4375rem;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`

export const PhotoButton = styled.button`
  flex: 1;
  border: 0;
  padding: 0 0.625rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.brand.strong};
  cursor: pointer;
  font-size: 0.75rem;
  &:disabled { color: ${({ theme }) => theme.colors.text.muted}; cursor: not-allowed; opacity: .5; }
`

export const RecordDetailCard = styled.section`
  display: flex;
  min-width: 0;
  height: 35rem;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  overflow: hidden;
  border: 0.0625rem solid ${({ theme }) => theme.colors.border.subtle};
  border-radius: 1rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
  h1 { margin: 0; color: ${({ theme }) => theme.colors.text.strong}; font-size: 1.625rem; line-height: 2rem; }
  p { margin: 0; color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.875rem; }
  > span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 0.75rem; }
  button { min-height: 2.875rem; border: 0.0625rem solid ${({ theme }) => theme.colors.brand.strong}; border-radius: 0.75rem; padding: 0.75rem 1.5rem; background: ${({ theme }) => theme.colors.background.default}; color: ${({ theme }) => theme.colors.brand.strong}; cursor: pointer; font-size: 0.9375rem; font-weight: 600; }
  button:disabled { cursor: not-allowed; opacity: .56; }
  @media (max-width: 56.25rem) { height: auto; min-height: 16.25rem; }
`

export const Badge = styled.span`
  border-radius: 62.4375rem;
  padding: 0.25rem 0.5rem;
  background: var(--pt-bg-info);
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 0.75rem;
`

export const RecordDescription = styled.p`
  max-width: 100%;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.9375rem !important;
  line-height: 1.375rem;
`

export const CommentHeading = styled.span`
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 0.9375rem;
  line-height: 1.375rem;
`

export const RecordAction = styled.button`
  width: 6.6875rem;
  height: 2.875rem;
  flex: 0 0 2.875rem;
`

export const CommentEditLayout = styled.div`
  display: grid;
  margin: 0 2rem;
  gap: 1.5rem;
  grid-template-columns: 26.875rem minmax(0, 42.625rem);
  @media (max-width: 53.75rem) { grid-template-columns: 1fr; }
`

export const CommentPhoto = styled.section`
  display: flex;
  width: 26.875rem;
  height: 32.875rem;
  box-sizing: border-box;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.875rem;
  border: 0.0625rem solid #dceaf7;
  border-radius: 1rem;
  padding: 1.25rem;
  background: var(--pt-bg-default);
  img { display: block; width: 23.875rem; height: 26.25rem; border-radius: 1rem; object-fit: cover; }
  h2 { margin: 0; color: var(--pt-text-strong); font-size: 1.125rem; line-height: 1.375rem; }
  span { color: var(--pt-text-muted); font-size: 0.8125rem; line-height: 1rem; }
  @media (max-width: 53.75rem) { width: 100%; height: auto; img { width: 100%; height: min(26.25rem, 70vw); } }
`

export const CommentForm = styled.form`
  display: flex;
  width: 42.625rem;
  height: 25rem;
  box-sizing: border-box;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.875rem;
  border-radius: 1rem;
  padding: 1.5rem;
  background: var(--pt-bg-default);
  box-shadow: 0 0.125rem 0.75rem rgb(16 42 66 / 8%);
  h2 { margin: 0; color: var(--pt-text-strong); font-size: 1.125rem; line-height: 1.375rem; }
  p { order: 3; margin: 0; color: var(--pt-text-muted); font-size: 0.75rem; line-height: 0.9375rem; }
  textarea { width: 100%; height: 13.75rem; min-height: 13.75rem; resize: none; border: 0.0625rem solid var(--pt-border-default); border-radius: 1rem; padding: 0.875rem 1rem; color: var(--pt-text-strong); font: inherit; }
  button { order: 4; width: 11.25rem; height: 3rem; border: 0; border-radius: 0.875rem; padding: 0 1rem; background: var(--pt-brand-primary); color: var(--pt-text-inverse); cursor: pointer; font-size: 0.875rem; font-weight: 600; }
  small { color: var(--pt-status-error); font-size: 0.75rem; }
  @media (max-width: 53.75rem) { width: 100%; height: auto; min-height: 25rem; }
`

export const StateCard = styled.div`
  display: grid;
  min-height: 22.5rem;
  place-items: center;
  align-content: center;
  gap: 0.625rem;
  border-radius: 1.5rem;
  padding: 1.875rem;
  background: var(--pt-bg-default);
  color: var(--pt-text-muted);
  text-align: center;
  h1, p { margin: 0; }
  h1 { color: var(--pt-text-strong); font-size: 1.5rem; }
  button { margin-top: 0.625rem; border: 0; border-radius: 0.625rem; padding: 0.75rem 1.125rem; background: var(--pt-brand-primary); color: var(--pt-text-inverse); cursor: pointer; }
`
