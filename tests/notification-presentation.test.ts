import assert from 'node:assert/strict'
import test from 'node:test'
import { createTestJiti } from './helpers.ts'

const jiti = createTestJiti()
const { detailActionLabel, detailCopy, getNotificationDetailState, sectionLabel } = await jiti.import('./src/widgets/notifications/model/notification-presentation.ts') as {
  detailActionLabel: (notification: { linkType?: string; linkId?: number }) => string | undefined
  detailCopy: (notification: { linkType?: string; title?: string; body?: string }) => { body: string; title: string }
  getNotificationDetailState?: (input: { hasNotification: boolean; isError: boolean; isLoading: boolean }) => string
  sectionLabel: (
    notifications: Array<{ createdAt?: string; read?: boolean }>,
    index: number,
    todayUnreadCount: number,
    firstUnreadTodayIndex: number,
  ) => string | undefined
}

test('알림 목록은 미리 계산한 첫 미확인 위치에만 오늘 구분을 표시한다', () => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12).toISOString()
  const notifications = [
    { createdAt: today, read: true },
    { createdAt: today, read: false },
  ]

  assert.equal(sectionLabel(notifications, 0, 1, 1), undefined)
  assert.equal(sectionLabel(notifications, 1, 1, 1), '오늘 · 읽지 않음 1')
})

test('알림 링크 유형별 기본 내용과 이동 동작을 반환한다', () => {
  assert.deepEqual(detailCopy({ linkType: 'GROUP' }), {
    body: '여행 그룹의 새로운 소식을 확인하세요.',
    title: '여행 그룹 소식이 있어요',
  })
  assert.equal(detailActionLabel({ linkType: 'GROUP_INVITATION', linkId: 7 }), '초대 확인하기')
  assert.equal(detailActionLabel({ linkType: 'GROUP_INVITATION' }), undefined)
})

test('알림 상세는 API 실패와 찾을 수 없는 알림을 구분한다', () => {
  assert.equal(getNotificationDetailState?.({ hasNotification: false, isError: true, isLoading: false }), 'error')
  assert.equal(getNotificationDetailState?.({ hasNotification: false, isError: false, isLoading: false }), 'empty')
  assert.equal(getNotificationDetailState?.({ hasNotification: true, isError: true, isLoading: false }), 'ready')
})
