import styled from 'styled-components'

export const Page = styled.main`
  display: flex;
  min-height: 100dvh;
  background: #f4f8fc;
  color: #111827;

  @media (max-width: 47.9375rem) { flex-direction: column; }
`

export const Logo = styled.img`
  display: block;
`

export const Content = styled.section`
  flex: 1;
  min-width: 0;
  padding: 0 60px 40px 63px;

  @media (max-width: 74.9375rem) { padding-inline: 36px; }
  @media (max-width: 47.9375rem) { padding: 20px 18px 48px; }
`

export const SearchBar = styled.div`
  display: flex;
  height: 48px;
  align-items: center;
  gap: 14px;
  margin: 11px 54px 39px 31px;
  border-radius: 999px;
  padding: 0 18px;
  background: #fff;
  color: #727780;
  font-size: 16px;
  font-weight: 500;

  @media (max-width: 47.9375rem) { margin: 0 0 24px; }
`

export const SearchIcon = styled.span`
  width: 16px;
  height: 16px;
  border: 2px solid #344054;
  border-radius: 50%;
  position: relative;

  &::after {
    position: absolute;
    right: -6px;
    bottom: -4px;
    width: 7px;
    height: 2px;
    background: #344054;
    content: '';
    transform: rotate(45deg);
  }
`

export const RecordCard = styled.div`
  width: min(1148px, 100%);
  min-height: 659px;
  margin: 0 auto;
  border: 1px solid #e7edf7;
  border-radius: 24px;
  padding: 22px 24px 18px;
  background: #fff;
  box-shadow: 0 8px 16px rgb(13 31 64 / 8%);

  @media (max-width: 47.9375rem) { min-height: 0; border-radius: 18px; padding: 20px 16px; }
`

export const CardHeader = styled.header`
  display: flex;
  height: 50px;
  align-items: flex-start;
  justify-content: space-between;

  h1 { margin: 0; font-size: 24px; line-height: 32px; letter-spacing: -0.96px; }
  p { margin: 0; color: #727780; font-size: 13px; font-weight: 500; }
  @media (max-width: 34rem) { height: auto; flex-direction: column; gap: 14px; }
`

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  strong { color: #1a6ebf; font-size: 14px; }
  button { height: 36px; border: 0; border-radius: 10px; padding: 0 14px; background: #1a6ebf; color: #fff; cursor: pointer; font-weight: 700; }
`

export const RecordList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 26px;

  @media (max-width: 34rem) { margin-top: 20px; }
`

export const RecordRow = styled.article`
  display: flex;
  height: 112px;
  align-items: center;
  gap: 16px;
  border: 1px solid #e7edf7;
  border-radius: 18px;
  padding: 14px 16px;

  > img { width: 86px; height: 84px; border-radius: 16px; object-fit: cover; }

  @media (max-width: 40rem) {
    height: auto;
    align-items: flex-start;
    flex-wrap: wrap;
    > img { width: 72px; height: 72px; }
  }
`

export const RecordText = styled.div`
  min-width: 0;
  flex: 1;

  h2 { margin: 0; font-size: 18px; line-height: 24px; letter-spacing: -0.72px; }
  p { margin: 4px 0 0; color: #1a6ebf; font-size: 13px; font-weight: 600; }
`

export const ViewButton = styled.button`
  width: 82px;
  height: 36px;
  border: 1px solid #dde7f3;
  border-radius: 10px;
  background: #fff;
  color: #1a6ebf;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;

  @media (max-width: 40rem) { width: 100%; }
`

export const MoreButton = styled.button`
  width: 100%;
  height: 42px;
  margin-top: 24px;
  border: 1px solid #d7e3f2;
  border-radius: 10px;
  background: #fff;
  color: #1a6ebf;
  cursor: pointer;
  font-weight: 600;
`
