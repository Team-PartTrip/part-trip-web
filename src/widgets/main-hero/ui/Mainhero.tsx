import * as S from './Mainhero.style'

interface Props {
  dDay?: number
  destination?: string
  imageSrc: string
  'aria-label'?: string
  onChangeDestination?: () => void
}

const MainHero = ({ dDay = 1488, destination = '싱가포르', imageSrc, 'aria-label': ariaLabel = '여행지 야경', onChangeDestination }: Props) => {
  return (
    <S.Hero $imageUrl={imageSrc} aria-label={ariaLabel}>
      <S.DDay>D - {dDay}</S.DDay>
      <S.Destination>{destination}</S.Destination>
      <S.ChangeButton type="button" onClick={onChangeDestination}>여행지 변경 &gt;</S.ChangeButton>
    </S.Hero>
  )
}

export default MainHero
