import styled from 'styled-components'

export const Page = styled.main`
  position: relative;
  width: 100%;
  min-height: 100%;
`

export const Content = styled.section`
  min-width: 0;
  padding: 0 0 60px;
`

export const Backdrop = styled.div`
  position: absolute;
  z-index: 10;
  inset: 0;
  background: rgb(0 0 0 / 20%);
`

export const State = styled.p`
  color: ${({ theme }) => theme.colors.text.muted};
`
