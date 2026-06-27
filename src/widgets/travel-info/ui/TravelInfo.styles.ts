import styled from "styled-components";

export const Card = styled.article`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  min-width: 0;
  height: 27.8125rem;
  border: 0.0625rem solid #e7edf7;
  border-radius: 1.5rem;
  padding: 1.25rem 1.9375rem;
  gap: 1.375rem;
  background: #ffffff;
  box-shadow: 0 0.5rem 1.5rem rgb(13 31 64 / 8%);

  @media (max-width: 74.9375rem) {
    height: 100%;
    min-height: 0;
    gap: clamp(0.625rem, 1.7vh, 1.25rem);
    padding: clamp(0.875rem, 2vw, 1.25rem);
  }

  @media (max-width: 47.9375rem) {
    justify-content: space-between;
    border-radius: 1.125rem;
    padding: 0.875rem 1rem;
  }
`;

export const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4375rem;
  padding: 0px;
  width: 7.812rem;
  height: auto;

  h2 {
    margin: 0;
    color: #111111;
    font-size: 1.375rem;
    font-weight: 700;
    letter-spacing: -0.055rem;
    color: #000000;
    font-weight: bold;
  }
`;

export const Tabs = styled.div`
  display: flex;
  align-items: center;
  padding: 0px;
  gap: 0.375rem;

  @media (max-width: 74.9375rem) {
    width: 100%;
    gap: 0.25rem;
  }
`;

export const Tab = styled.button<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  width: 4.8125rem;
  height: auto;

  font-family: "Pretendard";
  font-style: normal;
  font-weight: 500;
  font-size: 0.75rem;
  line-height: 1.5rem;
  white-space: nowrap;
  border-radius: 999rem;
  cursor: pointer;

  border: ${({ $active }) => ($active ? "0" : "0.0625rem solid #BEBEBE")};
  background: ${({ $active }) => ($active ? "#0061aa" : "#F0EDED")};
  color: ${({ $active }) => ($active ? "#ffffff" : "#404752")};

  @media (max-width: 74.9375rem) {
    width: auto;
    min-width: 0;
    flex: 1;
    padding-inline: 0.2rem;
    font-size: clamp(0.5rem, 1vw, 0.625rem);
  }
`;

export const PopulationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: flex-start;
  width: 100%;
  padding: 0px;
`;

export const PopulationItem = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.4375rem;
`;

export const PopulationMeta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #1b1b1b;
  font-size: 0.8125rem;
  font-weight: bold
`;
export const PopulationCountry = styled.div`
  height: auto;
  font-family: "Inter";
  font-style: normal;
  font-size: 0.8125rem;
  font-weight: bold;
  color: #111827;
`;

export const ProgressTrack = styled.div`
  width: 100%;
  height: 0.625rem;
  overflow: hidden;
  border-radius: 999rem;
  background: #eee9eb;
`;

export const ProgressFill = styled.span<{ $color: string; $value: number }>`
  display: block;
  width: ${({ $value }) => `${$value}%`};
  height: 100%;
  border-radius: inherit;
  background: ${({ $color }) => $color};
`;

export const CultureSummary = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 1.375rem;
  height: auto;
  border-radius: 1.375rem;
  box-sizing: border-box;
  gap: 0.625rem;

  background: #f7f7f8;
  border: 1px solid #eef2f7;

  @media (max-width: 47.9375rem) {
    width: 100%;
    padding: 0.875rem;
    gap: 0.375rem;
  }

  strong {
    font-size: 1.125rem;
    font-weight: 700;
    font-family: "Inter";
    font-style: normal;
    font-weight: 700;
    line-height: 1.375rem;
    color: #111827;
  }

  p {
    font-family: "Pretendard";
    font-style: normal;
    font-weight: 500;
    font-size: 0.875rem;
    line-height: 0.875rem;
    color: #1a1b1f;
  }
`;
