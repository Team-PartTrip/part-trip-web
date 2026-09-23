import assert from 'node:assert/strict'
import test from 'node:test'
import { startLocationReporting } from '../src/widgets/location-reporter/model.ts'

test('여행 중 위치 전송은 보이는 화면에서만 보내고 권한·주기·cleanup을 처리한다', async () => {
  const previous = ['window', 'document', 'navigator'].map((key) => Object.getOwnPropertyDescriptor(globalThis, key))
  let visibilityState = 'visible'
  let initialRequest: (() => void) | undefined
  let intervalRequest: (() => void) | undefined
  let visibilityChange: (() => void) | undefined
  let intervalMs = 0
  const cleared: string[] = []
  const locations: Array<{ latitude: number; longitude: number }> = []
  const states: string[] = []
  const requests: Array<{
    success: PositionCallback
    failure: PositionErrorCallback
  }> = []
  const browserWindow = {
    setTimeout: (callback: () => void) => { initialRequest = callback; return 1 },
    clearTimeout: () => { cleared.push('timeout') },
    setInterval: (callback: () => void, delay: number) => { intervalRequest = callback; intervalMs = delay; return 2 },
    clearInterval: () => { cleared.push('interval') },
  }
  const browserDocument = {
    get visibilityState() { return visibilityState },
    addEventListener: (_name: string, listener: () => void) => { visibilityChange = listener },
    removeEventListener: (_name: string, listener: () => void) => { if (visibilityChange === listener) visibilityChange = undefined },
  }
  const browserNavigator = {
    geolocation: {
      getCurrentPosition: (success: PositionCallback, failure: PositionErrorCallback) => requests.push({ success, failure }),
    },
  }
  Object.defineProperty(globalThis, 'window', { configurable: true, value: browserWindow })
  Object.defineProperty(globalThis, 'document', { configurable: true, value: browserDocument })
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: browserNavigator })

  try {
    const reporter = startLocationReporting({
      onState: (state) => states.push(state),
      updateLocation: async (location) => { locations.push(location) },
    })

    assert.equal(intervalMs, 90_000)
    initialRequest?.()
    intervalRequest?.()
    assert.equal(requests.length, 1, 'in-flight GPS 요청은 중복 생성하지 않는다')

    visibilityState = 'hidden'
    requests[0].success({ coords: { latitude: 37.5665, longitude: 126.978 } } as GeolocationPosition)
    assert.deepEqual(locations, [], '화면이 숨겨진 동안 좌표를 전송하지 않는다')

    visibilityState = 'visible'
    visibilityChange?.()
    assert.equal(requests.length, 2)
    requests[1].failure({ code: 1 } as GeolocationPositionError)
    intervalRequest?.()
    assert.equal(requests.length, 2, '권한 거부 후 자동 재요청하지 않는다')
    assert.equal(states.at(-1), 'denied')

    reporter.retry()
    assert.equal(requests.length, 3)
    requests[2].success({ coords: { latitude: 37.5665, longitude: 126.978 } } as GeolocationPosition)
    await new Promise((resolve) => setImmediate(resolve))
    assert.deepEqual(locations, [{ latitude: 37.5665, longitude: 126.978 }])
    assert.equal(states.at(-1), 'shared')

    reporter.retry()
    assert.equal(requests.length, 4)
    reporter.stop()
    requests[3].success({ coords: { latitude: 35.1796, longitude: 129.0756 } } as GeolocationPosition)
    await new Promise((resolve) => setImmediate(resolve))
    assert.deepEqual(locations, [{ latitude: 37.5665, longitude: 126.978 }], 'cleanup 뒤 늦게 도착한 GPS 응답은 전송하지 않는다')
    assert.deepEqual(cleared, ['timeout', 'interval'])
    assert.equal(visibilityChange, undefined)
  } finally {
    for (const [index, key] of ['window', 'document', 'navigator'].entries()) {
      if (previous[index]) Object.defineProperty(globalThis, key, previous[index]!)
      else Reflect.deleteProperty(globalThis, key)
    }
  }
})
