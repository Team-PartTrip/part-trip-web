import assert from 'node:assert/strict'
import test from 'node:test'
import { heroImageOf } from '../src/widgets/main/model/hero-image.ts'

test('홈 배경은 사진이 있는 명소를 우선하고 없으면 첫 사진을 사용한다', () => {
  assert.equal(heroImageOf([
    { category: '맛집', imageUrl: '/food.jpg' },
    { category: '명소' },
    { category: '명소', imageUrl: ' /landmark.jpg ' },
  ]), '/landmark.jpg')
  assert.equal(heroImageOf([{ category: '명소', imageUrl: ' ' }, { category: '카페', imageUrl: '/cafe.jpg' }]), '/cafe.jpg')
  assert.equal(heroImageOf([]), undefined)
  assert.equal(heroImageOf([{ category: '명소', imageUrl: ' ' }]), undefined)
})
