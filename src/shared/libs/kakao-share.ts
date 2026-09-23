export type KakaoCardNewsInput = {
  title: string
  description: string
  imageUrl: string
  linkUrl: string
}

export function buildKakaoCardNewsTemplate({ title, description, imageUrl, linkUrl }: KakaoCardNewsInput): KakaoShareDefaultFeedOptions {
  const link = { mobileWebUrl: linkUrl, webUrl: linkUrl }
  return {
    objectType: 'feed',
    content: { title, description, imageUrl, link },
    buttons: [{ title: '여행 기록 보기', link }],
  }
}

export function shareKakaoCardNews(input: KakaoCardNewsInput) {
  const appKey = import.meta.env?.VITE_KAKAO_JAVASCRIPT_KEY?.trim()
  if (!appKey) throw new Error('카카오 JavaScript 키 설정이 없습니다.')

  const kakao = window.Kakao
  if (!kakao?.Share?.sendDefault) throw new Error('카카오 공유 SDK를 불러오지 못했습니다.')
  if (!kakao.isInitialized()) kakao.init(appKey)
  kakao.Share.sendDefault(buildKakaoCardNewsTemplate(input))
}
