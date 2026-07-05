import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getDiagnosisResultMock,
  type DiagnosisResult,
} from '@shared/api'
import { paths } from '@shared/config'

import * as S from './DiagnosisResultPage.styles'

export function DiagnosisResultPage() {
  const navigate = useNavigate()
  const [result, setResult] = useState<DiagnosisResult | null>(null)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let isMounted = true

    void getDiagnosisResultMock()
      .then((nextResult) => {
        if (isMounted) setResult(nextResult)
      })
      .catch(() => {
        if (isMounted) setHasError(true)
      })

    return () => {
      isMounted = false
    }
  }, [])

  if (hasError) {
    return (
      <S.Page>
        <S.Card>
          <S.Eyebrow>여행 성향 진단</S.Eyebrow>
          <S.Title>결과를 불러오지 못했습니다.</S.Title>
          <S.Description>진단을 다시 진행하면 새로운 결과를 확인할 수 있습니다.</S.Description>
          <S.PrimaryButton type="button" onClick={() => navigate(paths.diagnosis)}>
            진단 다시 하기
          </S.PrimaryButton>
        </S.Card>
      </S.Page>
    )
  }

  if (!result) {
    return (
      <S.Page aria-busy="true">
        <S.Card>
          <S.LoadingDot aria-hidden="true" />
          <S.Description>여행 성향을 분석하고 있습니다.</S.Description>
        </S.Card>
      </S.Page>
    )
  }

  return (
    <S.Page>
      <S.Card>
        <S.Eyebrow>나의 여행 성향</S.Eyebrow>
        <S.Badge aria-hidden="true">✦</S.Badge>
        <S.Title>{result.title}</S.Title>
        <S.Description>{result.description}</S.Description>
        <S.HighlightList>
          {result.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </S.HighlightList>
        <S.Actions>
          <S.SecondaryButton type="button" onClick={() => navigate(paths.diagnosis)}>
            다시 진단하기
          </S.SecondaryButton>
          <S.PrimaryButton type="button" onClick={() => navigate(paths.main, { replace: true })}>
            여행 준비 시작
          </S.PrimaryButton>
        </S.Actions>
      </S.Card>
    </S.Page>
  )
}
