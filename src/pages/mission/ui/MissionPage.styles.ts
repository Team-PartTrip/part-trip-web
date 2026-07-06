import styled from 'styled-components'

export const Page = styled.main`
  display: flex;
  min-height: 100dvh;
  background: #f4f8fc;
  color: #111827;

  @media (max-width: 47.9375rem) { flex-direction: column; }
`

export const Logo = styled.img`display: block;`

export const Content = styled.section`
  display: grid;
  flex: 1;
  grid-template-columns: minmax(480px, 592px) minmax(400px, 478px);
  gap: 100px;
  align-items: start;
  padding: 31px 38px 40px 64px;

  @media (max-width: 74.9375rem) {
    gap: 40px;
    padding-inline: 36px;
  }

  @media (max-width: 67.5rem) {
    grid-template-columns: 1fr;
    padding: 32px;
  }

  @media (max-width: 47.9375rem) { padding: 24px 18px 48px; }
`

export const CharacterCard = styled.div`
  position: relative;
  display: flex;
  height: 525px;
  flex-direction: column;
  align-items: center;
  margin-top: 197px;
  border: 1px solid #5aa7de;
  border-radius: 20px;
  padding-top: 52px;
  background: #fff;
  box-shadow: 0 4px 30px rgb(0 0 0 / 15%);

  > img { width: 216px; height: 256px; margin-top: 30px; object-fit: contain; }

  @media (max-width: 67.5rem) {
    height: 440px;
    margin-top: 0;
    > img { width: 180px; height: 220px; margin-top: 18px; }
  }

  @media (max-width: 37.5rem) { height: 400px; padding-top: 46px; }
`

export const CardActions = styled.div`
  position: absolute;
  top: 14px;
  right: 18px;
  display: flex;
  gap: 14px;
  color: #1a6ebf;

  button {
    display: grid;
    width: 26px;
    height: 26px;
    border: 0;
    padding: 0;
    place-items: center;
    background: transparent;
    color: inherit;
    cursor: pointer;
  }

  svg {
    width: 26px;
    height: 26px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  button:last-child circle {
    fill: currentColor;
    stroke: currentColor;
  }

  button:last-child path { stroke: #fff; }
`

export const Speech = styled.div`
  position: relative;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 9px 25px;
  color: #334155;
  font-size: 18px;
  font-weight: 600;
  box-shadow: 0 1px 1px rgb(0 0 0 / 5%);

  &::after { position: absolute; left: 50%; bottom: -9px; width: 16px; height: 16px; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; background: #fff; content: ''; transform: translateX(-50%) rotate(45deg); }
`

export const CharacterName = styled.div`
  margin-top: 2px;
  font-size: 24px;
  font-weight: 700;
  small { margin-right: 9px; color: #727780; font-size: 14px; font-weight: 400; }
`

export const Progress = styled.div`
  width: 302px;
  height: 14px;
  margin-top: 24px;
  border: 1px solid #1a6ebf;
  border-radius: 999px;
  padding: 2px;
  span { display: block; height: 100%; border-radius: inherit; background: #1a6ebf; transition: width 220ms ease; }

  @media (max-width: 37.5rem) { width: min(302px, calc(100% - 40px)); }
`

export const ProgressText = styled.span`
  margin-top: 8px;
  color: #727780;
  font-size: 12px;
`

export const MissionPanel = styled.section`min-width: 0;`

export const Title = styled.h1`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 16px;
  font-size: 24px;
  line-height: 28px;
  span { border-radius: 999px; padding: 4px 9px; background: #fff1db; color: #ff9600; font-size: 12px; }
`

export const MissionList = styled.div`display: flex; flex-direction: column; gap: 16px;`

export const MissionCard = styled.article<{ $completed: boolean }>`
  display: flex;
  min-height: 110px;
  align-items: center;
  gap: 16px;
  border: 1px solid #e7edf7;
  border-radius: 18px;
  padding: 17px 20px;
  background: ${({ $completed }) => ($completed ? '#f1f8ff' : '#fff')};
  box-shadow: 0 3px 10px rgb(13 31 64 / 4%);

  @media (max-width: 37.5rem) { align-items: stretch; flex-direction: column; }
`

export const MissionCopy = styled.div`
  min-width: 0;
  flex: 1;
  small { color: #8ca0b8; font-size: 12px; font-weight: 600; }
  h2 { margin: 4px 0 3px; font-size: 21px; line-height: 25px; letter-spacing: -0.7px; }
  p { margin: 0; color: #727780; font-size: 12px; line-height: 15px; white-space: pre-line; }
`

export const CompleteButton = styled.button`
  width: 92px;
  height: 38px;
  flex: 0 0 92px;
  border: 1px solid #1a6ebf;
  border-radius: 10px;
  background: #fff;
  color: #1a6ebf;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  &:disabled { cursor: not-allowed; opacity: 0.7; }
  @media (max-width: 37.5rem) { width: 100%; flex-basis: 42px; }
`

export const ErrorMessage = styled.p`
  margin: -6px 0 14px;
  color: #dc2626;
  font-size: 13px;
`
