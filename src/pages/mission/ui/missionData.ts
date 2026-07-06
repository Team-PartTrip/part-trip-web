export type Mission = {
  category: string
  description: string
  emoji?: string
  id: string
  title: string
}

export const missions: Mission[] = [
  {
    category: '기본 미션',
    description: '주변에 칠리크랩 라면을 파는 가게가 있어요.\n한번 도전해보세요!',
    emoji: '🍜',
    id: 'chili-crab',
    title: '칠리크랩 라면 먹기',
  },
  {
    category: '해설카메라 미션',
    description: '물을 뿜는 머라이언 사자와 특이한 사진 한장 어때요?',
    emoji: '🦁',
    id: 'merlion',
    title: '머라이언 사자 보기',
  },
  {
    category: '해설카메라 미션',
    description: '동심의 세계로, 유니버셜 지구본과 함께 기념사진을 찍어요',
    emoji: '🌏',
    id: 'universal',
    title: '유니버셜 지구본 찍기',
  },
  {
    category: '해설카메라 미션',
    description: '노래에 맞춰서 움직이는 라이트쇼, 돗자리는 챙기셨나요?',
    emoji: '💡',
    id: 'supertree',
    title: '슈퍼트리 라이트쇼 구경하기',
  },
  {
    category: '해설카메라 미션',
    description: '만약 플라이어를 이용하시려면, 이용하실 때 조심하세요!\n너무 높아서 떨어질지도 몰라요',
    emoji: '🎡',
    id: 'flyer',
    title: '밤의 플라이어 방문하기',
  },
]
