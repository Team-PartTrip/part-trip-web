import styled from 'styled-components'

export const Form = styled.form`
  position: fixed;
  z-index: 1001;
  top: 50%;
  left: 50%;
  display: flex;
  width: min(56.25rem, calc(100vw - 3rem));
  max-height: calc(100dvh - 3rem);
  flex-direction: column;
  gap: 1.25rem;
  overflow: hidden;
  border: 0.0625rem solid var(--pt-border-subtle);
  border-radius: 1.625rem;
  padding: 1.75rem 2rem 1.5rem;
  background: var(--pt-bg-default);
  box-shadow: 0 1.5rem 4.375rem rgb(13 31 64 / 22%);
  transform: translate(-50%, -50%);

  @media (max-width: 47.9375rem) {
    width: calc(100vw - 1.75rem);
    max-height: calc(100dvh - 1.75rem);
    gap: 1rem;
    border-radius: 1.25rem;
    padding: 1.375rem 1.125rem 1.125rem;
  }
`

export const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.25rem;

  h1 { margin: 0; color: var(--pt-text-strong); font-size: 1.75rem; line-height: 2.375rem; letter-spacing: -0.06875rem; }
  p { margin: 0.125rem 0 0; color: var(--pt-text-muted); font-size: 0.8125rem; }
`

export const CloseButton = styled.button`
  display: grid;
  width: 2.5rem;
  height: 2.5rem;
  flex: 0 0 2.5rem;
  border: 0.0625rem solid var(--pt-border-subtle);
  border-radius: 50%;
  place-items: center;
  background: var(--pt-bg-subtle);
  color: var(--pt-text-muted);
  cursor: pointer;
  font-size: 1.5rem;
  line-height: 1;

  &:hover { background: var(--pt-bg-muted); color: var(--pt-brand-primary); }
  &:focus-visible { outline: 0.1875rem solid rgb(26 110 191 / 18%); }
`

export const Body = styled.div`
  display: grid;
  min-height: 0;
  grid-template-columns: minmax(0, 1fr) 16.25rem;
  gap: 1.5rem;
  overflow-y: auto;
  padding: 0.0625rem 0.25rem 0.0625rem 0;

  @media (max-width: 47.9375rem) { grid-template-columns: 1fr; }
`

export const EditorColumn = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 1rem;
`

export const Section = styled.section`
  border: 0.0625rem solid var(--pt-border-subtle);
  border-radius: 1rem;
  padding: 1rem;
  background: var(--pt-bg-default);
`

export const SectionHeading = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;

  strong { color: var(--pt-text-strong); font-size: 0.9375rem; }
  span { color: var(--pt-text-muted); font-size: 0.6875rem; text-align: right; }

  @media (max-width: 30rem) { align-items: flex-start; flex-direction: column; gap: 0.125rem; }
`

export const PhotoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`

export const PhotoPreview = styled.div`
  display: grid;
  width: 4.75rem;
  height: 4.75rem;
  flex: 0 0 4.75rem;
  overflow: hidden;
  border: 0.0625rem solid var(--pt-border-soft);
  border-radius: 50%;
  place-items: center;
  background: var(--pt-border-subtle);
  color: var(--pt-text-muted);
  font-size: 1.75rem;
  font-weight: 700;

  img { display: block; width: 100%; height: 100%; object-fit: cover; }
`

export const PhotoActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

export const PhotoButton = styled.label`
  display: inline-flex;
  height: 2.375rem;
  align-items: center;
  border-radius: 0.625rem;
  padding: 0 0.875rem;
  background: var(--pt-brand-primary);
  color: var(--pt-text-inverse);
  cursor: pointer;
  font-size: 0.8125rem;
  font-weight: 700;

  input { position: absolute; width: 0.0625rem; height: 0.0625rem; overflow: hidden; clip: rect(0 0 0 0); }
  &:hover { background: var(--pt-brand-primary); }
  &:focus-within { outline: 0.1875rem solid rgb(26 110 191 / 18%); outline-offset: 0.125rem; }
`

export const ResetPhotoButton = styled.button`
  height: 2.375rem;
  border: 0.0625rem solid var(--pt-border-subtle);
  border-radius: 0.625rem;
  padding: 0 0.8125rem;
  background: var(--pt-bg-default);
  color: var(--pt-text-muted);
  cursor: pointer;
  font-size: 0.8125rem;
  font-weight: 600;

  &:hover { background: var(--pt-bg-subtle); }
`

export const Field = styled.label`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 0.375rem;
  color: var(--pt-text-muted);
  font-size: 0.75rem;
  font-weight: 600;

  input, select {
    width: 100%;
    height: 2.625rem;
    border: 0.0625rem solid var(--pt-border-subtle);
    border-radius: 0.75rem;
    padding: 0 0.875rem;
    background: var(--pt-bg-subtle);
    color: var(--pt-text-strong);
    font: inherit;
    font-size: 0.875rem;
    outline: none;
  }

  input:focus, select:focus { border-color: var(--pt-brand-primary); box-shadow: 0 0 0 0.1875rem rgb(26 110 191 / 12%); }
  input[aria-invalid='true'] { border-color: var(--pt-status-error); }
`

export const Preview = styled.aside`
  position: sticky;
  top: 0;
  display: flex;
  min-height: 26.875rem;
  align-items: center;
  flex-direction: column;
  border: 0.0625rem solid var(--pt-border-subtle);
  border-radius: 1.375rem;
  padding: 1.5rem 1.375rem;
  background: var(--pt-bg-subtle);
  text-align: center;

  h2 { width: 100%; margin: 0; color: var(--pt-text-strong); font-size: 1.375rem; line-height: 1.875rem; text-align: left; }
  h3 { max-width: 100%; overflow: hidden; margin: 1.125rem 0 0; color: var(--pt-text-strong); font-size: 1.5rem; line-height: 2rem; text-overflow: ellipsis; white-space: nowrap; }
  p { margin: 0.1875rem 0 0; color: var(--pt-brand-primary); font-size: 0.875rem; font-weight: 600; }
  small { margin-top: auto; color: var(--pt-text-muted); font-size: 0.6875rem; line-height: 1rem; }

  @media (max-width: 47.9375rem) { position: static; min-height: 18.75rem; }
`

export const PreviewAvatar = styled.div`
  display: grid;
  width: 7.75rem;
  height: 7.75rem;
  overflow: hidden;
  margin-top: 2.25rem;
  border: 0.0625rem solid var(--pt-border-soft);
  border-radius: 50%;
  place-items: center;
  background: var(--pt-border-subtle);
  color: var(--pt-text-muted);
  font-size: 2.75rem;
  font-weight: 700;

  img { display: block; width: 100%; height: 100%; object-fit: cover; }
`

export const FieldError = styled.span`
  color: var(--pt-status-error);
  font-size: 0.6875rem;
  font-weight: 500;
`

export const ErrorMessage = styled.p`
  margin: 0.5rem 0 0;
  color: var(--pt-status-error);
  font-size: 0.75rem;
`

export const Actions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.625rem;
  border-top: 0.0625rem solid var(--pt-border-subtle);
  padding-top: 1.125rem;
`

const Button = styled.button`
  height: 2.75rem;
  border-radius: 0.625rem;
  padding: 0 1.125rem;
  cursor: pointer;
  font: inherit;
  font-size: 0.875rem;
  font-weight: 700;

  &:disabled { cursor: wait; opacity: 0.55; }
  &:focus-visible { outline: 0.1875rem solid rgb(26 110 191 / 18%); outline-offset: 0.125rem; }
`

export const CancelButton = styled(Button)`min-width: 5.5rem; border: 0.0625rem solid var(--pt-border-subtle); background: var(--pt-bg-default); color: var(--pt-text-muted);`
export const SaveButton = styled(Button)`min-width: 8.375rem; border: 0; background: var(--pt-brand-primary); color: var(--pt-text-inverse);`
