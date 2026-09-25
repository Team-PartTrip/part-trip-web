export type PhotoDraft = { file: File; url: string };

export function removeUploadedPhoto(
  current: PhotoDraft[],
  uploaded: PhotoDraft,
) {
  return current.filter((photo) => photo !== uploaded);
}

export function clearCommentIfUnchanged(
  current: string,
  submitted: string,
  hasPendingDrafts: boolean,
) {
  return current === submitted && !hasPendingDrafts ? "" : current;
}

export function tryStartPhotoBatch(lock: { current: boolean }) {
  if (lock.current) return false;
  lock.current = true;
  return true;
}
