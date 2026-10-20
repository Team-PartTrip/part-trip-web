import { isValidDateOnly } from '../../../shared/utils/date.ts';

const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const PHOTO_ACCEPT = PHOTO_TYPES.join(',');
export const TRIP_ENDED_NOTICE = '여행이 끝난 카드에는 사진을 더 붙일 수 없어요';

export function isTripEnded(endDate?: string, now = new Date()) {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
  return isValidDateOnly(endDate) && endDate < today;
}

export function selectSupportedPhotos(files: File[]) {
  const accepted = files.filter((file) => PHOTO_TYPES.includes(file.type));
  const rejected = files.filter((file) => !PHOTO_TYPES.includes(file.type));
  return {
    accepted,
    message: rejected.length > 0
      ? `${rejected.map((file) => file.name).join(', ')}: 지원하지 않는 사진 형식이라 제외했어요. JPEG, PNG, WebP 파일로 바꿔주세요.`
      : '',
  };
}

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
