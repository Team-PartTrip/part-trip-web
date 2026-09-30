import type { ReactNode } from 'react'
import { AppShell } from '@/widgets/app-shell'

import * as S from './ProfileInsightPage.styles'

export function ProfileInsightFrame({ children, loadingContent, title, subtitle, wide = false, isLoading, hasError }: {
  children: ReactNode
  loadingContent: ReactNode
  title: string
  subtitle?: string
  wide?: boolean
  isLoading: boolean
  hasError: boolean
}) {
  return (
    <AppShell>
      <S.Page $wide={wide}>
        {!isLoading ? <S.Header $wide={wide} $hasSubtitle={Boolean(subtitle)}><S.Title>{title}</S.Title>{subtitle ? <S.Subtitle>{subtitle}</S.Subtitle> : null}</S.Header> : null}
        {hasError ? <S.State role="alert">여행 기록을 불러오지 못했습니다.</S.State> : null}
        {isLoading ? loadingContent : null}
        {!isLoading && !hasError ? children : null}
      </S.Page>
    </AppShell>
  )
}
