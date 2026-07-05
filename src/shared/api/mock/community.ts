import catAvatarUrl from '@shared/assets/community-avatar-cat.png'
import dogAvatarUrl from '@shared/assets/community-avatar-dog.png'
import italyUrl from '@shared/assets/community-italy.jpg'
import swissUrl from '@shared/assets/community-swiss.jpg'
import vietnamUrl from '@shared/assets/community-vietnam.jpg'

import {
  MOCK_STORAGE_KEYS,
  readMockStorage,
  waitForMock,
  writeMockStorage,
} from './storage'

export type CommunityComment = {
  author: string
  content: string
  id: string
  time: string
}

export type CommunityPost = {
  author: string
  avatarUrl: string
  category: string
  comments: readonly CommunityComment[]
  content: string
  createdAt: string
  destination: string
  id: string
  imageUrls: readonly string[]
  likeCount: number
  title: string
}

export type CreateCommunityPostRequest = Pick<
  CommunityPost,
  'category' | 'content' | 'destination' | 'title'
>

const seedPosts: readonly CommunityPost[] = [
  {
    author: '계획적인 탐험가',
    avatarUrl: catAvatarUrl,
    category: '자유게시판',
    comments: [
      {
        author: '도쿄 산책러',
        content: '부모님과 함께라면 교토역 근처가 이동하기 편했어요.',
        id: 'comment-1',
        time: '8분 전',
      },
      {
        author: '여행하는 민지',
        content: '가와라마치 쪽은 식당이 많아서 저녁 일정에 좋았습니다!',
        id: 'comment-2',
        time: '3분 전',
      },
    ],
    content:
      '다음 달에 부모님을 모시고 교토 3박 4일 여행을 갑니다. 가와라마치와 교토역 근처 중 어디가 이동하기 편할까요? 부모님이 오래 걷기 힘들어하셔서 위치가 좋은 료칸이나 호텔을 추천받고 싶습니다.',
    createdAt: '15분 전',
    destination: '교토, 일본',
    id: '1',
    imageUrls: [],
    likeCount: 8,
    title: '일본 교토 숙소 추천 부탁드려요! ⛩️',
  },
  {
    author: 'TRAVLR 에디터',
    avatarUrl: dogAvatarUrl,
    category: '여행 후기',
    comments: [
      {
        author: '초보 여행자',
        content: '압축 파우치 팁이 정말 유용했어요.',
        id: 'comment-3',
        time: '어제',
      },
    ],
    content:
      '설레는 첫 해외여행, 무엇을 챙겨야 할지 막막하시죠? 꼭 필요한 물건을 먼저 정리하고 압축 파우치를 활용하면 가방 부피를 크게 줄일 수 있습니다. 현지에서 쉽게 구할 수 있는 물건은 과감히 줄여보세요.',
    createdAt: '어제',
    destination: '유럽',
    id: '2',
    imageUrls: [vietnamUrl, italyUrl, swissUrl],
    likeCount: 452,
    title: '초보 여행자를 위한 짐 싸기 꿀팁 TOP 5 🎒',
  },
]

const readPosts = () =>
  readMockStorage<readonly CommunityPost[]>(
    MOCK_STORAGE_KEYS.communityPosts,
    seedPosts,
  )

export async function getCommunityPostMock(postId: string) {
  await waitForMock(250)
  return readPosts().find((post) => post.id === postId) ?? null
}

export async function createCommunityPostMock(
  request: CreateCommunityPostRequest,
) {
  await waitForMock(450)
  const posts = readPosts()
  const post: CommunityPost = {
    ...request,
    author: '김파트',
    avatarUrl: catAvatarUrl,
    comments: [],
    createdAt: '방금 전',
    id: `post-${Date.now()}`,
    imageUrls: [],
    likeCount: 0,
  }

  writeMockStorage(MOCK_STORAGE_KEYS.communityPosts, [post, ...posts])
  return post
}
