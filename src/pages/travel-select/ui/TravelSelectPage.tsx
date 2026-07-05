import { useNavigate } from 'react-router-dom'
import logoUrl from '@shared/assets/logo.png'
import { paths } from '@shared/config'
import { DestinationSelector } from '@widgets/destination-selector'
import { MENUS, Sidebar } from '@widgets/sidebar'

import * as S from './TravelSelectPage.styles'

export function TravelSelectPage() {
  const navigate = useNavigate()
  return (
    <S.Page>
      <Sidebar logo={<S.Logo><img src={logoUrl} alt="PartTrip" /></S.Logo>} menus={MENUS} />
      <DestinationSelector onBack={() => navigate(paths.main)} />
    </S.Page>
  )
}
