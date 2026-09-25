import assert from 'node:assert/strict'
import test from 'node:test'

import { clearCommentIfUnchanged, removeUploadedPhoto, tryStartPhotoBatch, type PhotoDraft } from '../src/widgets/trip-cards/model/photo-composer-state.ts'

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
