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
  min-width: 75rem;
  height: 100vh;
  min-height: 45rem;
  overflow: hidden;
  background: #f4f8fd;
`;

export const Content = styled.section`
  display: flex;
  flex-direction: column;
  width: calc(100% - 15.0625rem);
  gap: 1.875rem;
  padding-left: 3.625rem;
  padding-right: 3.625rem;
  padding-top: 3.25rem;
  padding-bottom: 3.8125rem;
`;

export const BottomArea = styled.section`
  display: flex;
  width: calc(100% - 15.0625rem);
  gap: 1.5rem;
`;

export const RightArea = styled.div`
  display: flex;
  width: 46.0625rem;
  flex-direction: column;
  gap: 1.125rem;
  margin-top: 0.25rem;
`;

export const LowerRow = styled.div`
  display: grid;
  align-items: start;
  gap: 1.4375rem;
  grid-template-columns: 27.5rem 17.1875rem;
`;
