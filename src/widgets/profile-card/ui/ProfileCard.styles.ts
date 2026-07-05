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
  max-width: 100%;
  flex-direction: column;
  gap: 28px;
`

export const ProfileLine = styled.header`
  ${panel}
  display: flex;
  width: 100%;
  height: 230px;
  align-items: center;
  gap: 24px;
  padding: 28px 28px 28px 34px;
`

export const Avatar = styled.div`
  width: 112px;
  height: 112px;
  flex: 0 0 112px;
  border: 1px solid #d8dddd;
  border-radius: 50%;
  background: #e6ecf3;
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
`

export const EditButton = styled.button`
  width: 118px;
  height: 48px;
  border: 0;
  border-radius: 10px;
  background: #1a6ebf;
  color: #fff;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
`

export const Body = styled.div`
  display: grid;
  height: 626px;
  grid-template-columns: 720px 411px;
  gap: 24px;
`

export const BadgePanel = styled.section`
  ${panel}
  padding: 26px 28px;
`

export const PanelTitle = styled.header`
  display: flex;
  height: 56px;
  align-items: flex-start;
  justify-content: space-between;
  h2 { margin: 0; font-size: 24px; line-height: 32px; }
  p { margin: 2px 0 0; color: #727780; font-size: 13px; }
  > strong { padding-top: 12px; color: #1a6ebf; font-size: 14px; }
`

export const BadgeGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 146px);
  grid-template-rows: repeat(3, 146px);
  gap: 14px 20px;
  margin-top: 26px;
  img { width: 146px; height: 146px; object-fit: contain; }
`

export const TypePanel = styled.section`
  ${panel}
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 26px 24px;

  > h2 { width: 100%; margin: 0; font-size: 24px; line-height: 32px; }
  > img { width: 260px; height: 260px; margin-top: 24px; object-fit: contain; }
  > h3 { margin: -4px 0 3px; font-size: 24px; line-height: 32px; }
  > span { color: #a6a6a6; font-size: 15px; }
`

export const TypeDescription = styled.div`
  width: 100%;
  min-height: 152px;
  margin-top: 37px;
  border: 1px solid #d8dddd;
  border-radius: 10px;
  padding: 17px 10px;
  font-size: 13px;
  line-height: 18px;
  strong { color: #1a6ebf; }
  p { margin: 0; }
  p + p { margin-top: 14px; }
`
