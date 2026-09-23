import { useState } from 'react'
import { readAccessibilitySettings, saveAccessibilitySettings } from '@/shared/libs/accessibility-settings'
import { AppShell } from '@/widgets/app-shell'
import * as S from './ProfileAccessibilityPage.styles'

export function ProfileAccessibilityPage() {
  const [settings, setSettings] = useState(readAccessibilitySettings)
  const update = (next: typeof settings) => {
    setSettings(next)
    saveAccessibilitySettings(next)
  }

  return (
    <AppShell>
      <S.Page>
        <header>
          <h1>접근성 설정</h1>
          <p>PartTrip 화면의 글자 크기를 조정하고 고대비 색상을 사용할 수 있어요. 기기의 고대비 설정도 함께 반영됩니다.</p>
        </header>
        <S.Card>
          <section>
            <h2>글자 크기</h2>
            <p>선택한 크기는 로그인한 화면에 저장되고 다음 방문에도 적용됩니다.</p>
            <S.Options role="group" aria-label="글자 크기">
              {([['normal', '기본'], ['large', '크게'], ['larger', '더 크게']] as const).map(([value, label]) => (
                <button key={value} type="button" aria-pressed={settings.textSize === value}
                  onClick={() => update({ ...settings, textSize: value })}>{label}</button>
              ))}
            </S.Options>
          </section>
          <section>
            <h2>화면 대비</h2>
            <p>기기 설정이 감지되면 자동으로 고대비를 적용합니다. 아래 설정은 이 기기에 저장됩니다.</p>
            <S.Toggle type="button" aria-pressed={settings.highContrast}
              onClick={() => update({ ...settings, highContrast: !settings.highContrast })}>
              고대비 {settings.highContrast ? '켜짐' : '꺼짐'}
            </S.Toggle>
          </section>
          <p>고대비는 글자 7:1, 주요 테두리 3:1 이상을 목표로 색상을 조정합니다. 브라우저 확대 기능도 사용할 수 있어요.</p>
        </S.Card>
      </S.Page>
    </AppShell>
  )
}
