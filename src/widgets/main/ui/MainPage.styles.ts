import styled from 'styled-components'

export const Page = styled.div`
  width: min(100%, 1200px);
  margin: 0 auto;
`

export const Header = styled.header`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 24px;
`

export const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: clamp(26px, 3vw, 32px);
  font-weight: 700;
  line-height: 40px;
`

export const Subtitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 15px;
  line-height: 22px;
`

export const Error = styled.p`
  margin: 0 0 16px;
  color: ${({ theme }) => theme.colors.status.error};
  font-size: 14px;
`

export const State = styled.p`
  margin: 80px 0;
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
`

export const EmptyCard = styled.section`
  display: flex;
  min-height: 300px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 28px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};

  strong { color: ${({ theme }) => theme.colors.text.strong}; font-size: 18px; }
  span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 14px; }
`

export const HeroRow = styled.section`
  display: grid;
  gap: 24px;
  grid-template-columns: 360px minmax(0, 1fr);
  margin-bottom: 24px;

  @media (max-width: 900px) { grid-template-columns: 1fr; }
`

export const TripCard = styled.article`
  overflow: hidden;
  border-radius: 28px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};
`

export const TripImage = styled.img`
  display: block;
  width: 100%;
  height: 170px;
  object-fit: cover;
`

export const TripBody = styled.div`
  display: flex;
  height: 148px;
  flex-direction: column;
  gap: 8px;
  padding: 20px 24px;

  strong { color: ${({ theme }) => theme.colors.text.strong}; font-size: 18px; line-height: 24px; }
  > span { color: ${({ theme }) => theme.colors.text.muted}; font-size: 13px; line-height: 18px; }
`

export const TripStatus = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
`

export const DdayCard = styled.section`
  display: flex;
  min-height: 318px;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  border-radius: 28px;
  padding: 32px 36px;
  background: ${({ theme }) => theme.colors.brand.strong};
  color: ${({ theme }) => theme.colors.text.inverse};
`

export const Eyebrow = styled.span`
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
`

export const Dday = styled.strong`
  font-size: clamp(40px, 5vw, 52px);
  line-height: 60px;
`

export const Destination = styled.strong`
  font-size: 24px;
  line-height: 32px;
`

export const Dates = styled.span`
  font-size: 15px;
  line-height: 22px;
`

export const ActionButton = styled.button`
  min-height: 46px;
  border: 1px solid ${({ theme }) => theme.colors.brand.strong};
  border-radius: 12px;
  padding: 12px 24px;
  background: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.brand.strong};
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;

  &:hover { background: ${({ theme }) => theme.colors.background.muted}; }

  ${DdayCard} & { margin-top: 4px; }
`

export const LowerGrid = styled.section`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-bottom: 24px;

  @media (max-width: 700px) { grid-template-columns: 1fr; }
`

export const InfoCard = styled.section`
  display: flex;
  min-height: 198px;
  flex-direction: column;
  gap: 12px;
  border-radius: 20px;
  padding: 20px 24px;
  background: ${({ theme }) => theme.colors.background.default};
`

export const CardTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.text.strong};
  font-size: 15px;
  font-weight: 600;
  line-height: 20px;
`

export const ProgressTrack = styled.div`
  height: 8px;
  overflow: hidden;
  border-radius: 4px;
  background: #e3ebf2;
`

export const ProgressBar = styled.div<{ $progress: number }>`
  width: ${({ $progress }) => `${$progress}%`};
  height: 100%;
  border-radius: inherit;
  background: ${({ theme }) => theme.colors.brand.primary};
`

export const StatusGrid = styled.div`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
`

export const StatusItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  border-radius: 12px;
  padding: 12px 4px;
  background: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 11px;

  b { color: ${({ theme }) => theme.colors.brand.successStrong}; font-size: 13px; }
  b[data-warning='true'] { color: #ff7a35; }
`

export const TodoButton = styled.button`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 2px 12px;
  border: 0;
  padding: 12px 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.text.strong};
  cursor: pointer;
  text-align: left;

  span { font-size: 14px; font-weight: 600; }
  small { color: ${({ theme }) => theme.colors.text.muted}; font-size: 12px; }
  b { grid-column: 2; grid-row: 1 / span 2; color: ${({ theme }) => theme.colors.text.muted}; font-size: 20px; }
`

export const Recommendations = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const RecommendationGrid = styled.div`
  display: grid;
  gap: 24px;
  grid-template-columns: repeat(3, minmax(0, 1fr));

  @media (max-width: 700px) { grid-template-columns: 1fr; }
`

export const Recommendation = styled.article`
  overflow: hidden;
  border-radius: 12px;
  background: ${({ theme }) => theme.colors.background.default};

  img { display: block; width: 100%; height: 92px; object-fit: cover; }
  span, small { display: block; padding-inline: 20px; }
  span { padding-top: 14px; color: ${({ theme }) => theme.colors.text.strong}; font-size: 14px; font-weight: 600; }
  small { padding-top: 2px; padding-bottom: 14px; color: ${({ theme }) => theme.colors.text.muted}; font-size: 12px; }
`

export const RecommendationEmpty = styled.p`
  grid-column: 1 / -1;
  margin: 0;
  color: ${({ theme }) => theme.colors.text.muted};
  font-size: 14px;
`

export const InsightGrid = styled.section`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  margin-top: 32px;

  @media (max-width: 1000px) { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  @media (max-width: 640px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }
`

export const InsightCard = styled.article`
  display: flex;
  min-height: 120px;
  flex-direction: column;
  gap: 6px;
  border-radius: 16px;
  padding: 16px;
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: ${({ theme }) => theme.shadows.subtle};

  small { color: ${({ theme }) => theme.colors.text.muted}; font-size: 11px; }
  strong { overflow: hidden; color: ${({ theme }) => theme.colors.text.strong}; font-size: 14px; text-overflow: ellipsis; white-space: nowrap; }
  span { overflow: hidden; color: ${({ theme }) => theme.colors.text.muted}; font-size: 12px; text-overflow: ellipsis; white-space: nowrap; }
`
