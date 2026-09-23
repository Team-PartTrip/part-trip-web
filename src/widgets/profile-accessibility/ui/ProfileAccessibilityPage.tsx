import { AppShell } from '@/widgets/app-shell'
import * as S from './ProfileAccessibilityPage.styles'

export function ProfileAccessibilityPage() {
  return (
    <AppShell>
      <S.Page>
        <header>
          <h1>접근성 설정</h1>
          <p>휴대폰의 글자 크기와 대비 설정을 사용해 더 편하게 볼 수 있어요.</p>
        </header>
        <S.Card>
          <section>
            <h2>글자 크기</h2>
            <p>휴대폰의 디스플레이 또는 손쉬운 사용 설정에서 글자 크기를 조정한 뒤 돌아와주세요.</p>
          </section>
          <section>
            <h2>화면 대비</h2>
            <p>휴대폰의 고대비 또는 대비 증가 설정을 켜면 운영체제가 지원하는 화면에 반영돼요.</p>
          </section>
          <p>기기와 브라우저에 따라 설정이 화면에 반영되는 방식은 다를 수 있어요.</p>
        </S.Card>
      </S.Page>
    </AppShell>
  )
}
