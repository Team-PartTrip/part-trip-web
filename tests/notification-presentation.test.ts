import assert from 'node:assert/strict'
import test from 'node:test'
import { createTestJiti } from './helpers.ts'

const jiti = createTestJiti()
const { getDetailState } = await jiti.import('./src/shared/utils/status.ts') as {
  getDetailState: (input: { hasData: boolean; isError: boolean; isLoading: boolean }) => string
}
const { detailActionLabel, detailCopy, sectionLabel, matchesNotificationFilter, settingCopy, categoryTone } = await jiti.import('./src/widgets/notifications/model/notification-presentation.ts') as {
  settingCopy: (type?: string, category?: string) => string[]
  categoryTone: (type?: string) => string
  matchesNotificationFilter: (notification: { type?: string; category?: string; linkType?: string }, filter: string) => boolean
  detailActionLabel: (notification: { linkType?: string; linkId?: number }) => string | undefined
  detailCopy: (notification: { linkType?: string; title?: string; body?: string }) => { body: string; title: string }
  sectionLabel: (
    notifications: Array<{ createdAt?: string; read?: boolean }>,
    index: number,
    todayUnreadCount: number,
    firstUnreadTodayIndex: number,
  ) => string | undefined
}

test('보호자 연결 알림은 서버 문구를 유지하고 보호자 이름과 이동 동작을 제공한다', () => {
  assert.deepEqual(settingCopy('GUARDIAN_LINKED', 'GROUP'), ['보호자', '보호자 연결 알림'])
  assert.equal(categoryTone('GUARDIAN_LINKED'), 'success')
  assert.equal(detailActionLabel({ linkType: ' guardian_link ', linkId: 11 }), '보호자 연결 보러가기')
  assert.equal(detailActionLabel({ linkType: 'GUARDIAN_LINK' }), '보호자 연결 보러가기')
  assert.deepEqual(detailCopy({ linkType: 'GUARDIAN_LINK', title: '가족 연결', body: '홍길동님이 보호자로 연결됐어요.' }), {
    title: '가족 연결', body: '홍길동님이 보호자로 연결됐어요.',
  })
  assert.deepEqual(detailCopy({ linkType: 'GUARDIAN_LINK' }), {
    title: '보호자가 연결됐어요', body: '가족 연결 화면에서 연결된 보호자를 확인하세요.',
  })
})

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
  assert.equal(getDetailState({ hasData: false, isError: true, isLoading: false }), 'error')
  assert.equal(getDetailState({ hasData: false, isError: false, isLoading: false }), 'empty')
  assert.equal(getDetailState({ hasData: true, isError: true, isLoading: false }), 'ready')
})

test('일정과 국내 지도 알림에 이동 버튼이 있고 앱과 동일한 탭으로 분류한다', () => {
  assert.equal(detailActionLabel({ linkType: 'PLANNER', linkId: 7 }), '일정 보러가기')
  assert.equal(detailActionLabel({ linkType: 'PLANNER' }), undefined)
  assert.equal(detailActionLabel({ linkType: 'REGION_MAP' }), '지도 보러가기')
  for (const notification of [{ linkType: 'PLANNER' }, { category: 'SCHEDULE' }, { type: 'GROUP_INVITED' }]) {
    assert.equal(matchesNotificationFilter(notification, 'PLANNER'), true)
    assert.equal(matchesNotificationFilter(notification, 'RECORD'), false)
  }
  for (const notification of [{ linkType: 'REGION_MAP' }, { category: 'PHOTO' }, { type: 'TRIP_CARD_CREATED' }]) {
    assert.equal(matchesNotificationFilter(notification, 'RECORD'), true)
    assert.equal(matchesNotificationFilter(notification, 'PLANNER'), false)
  }
})
