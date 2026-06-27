import type { DiagnosisQuestionData } from './types'

export const DIAGNOSIS_QUESTIONS = [
  {
    id: 'preparation',
    question: '내일 여행을 떠나기 전날 밤, 나의 모습은?',
    options: [
      {
        id: 'check-everything',
        label: '일정 검토하고 짐 다 챙겼는지 하나씩 체크하기',
      },
      {
        id: 'buy-if-needed',
        label: '필수품만 챙기고 필요하면 가서 산다는 마인드',
      },
    ],
  },
  {
    id: 'transportation',
    question: '이동 수단이나 교통편에 대해 나는?',
    options: [
      {
        id: 'reserve-ahead',
        label: '이용할 이동 수단을 미리 예약해두기',
      },
      {
        id: 'decide-when-moving',
        label: '이동해야 할 때 구글 맵 켜서 이동 수단 정하기',
      },
    ],
  },
  {
    id: 'closed-destination',
    question: '가려던 곳이 갑자기 문을 닫았다면?',
    options: [
      {
        id: 'use-plan-b',
        label: '준비해 둔 플랜 B로 이동하기',
      },
      {
        id: 'visit-nearby-cafe',
        label: '오히려 좋아하며 근처 카페로 들어가기',
      },
    ],
  },
  {
    id: 'budget',
    question: '나에게 여행 예산(비용)이란?',
    options: [
      {
        id: 'set-category-limits',
        label: '항목별 하루 지출 한도를 정해두고 맞춰 쓰기',
      },
      {
        id: 'spend-then-adjust',
        label: '일단 쓰고 싶은 곳에 쓰고, 나중 가서 조절하기',
      },
    ],
  },
  {
    id: 'companion-suggestion',
    question: '동행자가 일정에 없는 일을 제안할 때?',
    options: [
      {
        id: 'keep-plan',
        label: '원래 계획이 있으니 안 된다고 이야기하기',
      },
      {
        id: 'follow-suggestion',
        label: '괜찮은 것 같으니 바로 따라 가기',
      },
    ],
  },
  {
    id: 'arrival',
    question: '목적지 도착 후 나의 첫 행동은?',
    options: [
      {
        id: 'take-in-scenery',
        label: '주변 풍경과 분위기를 먼저 느끼기',
      },
      {
        id: 'open-camera',
        label: '지금 장면을 담기 위해 스마트폰을 키기',
      },
    ],
  },
  {
    id: 'in-transit',
    question: '교통편을 타고 다음으로 이동할 때 나는?',
    options: [
      {
        id: 'watch-scenery',
        label: '창밖을 바라보며 주변 경치를 구경하기',
      },
      {
        id: 'organize-photos',
        label: '이동하는 동안 사진을 정리하기',
      },
    ],
  },
  {
    id: 'heritage-tour',
    question: '유적지 투어 시 내가 더 선호하는 방식은?',
    options: [
      {
        id: 'research-exhibits',
        label: '궁금한 전시물을 인터넷에 찾아보기',
      },
      {
        id: 'record-exhibits',
        label: '전시물 사진을 찍어서 방문한 걸 기록하기',
      },
    ],
  },
  {
    id: 'after-schedule',
    question: '일정을 모두 마치기 숙소로 왔을 때 나는?',
    options: [
      {
        id: 'go-out-nearby',
        label: '숙소 근처 야시장이나 로컬 펍에 나가기',
      },
      {
        id: 'record-the-day',
        label: '일기를 쓰거나 찍은 사진을 SNS에 올리기',
      },
    ],
  },
] as const satisfies readonly DiagnosisQuestionData[]
