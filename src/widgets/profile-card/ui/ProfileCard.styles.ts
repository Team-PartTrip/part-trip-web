import styled from 'styled-components'

export const Card = styled.section`
  position: relative;
  width: min(48rem, 100%);
  border: 0.0625rem solid #e7edf7;
  border-radius: 2rem;
  padding: clamp(1.5rem, 5vw, 3rem);
  background: ${({ theme }) => theme.colors.background.default};
  box-shadow: 0 1rem 3rem rgb(13 31 64 / 9%);
`

export const Avatar = styled.div`
  display: grid;
  width: 6rem;
  height: 6rem;
  margin-bottom: 1.5rem;
  border-radius: 2rem;
  place-items: center;
  background: linear-gradient(145deg, #5587f6, #0c96f5);
  color: white;
  font-size: 2rem;
  font-weight: 800;
`

export const Header = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;

  h1, p {
    margin: 0;
  }

  h1 {
    color: ${({ theme }) => theme.colors.text.strong};
    font-size: clamp(1.75rem, 5vw, 2.5rem);
  }

  p {
    margin-top: 0.35rem;
    color: ${({ theme }) => theme.colors.text.muted};
  }

  @media (max-width: 36rem) {
    flex-direction: column;
  }
`

export const Eyebrow = styled.span`
  display: block;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.12em;
`

export const EditButton = styled.button`
  min-height: 2.75rem;
  border: 0.0625rem solid ${({ theme }) => theme.colors.brand.primary};
  border-radius: ${({ theme }) => theme.radii.button};
  padding: 0 1.25rem;
  background: white;
  color: ${({ theme }) => theme.colors.brand.strong};
  cursor: pointer;
  font: inherit;
  font-weight: 700;
`

export const StyleBadge = styled.strong`
  display: inline-flex;
  margin-top: 2rem;
  border-radius: ${({ theme }) => theme.radii.round};
  padding: 0.55rem 1rem;
  background: #edf4ff;
  color: ${({ theme }) => theme.colors.brand.strong};
  font-size: 0.875rem;
`

export const Bio = styled.p`
  margin: 1rem 0 2rem;
  color: ${({ theme }) => theme.colors.text.muted};
  line-height: 1.7;
`

export const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;

  div {
    min-width: 0;
    border-radius: 1rem;
    padding: 1rem;
    background: ${({ theme }) => theme.colors.background.muted};
  }

  span, strong {
    display: block;
  }

  span {
    margin-bottom: 0.4rem;
    color: ${({ theme }) => theme.colors.text.muted};
    font-size: 0.75rem;
  }

  strong {
    overflow: hidden;
    color: ${({ theme }) => theme.colors.text.strong};
    font-size: 0.9rem;
    text-overflow: ellipsis;
  }

  @media (max-width: 44rem) {
    grid-template-columns: 1fr;
  }
`
