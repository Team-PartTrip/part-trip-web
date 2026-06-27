import * as S from './Mainhero.style'

interface Props {
  imageSrc: string
  'aria-label'?: string
}

const MainHero = ({ imageSrc, 'aria-label': ariaLabel = '싱가포르 야경' }: Props) => {
  return (
    <S.Hero $imageUrl={imageSrc} aria-label={ariaLabel}>
      <S.DDay>D - 1488</S.DDay>
      <S.Destination>싱가포르</S.Destination>
      <S.ChangeButton type="button">여행지 변경 &gt;</S.ChangeButton>
    </S.Hero>
  )
}

export default MainHero
