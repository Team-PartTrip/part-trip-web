import { Link } from '@tanstack/react-router'
import { paths } from '@/shared/config'

import * as S from './NotFoundPage.styles'

export function NotFoundPage() {
  return <S.Page><S.Code>404</S.Code><h1>페이지를 찾을 수 없습니다.</h1><p>주소를 다시 확인하거나 메인 화면으로 이동해주세요.</p><Link to={paths.main}>메인으로 이동</Link></S.Page>
}
