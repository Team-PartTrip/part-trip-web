import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const projectRoot = fileURLToPath(new URL('..', import.meta.url))
const read = (path: string) => readFileSync(`${projectRoot}${path}`, 'utf8')

test('삭제된 기능의 라우트와 공유 여행 API가 남지 않는다', () => {
  const retiredDirectories = [
    '/src/entities/community',
    '/src/entities/file',
    '/src/entities/mission',
    '/src/entities/travel-record',
    '/src/routes/(app)/_authenticated/community',
    '/src/routes/(app)/_authenticated/mission',
    '/src/routes/(app)/_authenticated/record/camera',
    '/src/widgets/community',
    '/src/widgets/community-detail',
    '/src/widgets/community-write',
    '/src/widgets/mission',
    '/src/widgets/record-camera',
  ]
  const retiredFiles = [
    '/src/shared/assets/community-avatar-cat.png',
    '/src/shared/assets/community-avatar-dog.png',
    '/src/shared/assets/community-destination-danang.jpg',
    '/src/shared/assets/community-destination-swiss.jpg',
    '/src/shared/assets/community-destination-tokyo.jpg',
    '/src/shared/assets/community-italy.jpg',
    '/src/shared/assets/community-swiss.jpg',
    '/src/shared/assets/community-vietnam.jpg',
    '/src/shared/assets/mission-character.png',
  ]

  assert.deepEqual(retiredDirectories.filter((path) => existsSync(`${projectRoot}${path}`)), [])
  assert.deepEqual(retiredFiles.filter((path) => existsSync(`${projectRoot}${path}`)), [])
  assert.doesNotMatch(read('/src/routeTree.gen.ts'), /community|mission|record\/camera/)
  assert.doesNotMatch(read('/src/shared/config/paths.ts'), /(?:community|communityWrite|mission|recordCamera):/)
  assert.doesNotMatch(read('/src/widgets/sidebar/constants/sidebar-item.ts'), /community|mission|recordCamera|record\/camera/)
  assert.doesNotMatch(read('/src/entities/user/api.ts'), /themes|TravelTheme|travelTheme/)
  assert.doesNotMatch(read('/src/entities/trip-card/api.ts'), /SharedTrip|listSharedTrips|shareTrip|importTrip|getSharedTrip/)
  assert.doesNotMatch(read('/src/entities/trip-card/mutations.ts'), /ShareTrip|ImportTrip|SharedTrip|communityQueryKeys/)
  assert.doesNotMatch(read('/src/entities/trip-card/index.ts'), /SharedTrip|listSharedTrips|shareTrip|importTrip|getSharedTrip/)
  assert.doesNotMatch(read('/src/widgets/trip-cards/ui/TripCardsPage.tsx'), /entities\/file/)
})
