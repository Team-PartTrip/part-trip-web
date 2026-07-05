import logoUrl from '@shared/assets/logo.png'
import missionCharacterUrl from '@shared/assets/mission-character.png'
import { MENUS, Sidebar } from '@widgets/sidebar'

import * as S from './MissionPage.styles'

const missions = [
  ['기본 미션', '칠리크랩 라면 먹기 🍜', '준비해 칠리크랩 라면을 파는 가게가 있어요.\n한번 도전해보세요!'],
  ['해설카메라 미션', '머라이언 사자 보기 🦁', '물을 뿜는 머라이언 사자와 특이한 사진 한장 어때요?'],
  ['해설카메라 미션', '유니버셜 지구본 찍기 🌏', '동심의 세계로, 유니버셜 지구본과 함께 기념사진을 찍어요'],
  ['해설카메라 미션', '슈퍼트리 라이트쇼 구경하기 💡', '노래에 맞춰서 움직이는 라이트쇼, 주저리는 챙기셨나요?'],
  ['해설카메라 미션', '밤의 플라이어 방문하기', '만약 플라이어를 이용하시려면, 이용하실 때 조심하세요!'],
] as const

export function MissionPage() {
  return (
    <S.Page>
      <Sidebar logo={<S.Logo src={logoUrl} alt="PartTrip" />} menus={MENUS} />
      <S.Content>
        <S.CharacterCard>
          <S.CardActions><span>▣</span><span>●</span></S.CardActions>
          <S.Speech>나랑 놀자</S.Speech>
          <img src={missionCharacterUrl} alt="까미 캐릭터" />
          <S.CharacterName><small>알</small> 까미</S.CharacterName>
          <S.Progress><span /></S.Progress>
        </S.CharacterCard>
        <S.MissionPanel>
          <S.Title>미션 <span>New</span></S.Title>
          <S.MissionList>
            {missions.map(([category, title, description]) => (
              <S.MissionCard key={title}>
                <small>{category}</small><h2>{title}</h2><p>{description}</p>
              </S.MissionCard>
            ))}
          </S.MissionList>
        </S.MissionPanel>
      </S.Content>
    </S.Page>
  )
}
