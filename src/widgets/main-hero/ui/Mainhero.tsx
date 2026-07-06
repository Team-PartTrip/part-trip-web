import * as S from './Mainhero.style'

interface Props {
  dDay?: number
  destination?: string
  imageSrc: string
  'aria-label'?: string
  isLoggedIn?: boolean
  onChangeDestination?: () => void
}

const MainHero = ({
  dDay,
  destination,
  imageSrc,
  'aria-label': ariaLabel = '여행지 야경',
  isLoggedIn = false,
  onChangeDestination,
}: Props) => {
  const dDayText = isLoggedIn && dDay !== undefined ? `D - ${dDay}` : 'D - ?'
  const destinationText = isLoggedIn && destination ? destination : '나만의 여행 계획 세우기'
  const buttonText = isLoggedIn ? '여행지 변경 >' : '계획 시작하기 >'

  return (
    <S.Hero $imageUrl={imageSrc} aria-label={ariaLabel}>
      <S.DDay>{dDayText}</S.DDay>
      <S.Destination>{destinationText}</S.Destination>
      <S.ChangeButton type="button" onClick={onChangeDestination}>{buttonText}</S.ChangeButton>
    </S.Hero>
  )
}

export default MainHero
