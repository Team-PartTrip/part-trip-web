import { useNavigate } from 'react-router-dom'
import logoUrl from '@shared/assets/logo.svg'
import { paths } from '@shared/config'
import { MENUS, Sidebar } from '@widgets/sidebar'

import * as S from './DemoSectionPage.styles'

type DemoSectionPageProps = {
  description: string
  items: readonly string[]
  title: string
}

export function DemoSectionPage({ description, items, title }: DemoSectionPageProps) {
  const navigate = useNavigate()
  return (
    <S.Page>
      <Sidebar logo={<S.Logo><img src={logoUrl} alt="PartTrip" /></S.Logo>} menus={MENUS} />
      <S.Content>
        <S.Header><span>PARTTRIP</span><h1>{title}</h1><p>{description}</p></S.Header>
        <S.Grid>{items.map((item, index) => <S.Card key={item}><strong>0{index + 1}</strong><p>{item}</p><span>시연용 콘텐츠</span></S.Card>)}</S.Grid>
        <S.HomeButton type="button" onClick={() => navigate(paths.main)}>메인으로 돌아가기</S.HomeButton>
      </S.Content>
    </S.Page>
  )
}
