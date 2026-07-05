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
  display: flex;
  flex: 1;
  min-width: 0;
  flex-direction: column;

  @media (max-width: 47.9375rem) { width: 100%; }
`

export const TopBar = styled.header`
  display: flex;
  width: 100%;
  height: 70px;
  align-items: center;
  gap: 30px;
  border-bottom: 1px solid #c2c6d8;
  padding: 0 32px;
  box-shadow: 0 1px 2px rgb(0 0 0 / 5%);

  @media (max-width: 63.9375rem) { gap: 16px; padding-inline: 20px; }
  @media (max-width: 47.9375rem) { height: auto; flex-direction: column; align-items: stretch; padding-block: 14px; }
`

export const TripTitle = styled.button`
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 16px;
  border: 0;
  padding: 0;
  background: transparent;
  color: #191c1e;
  cursor: pointer;
  font: inherit;
  font-size: 22px;
  font-weight: 700;
  white-space: nowrap;

  > span { font-size: 40px; font-weight: 300; line-height: 20px; }

  @media (max-width: 63.9375rem) { font-size: 18px; }
`

export const SearchBar = styled.div`
  display: flex;
  width: 100%;
  height: 48px;
  max-width: 923px;
  align-items: center;
  gap: 14px;
  margin-left: auto;
  border-radius: 999px;
  padding: 0 18px;
  background: #fff;
  color: #727780;
  font-size: 16px;
  font-weight: 500;

  @media (max-width: 47.9375rem) { max-width: none; margin: 0; }
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

export const Workspace = styled.section`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-end;
  padding: 28px 60px 40px 63px;

  @media (max-width: 74.9375rem) { padding-inline: 36px; }
  @media (max-width: 47.9375rem) { padding: 20px 18px 48px; }
`

export const RecordCard = styled.div`
  width: min(1148px, 100%);
  margin: 0 auto;
  border: 1px solid #e7edf7;
  border-radius: 24px;
  padding: 22px 24px 18px;
  background: #fff;
  box-shadow: 0 8px 16px rgb(13 31 64 / 8%);

  @media (max-width: 47.9375rem) { min-height: 0; border-radius: 18px; padding: 20px 16px; }
`

export const RecordList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export const RecordRow = styled.article`
  display: flex;
  height: 145px;
  align-items: center;
  gap: 16px;
  border: 1px solid #e7edf7;
  border-radius: 18px;
  padding: 14px 16px;

  > img { width: 86px; height: 85px; flex: 0 0 86px; border-radius: 16px; object-fit: cover; }

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
  p { max-width: 720px; margin: 4px 0 0; overflow: hidden; color: #404752; font-size: 14px; line-height: 20px; text-overflow: ellipsis; white-space: nowrap; }
  span { display: block; margin-top: 8px; color: #717784; font-size: 14px; line-height: 24px; }
`

export const RowActions = styled.div`
  display: flex;
  width: 112px;
  height: 100%;
  flex: 0 0 112px;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
`

export const MenuButton = styled.button`
  border: 0;
  padding: 0 8px;
  background: transparent;
  color: #b5bdc8;
  cursor: pointer;
  font-size: 22px;
  line-height: 20px;
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

export const CreateButton = styled.button`
  width: 320px;
  height: 42px;
  margin-top: 10px;
  border: 0;
  border-radius: 10px;
  background: #1a6ebf;
  color: #fff;
  cursor: pointer;
  font-size: 15px;
  font-weight: 700;

  @media (max-width: 47.9375rem) { width: 100%; }
`
