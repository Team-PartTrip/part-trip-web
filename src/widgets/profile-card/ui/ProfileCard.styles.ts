import styled from 'styled-components'

const panel = `
  border: 1px solid #e7edf7;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 8px 16px rgb(13 31 64 / 8%);
`

export const Card = styled.section`
  display: flex;
  width: 1155px;
  height: 100%;
  max-width: 100%;
  flex-direction: column;
  gap: clamp(16px, 2.85vh, 28px);

  @media (max-width: 58rem) { height: auto; }
`

export const ProfileLine = styled.header`
  ${panel}
  display: flex;
  width: 100%;
  height: clamp(160px, 23.42vh, 230px);
  flex: 0 0 clamp(160px, 23.42vh, 230px);
  align-items: center;
  gap: 24px;
  padding: 28px 28px 28px 34px;

  @media (max-width: 40rem) {
    display: grid;
    height: auto;
    min-height: 250px;
    flex-basis: auto;
    grid-template-columns: 96px minmax(0, 1fr);
    gap: 18px;
    padding: 22px;
  }
`

export const Avatar = styled.div`
  width: 112px;
  height: 112px;
  flex: 0 0 112px;
  border: 1px solid #d8dddd;
  border-radius: 50%;
  background: #e6ecf3;
  overflow: hidden;

  img { display: block; width: 100%; height: 100%; object-fit: cover; }

  @media (max-width: 40rem) {
    width: 96px;
    height: 96px;
    flex-basis: 96px;
  }
`

export const BasicInfo = styled.div`
  display: flex;
  width: 786px;
  height: 146px;
  flex-direction: column;
  justify-content: center;
  gap: 8px;

  h1 { margin: 0; color: #111827; font-size: 34px; line-height: 46px; letter-spacing: -1.36px; }
  p { margin: 0; color: #1a6ebf; font-size: 16px; font-weight: 600; line-height: 22px; }

  @media (max-width: 40rem) {
    width: auto;
    height: auto;
    min-width: 0;
    h1 { font-size: 28px; line-height: 36px; }
  }
`

export const EditButton = styled.button`
  width: 118px;
  height: 48px;
  flex: 0 0 118px;
  border: 0;
  border-radius: 10px;
  background: #1a6ebf;
  color: #fff;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  white-space: nowrap;

  @media (max-width: 40rem) {
    width: 100%;
    height: 44px;
    grid-column: 1 / -1;
  }
`

export const Body = styled.div`
  display: grid;
  min-height: 0;
  flex: 1;
  grid-template-columns: minmax(0, 1.75fr) minmax(280px, 1fr);
  gap: 24px;

  @media (max-width: 58rem) {
    height: auto;
    grid-template-columns: 1fr;
  }
`

export const BadgePanel = styled.section`
  ${panel}
  min-height: 0;
  padding: clamp(20px, 2.65vh, 26px) 28px;
`

export const PanelTitle = styled.header`
  display: flex;
  height: 56px;
  align-items: flex-start;
  justify-content: space-between;
  h2 { margin: 0; font-size: 24px; line-height: 32px; }
  p { margin: 2px 0 0; color: #727780; font-size: 13px; }
  > strong { flex: 0 0 auto; padding-top: 12px; color: #1a6ebf; font-size: 14px; white-space: nowrap; }

  @media (max-width: 40rem) {
    height: auto;
    flex-direction: column;
    gap: 6px;
    > strong { padding-top: 0; }
  }
`

export const BadgeGrid = styled.div`
  display: grid;
  height: calc(100% - 74px);
  grid-template-columns: repeat(4, minmax(0, 1fr));
  grid-template-rows: repeat(3, minmax(0, 1fr));
  gap: clamp(8px, 1.43vh, 14px) 20px;
  margin-top: clamp(18px, 2.65vh, 26px);

  @media (max-width: 58rem) {
    height: auto;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    grid-template-rows: none;
  }
`

export const BadgeItem = styled.div<{ $cropRight: boolean }>`
  min-width: 0;
  min-height: 0;
  overflow: hidden;

  img {
    display: block;
    width: ${({ $cropRight }) => ($cropRight ? '112%' : '100%')};
    height: 100%;
    min-height: 0;
    object-fit: ${({ $cropRight }) => ($cropRight ? 'fill' : 'contain')};
    object-position: left center;
  }

  @media (max-width: 58rem) { aspect-ratio: 1; }
`

export const TypePanel = styled.section`
  ${panel}
  display: flex;
  min-height: 0;
  align-items: center;
  flex-direction: column;
  padding: clamp(20px, 2.65vh, 26px) 24px;

  > h2 { width: 100%; margin: 0; font-size: 24px; line-height: 32px; }
  > img { width: clamp(170px, 26.48vh, 260px); height: clamp(170px, 26.48vh, 260px); margin-top: clamp(14px, 2.44vh, 24px); object-fit: contain; }
  > h3 { margin: -4px 0 3px; font-size: 24px; line-height: 32px; }
  > span { color: #a6a6a6; font-size: 15px; }
`

export const TypeDescription = styled.div`
  width: 100%;
  min-height: clamp(108px, 15.48vh, 152px);
  margin-top: clamp(14px, 3.77vh, 37px);
  border: 1px solid #d8dddd;
  border-radius: 10px;
  padding: 17px 10px;
  font-size: 13px;
  line-height: 18px;
  strong { color: #1a6ebf; }
  p { margin: 0; }
  p + p { margin-top: 14px; }

  @media (max-width: 58rem) { min-height: 0; }
`
