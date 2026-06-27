import styled from "styled-components";

export const Logo = styled.div`
  display: inline-flex;
  align-items: center;

  img {
    display: block;
  }
`;

export const Page = styled.main`
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #f4f8fd;

  @media (max-width: 47.9375rem) {
    flex-direction: column;
  }
`;

export const Content = styled.section`
  display: flex;
  flex-direction: column;
  width: calc(100% - 15.0625rem);
  min-width: 0;
  gap: 1.875rem;
  padding-left: 3.625rem;
  padding-right: 3.625rem;
  padding-top: 3.25rem;
  padding-bottom: 3.8125rem;

  @media (max-width: 74.9375rem) {
    flex: 1;
    width: auto;
    gap: clamp(0.875rem, 2vh, 1.25rem);
    padding: clamp(1rem, 2.4vw, 1.75rem);
  }

  @media (max-width: 47.9375rem) {
    height: calc(100vh - 3.5rem);
    flex: 0 0 calc(100vh - 3.5rem);
    gap: 0.75rem;
    padding: 0.75rem;
  }
`;

export const BottomArea = styled.section`
  display: grid;
  width: calc(100% - 15.0625rem);
  gap: 1.5rem;
  grid-template-areas: 'travel right';
  grid-template-columns: 23.75rem 46.0625rem;

  > article:first-child {
    grid-area: travel;
  }

  @media (max-width: 74.9375rem) {
    width: 100%;
    min-height: 0;
    flex: 1;
    gap: clamp(0.875rem, 2vw, 1.25rem);
    grid-template-columns: minmax(13.5rem, 0.82fr) minmax(0, 1.8fr);
  }

  @media (max-width: 47.9375rem) {
    grid-template-areas:
      'right'
      'travel';
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto minmax(0, 1fr);
  }
`;

export const RightArea = styled.div`
  display: flex;
  width: 46.0625rem;
  min-width: 0;
  flex-direction: column;
  gap: 1.125rem;
  grid-area: right;
  margin-top: 0.25rem;

  @media (max-width: 74.9375rem) {
    width: 100%;
    min-height: 0;
    gap: clamp(0.75rem, 1.8vh, 1.125rem);
    margin-top: 0;
  }
`;

export const LowerRow = styled.div`
  display: grid;
  align-items: start;
  gap: 1.4375rem;
  grid-template-columns: 27.5rem 17.1875rem;

  @media (max-width: 74.9375rem) {
    min-height: 0;
    flex: 1;
    gap: clamp(0.75rem, 1.8vw, 1.25rem);
    grid-template-columns: minmax(0, 1.35fr) minmax(11.25rem, 1fr);
  }

  @media (max-width: 47.9375rem) {
    display: none;
  }
`;
