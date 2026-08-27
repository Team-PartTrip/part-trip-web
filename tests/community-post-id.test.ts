import assert from 'node:assert/strict'
import test from 'node:test'

import { parseCommunityPostId } from '../src/entities/community/post-id.ts'

test('커뮤니티 게시글 ID는 허용된 타입과 양의 정수만 파싱한다', () => {
  assert.deepEqual(parseCommunityPostId('review-42'), { id: 42, type: 'review' })
  assert.equal(parseCommunityPostId('review-'), null)
  assert.equal(parseCommunityPostId('review-0'), null)
  assert.equal(parseCommunityPostId('review-42-extra'), null)
  assert.equal(parseCommunityPostId('notice-42'), null)
})
