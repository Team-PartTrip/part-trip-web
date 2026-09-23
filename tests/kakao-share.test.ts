import assert from 'node:assert/strict'
import test from 'node:test'

import { buildKakaoCardNewsTemplate } from '../src/shared/libs/kakao-share.ts'

test('카카오 여행 카드뉴스는 사진·설명과 기록 링크가 있는 피드 템플릿을 만든다', () => {
  const url = 'https://parttrip.example/record/17'

  assert.deepEqual(buildKakaoCardNewsTemplate({
    title: '오사카 여행 기록',
    description: '2026.09.10 – 2026.09.17 · 도톤보리',
    imageUrl: 'https://cdn.example/photo.jpg',
    linkUrl: url,
  }), {
    objectType: 'feed',
    content: {
      title: '오사카 여행 기록',
      description: '2026.09.10 – 2026.09.17 · 도톤보리',
      imageUrl: 'https://cdn.example/photo.jpg',
      link: { mobileWebUrl: url, webUrl: url },
    },
    buttons: [{ title: '여행 기록 보기', link: { mobileWebUrl: url, webUrl: url } }],
  })
})
