import assert from 'node:assert/strict'
import test from 'node:test'

import { clearCommentIfUnchanged, isTripEnded, PHOTO_ACCEPT, selectSupportedPhotos, removeUploadedPhoto, tryStartPhotoBatch, type PhotoDraft } from '../src/widgets/trip-cards/model/photo-composer-state.ts'

const photo = (url: string): PhotoDraft => ({ file: {} as File, url })

test('removing an uploaded draft preserves later drafts and failed batch items', () => {
  const uploaded = photo('uploaded')
  const failed = photo('failed')
  const addedDuringUpload = photo('added-during-upload')

  assert.deepEqual(
    removeUploadedPhoto([uploaded, failed, addedDuringUpload], uploaded),
    [failed, addedDuringUpload],
  )
})

test('only one photo batch can hold the upload lock at a time', () => {
  const lock = { current: false }

  assert.equal(tryStartPhotoBatch(lock), true)
  assert.equal(tryStartPhotoBatch(lock), false)
  lock.current = false
  assert.equal(tryStartPhotoBatch(lock), true)
})

test('comment edits made during upload are retained', () => {
  assert.equal(clearCommentIfUnchanged('new comment', 'submitted comment', false), 'new comment')
  assert.equal(clearCommentIfUnchanged('submitted comment', 'submitted comment', false), '')
  assert.equal(clearCommentIfUnchanged('submitted comment', 'submitted comment', true), 'submitted comment')
})

test('only server-supported photo MIME types survive a mixed selection', () => {
  const files = [
    new File(['jpeg'], 'photo.jpg', { type: 'image/jpeg' }),
    new File(['png'], 'photo.png', { type: 'image/png' }),
    new File(['webp'], 'photo.webp', { type: 'image/webp' }),
    new File(['heic'], 'photo.heic', { type: 'image/heic' }),
    new File(['gif'], 'photo.gif', { type: 'image/gif' }),
    new File(['text'], 'renamed.jpg', { type: 'text/plain' }),
    new File(['unknown'], 'unknown.jpg'),
  ]
  const result = selectSupportedPhotos(files)
  assert.deepEqual(result.accepted, files.slice(0, 3))
  for (const file of files.slice(3)) assert.ok(result.message.includes(file.name))
  assert.match(result.message, /JPEG, PNG, WebP/)
  assert.equal(PHOTO_ACCEPT, 'image/jpeg,image/png,image/webp')
  assert.equal(selectSupportedPhotos(files.slice(0, 3)).message, '')
  assert.deepEqual(selectSupportedPhotos(files.slice(3)).accepted, [])
})

test('trip upload cutoff uses the Korean calendar day and permits the end day', () => {
  const beforeMidnight = new Date('2026-10-20T14:59:59Z')
  const midnight = new Date('2026-10-20T15:00:00Z')
  assert.equal(isTripEnded('2026-10-19', beforeMidnight), true)
  assert.equal(isTripEnded('2026-10-20', beforeMidnight), false)
  assert.equal(isTripEnded('2026-10-21', beforeMidnight), false)
  assert.equal(isTripEnded('2026-10-20', midnight), true)
  for (const date of [undefined, '', 'invalid', '2026-02-30']) {
    assert.equal(isTripEnded(date, midnight), false)
  }
})
