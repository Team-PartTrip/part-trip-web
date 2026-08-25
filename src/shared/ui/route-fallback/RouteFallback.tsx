import * as S from './RouteFallback.styles'

export function RouteFallback() {
  return (
    <S.Page role="status" aria-live="polite">
      <S.Spinner aria-hidden="true" />
      <span>화면을 준비하고 있습니다.</span>
    </S.Page>
  )
}
