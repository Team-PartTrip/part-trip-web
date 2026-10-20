import assert from 'node:assert/strict'
import test from 'node:test'
import { AxiosError } from 'axios'
import { parsePlannerInviteCode } from '../src/widgets/planner/model/invite-code.ts'
import { getErrorMessage } from '../src/shared/utils/errorMessage.ts'
import { createTestJiti } from './helpers.ts'

const { uniqueNotifications } = await createTestJiti().import('./src/widgets/notifications/model/notification-presentation.ts') as {
  uniqueNotifications: <T extends { notificationId?: number }>(items: T[]) => T[]
}

test('초대 코드와 링크를 받아 코드만 서버에 전달한다', () => {
  assert.equal(parsePlannerInviteCode(' abc_123 '), 'abc_123')
  assert.equal(parsePlannerInviteCode('https://dandi-trip.me/planner/group?inviteCode=abc-123'), 'abc-123')
  for (const invalid of ['', 'a b', '<b>code</b>', 'https://dandi-trip.me/planner', 'https://']) assert.equal(parsePlannerInviteCode(invalid), '')
})

test('알림 페이지 경계의 같은 ID는 한 번만, 다른 ID는 같은 본문이어도 유지한다', () => {
  const entries = [{ notificationId: 1, body: '참여했어요' }, { notificationId: 1, body: '참여했어요' }, { notificationId: 2, body: '참여했어요' }, { body: 'ID 없음' }]
  assert.deepEqual(uniqueNotifications(entries), [entries[0], entries[2], entries[3]])
})

test('서버 사유 문장은 유지하고 HTML 오류 페이지는 사용자에게 표시하지 않는다', () => {
  const error = (data: unknown) => new AxiosError('Request failed with status code 400', undefined, undefined, undefined, { data, status: 400, statusText: 'Bad Request', headers: {}, config: {} as never })
  assert.equal(getErrorMessage(error({ message: '여행이 시작된 뒤에는 플래너에서 나갈 수 없습니다.' })), '여행이 시작된 뒤에는 플래너에서 나갈 수 없습니다.')
  assert.equal(getErrorMessage(error('유효하지 않은 초대 코드입니다.')), '유효하지 않은 초대 코드입니다.')
  assert.equal(getErrorMessage(error('<html><h1>Bad request</h1></html>'), '다시 시도해주세요.'), '다시 시도해주세요.')
})
