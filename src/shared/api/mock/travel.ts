import { MOCK_STORAGE_KEYS, readMockStorage, waitForMock, writeMockStorage } from './storage'

export type Destination = {
  country: string
  currency: string
  id: string
  name: string
}

export const destinations: readonly Destination[] = [
  { country: '싱가포르', currency: 'SGD', id: 'singapore', name: '싱가포르' },
  { country: '베트남', currency: 'VND', id: 'da-nang', name: '다낭' },
  { country: '일본', currency: 'JPY', id: 'tokyo', name: '도쿄' },
  { country: '태국', currency: 'THB', id: 'bangkok', name: '방콕' },
]

export async function getDestinationsMock(query = '') {
  await waitForMock(250)
  const keyword = query.trim().toLocaleLowerCase()
  return keyword
    ? destinations.filter((destination) =>
        `${destination.name} ${destination.country}`.toLocaleLowerCase().includes(keyword),
      )
    : destinations
}

export async function getSelectedDestinationMock() {
  await waitForMock(200)
  return readMockStorage(MOCK_STORAGE_KEYS.selectedDestination, destinations[0])
}

export async function selectDestinationMock(destination: Destination) {
  await waitForMock(250)
  return writeMockStorage(MOCK_STORAGE_KEYS.selectedDestination, destination)
}
