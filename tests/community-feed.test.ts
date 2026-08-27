import assert from 'node:assert/strict'
import test from 'node:test'

import { toCommunityFeedPost } from '../src/widgets/community/model/feed.ts'

test('커뮤니티 피드 DTO를 화면 모델로 변환한다', () => {
  assert.deepEqual(
    toCommunityFeedPost(
      {
        commentCount: 2,
        content: '여행 내용',
        images: ['image.jpg'],
        likeCount: 3,
        nickName: '여행자',
        title: undefined,
      },
      '자유게시판',
      'board-1',
      '제목 없는 게시글',
    ),
    {
      author: '여행자',
      category: '자유게시판',
      commentCount: 2,
      content: '여행 내용',
      createdAt: '방금 전',
      id: 'board-1',
      imageUrls: ['image.jpg'],
      likeCount: 3,
      title: '제목 없는 게시글',
    },
  )
})
