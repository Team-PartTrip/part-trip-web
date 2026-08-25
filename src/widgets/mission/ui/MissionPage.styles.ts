import styled from 'styled-components'

export const Page = styled.main`
  min-height: 100%;
  background: transparent;
  color: var(--pt-text-strong);
`

export const Logo = styled.img`display: block;`

export const Content = styled.section`
  display: grid;
  width: 100%;
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
  border: 1px solid var(--pt-brand-primary);
  border-radius: 20px;
  padding-top: 52px;
  background: var(--pt-bg-default);
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
  color: var(--pt-brand-primary);

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

    &:hover { color: var(--pt-brand-primary); }
    &:focus-visible { border-radius: 5px; outline: 2px solid var(--pt-brand-primary); outline-offset: 2px; }
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

  button:last-child path { stroke: var(--pt-bg-default); }
`

export const Speech = styled.div`
  position: relative;
  border: 1px solid var(--pt-border-subtle);
  border-radius: 16px;
  padding: 9px 25px;
  color: var(--pt-text-strong);
  font-size: 18px;
  font-weight: 600;
  box-shadow: 0 1px 1px rgb(0 0 0 / 5%);

  &::after { position: absolute; left: 50%; bottom: -9px; width: 16px; height: 16px; border-right: 1px solid var(--pt-border-subtle); border-bottom: 1px solid var(--pt-border-subtle); background: var(--pt-bg-default); content: ''; transform: translateX(-50%) rotate(45deg); }
`

export const CharacterName = styled.div`
  margin-top: 2px;
  font-size: 24px;
  font-weight: 700;
  small { margin-right: 9px; color: var(--pt-text-muted); font-size: 14px; font-weight: 400; }
`

export const Progress = styled.div`
  width: 302px;
  height: 14px;
  margin-top: 24px;
  border: 1px solid var(--pt-brand-primary);
  border-radius: 999px;
  padding: 2px;
  span { display: block; height: 100%; border-radius: inherit; background: var(--pt-brand-primary); transition: width 220ms ease; }

  @media (max-width: 37.5rem) { width: min(302px, calc(100% - 40px)); }
`

export const ProgressText = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
`

export const MissionPanel = styled.section`
  min-width: 0;
  min-height: calc(100dvh + 40px);
  margin: -31px -38px -40px -37px;
  padding: 29px 37px 40px;
  background: var(--pt-bg-default);

  @media (max-width: 74.9375rem) { margin-right: -36px; }
  @media (max-width: 67.5rem) { min-height: auto; margin: 0; border-radius: 20px; padding: 26px; }
  @media (max-width: 47.9375rem) { padding: 22px 18px; }
`

export const Title = styled.h1`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0 0 16px;
  font-size: 24px;
  line-height: 28px;
  span { border-radius: 999px; padding: 4px 9px; background: var(--pt-bg-warning); color: var(--pt-status-warning); font-size: 12px; }
`

export const MissionList = styled.div`display: flex; flex-direction: column; gap: 16px;`

export const MissionCard = styled.article`
  display: flex;
  min-height: 110px;
  align-items: center;
  gap: 16px;
  border: 1px solid var(--pt-border-subtle);
  border-radius: 18px;
  padding: 17px 20px;
  background: var(--pt-bg-default);
  box-shadow: 0 3px 10px rgb(13 31 64 / 4%);

  @media (max-width: 37.5rem) { align-items: stretch; flex-direction: column; }
`

export const MissionCopy = styled.div`
  min-width: 0;
  flex: 1;
  small { color: var(--pt-text-muted); font-size: 12px; font-weight: 600; }
  h2 { margin: 4px 0 3px; font-size: 21px; line-height: 25px; letter-spacing: -0.7px; }
  p { margin: 0; color: var(--pt-text-muted); font-size: 12px; line-height: 15px; white-space: pre-line; }
`

export const CompleteButton = styled.button`
  display: flex;
  width: 112px;
  min-height: 34px;
  flex: 0 0 112px;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 0;
  border-radius: 999px;
  background: var(--pt-bg-info);
  color: var(--pt-brand-primary);
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;

  span { font-size: 18px; line-height: 10px; }
  &:hover { background: var(--pt-bg-info); }
  &:focus-visible { outline: 2px solid var(--pt-brand-primary); outline-offset: 2px; }
  @media (max-width: 37.5rem) { width: 100%; flex-basis: 42px; }
`

export const ErrorMessage = styled.p`
  margin: -6px 0 14px;
  color: var(--pt-status-error);
  font-size: 13px;
`

export const StateMessage = styled.p`
  margin: 24px 0 0;
  color: var(--pt-text-muted);
  font-size: 14px;
`

export const DialogDimmer = styled.div`
  position: fixed;
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 28px;
  background: rgb(0 0 0 / 50%);
  inset: 0;
`

export const Dialog = styled.section`
  position: relative;
  width: min(925px, calc(100vw - 56px));
  height: min(729px, calc(100dvh - 56px));
  overflow: hidden;
  border-radius: 20px;
  background: var(--pt-bg-default);
  box-shadow: 0 18px 60px rgb(15 23 42 / 24%);

  @media (max-width: 47.9375rem) {
    width: calc(100vw - 28px);
    height: calc(100dvh - 28px);
  }
`

export const DialogClose = styled.button`
  position: absolute;
  z-index: 2;
  top: 8px;
  left: 8px;
  display: grid;
  width: 36px;
  height: 36px;
  border: 0;
  place-items: center;
  background: transparent;
  color: var(--pt-text-strong);
  cursor: pointer;
  font-size: 34px;
  font-weight: 600;
  line-height: 1;

  &:focus-visible { border-radius: 8px; outline: 2px solid var(--pt-brand-primary); }
`

export const DialogTitle = styled.h2`
  margin: 0;
  color: var(--pt-text-strong);
  font-size: 26px;
  line-height: 32px;

  small { font-size: 14px; }
`

export const CalendarContent = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  padding: 65px 67px 50px;

  @media (max-width: 47.9375rem) { padding: 62px 20px 24px; }
`

export const CalendarHeading = styled.header`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
`

export const Streak = styled.p`
  margin: 23px 0 0;
  color: var(--pt-text-strong);
  font-size: 13px;
  strong { color: var(--pt-brand-primary); }
`

export const CalendarLegend = styled.div`
  display: flex;
  gap: 20px;
  color: var(--pt-text-muted);
  font-size: 12px;
  span:last-child { color: var(--pt-brand-primary); }

  @media (max-width: 37.5rem) { gap: 8px; font-size: 10px; }
`

export const CalendarGrid = styled.div`
  display: grid;
  min-height: 400px;
  flex: 1;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: repeat(7, minmax(36px, 1fr));
  align-items: center;
  margin-top: 18px;
  border: 1px solid var(--pt-border-subtle);
  border-radius: 15px;
  padding: 18px 25px;

  @media (max-width: 47.9375rem) { min-height: 330px; padding: 12px 5px; }
`

export const WeekDay = styled.span`
  color: var(--pt-text-muted);
  font-size: 12px;
  text-align: center;
`

export const CalendarDay = styled.button<{ $attended: boolean; $selected: boolean }>`
  display: grid;
  width: 40px;
  height: 40px;
  border: ${({ $selected }) => ($selected ? '2px solid var(--pt-brand-primary)' : '2px solid transparent')};
  border-radius: 10px;
  place-self: center;
  place-items: center;
  background: ${({ $attended }) => ($attended ? 'var(--pt-brand-primary)' : 'var(--pt-bg-default)')};
  color: ${({ $attended }) => ($attended ? 'var(--pt-bg-default)' : 'var(--pt-text-strong)')};
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;

  &:hover { background: ${({ $attended }) => ($attended ? 'var(--pt-brand-primary)' : 'var(--pt-bg-info)')}; }
  &:focus-visible { outline: 2px solid var(--pt-brand-primary); outline-offset: 2px; }
  @media (max-width: 37.5rem) { width: 34px; height: 34px; }
`

export const AttendanceButton = styled.button`
  width: 340px;
  min-height: 54px;
  margin: 38px auto 0;
  border: 0;
  border-radius: 10px;
  background: var(--pt-brand-primary);
  color: var(--pt-text-inverse);
  cursor: pointer;
  font-size: 16px;
  font-weight: 700;
  box-shadow: 0 8px 15px rgb(26 110 191 / 20%);

  &:hover:not(:disabled) { background: var(--pt-brand-primary); }
  &:disabled { cursor: default; opacity: 0.7; }
  &:focus-visible { outline: 3px solid var(--pt-brand-primary); outline-offset: 2px; }
  @media (max-width: 37.5rem) { width: 100%; margin-top: 20px; }
`

export const CompletedContent = styled.div`
  height: 100%;
  padding: 74px 67px 50px;

  @media (max-width: 47.9375rem) { padding: 65px 20px 24px; }
`

export const CompletedList = styled.div`
  display: flex;
  max-height: calc(100% - 48px);
  flex-direction: column;
  gap: 15px;
  overflow-y: auto;
  margin-top: 8px;
  padding: 1px 4px 1px 0;
`

export const CompletedCard = styled.article`
  min-height: 111px;
  flex: 0 0 auto;
  border: 1px solid var(--pt-border-subtle);
  border-radius: 16px;
  padding: 18px 20px;
  background: var(--pt-bg-default);
  box-shadow: 0 4px 6px rgb(0 0 0 / 3%);

  small { color: var(--pt-text-muted); font-size: 12px; font-weight: 700; }
  h3 { margin: 4px 0; color: var(--pt-text-strong); font-size: 22px; line-height: 28px; }
  p { margin: 0; color: var(--pt-text-muted); font-size: 12px; line-height: 15px; white-space: pre-line; }
`

export const EmptyCompleted = styled.div`
  display: flex;
  height: calc(100% - 40px);
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 8px;
  color: var(--pt-text-muted);
  text-align: center;

  strong { color: var(--pt-text-strong); font-size: 20px; }
  span { font-size: 14px; }
`

export const DetailContent = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 64px;
  text-align: center;

  > small { margin-bottom: 10px; color: var(--pt-text-muted); font-weight: 700; }
  > p { max-width: 540px; margin: 22px 0 8px; color: var(--pt-text-muted); line-height: 1.7; white-space: pre-line; }

  @media (max-width: 37.5rem) { padding: 38px 20px; }
`
