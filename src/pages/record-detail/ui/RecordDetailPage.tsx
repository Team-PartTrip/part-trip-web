import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getTravelRecordMock, type TravelRecord } from '@shared/api'
import logoUrl from '@shared/assets/logo.png'
import { paths } from '@shared/config'
import { MENUS, Sidebar } from '@widgets/sidebar'

import * as S from './RecordDetailPage.styles'

const formatDate = (value: string) => value.replaceAll('-', '.')

export function RecordDetailPage() {
  const navigate = useNavigate()
  const { recordId = '' } = useParams()
  const [record, setRecord] = useState<TravelRecord | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    void getTravelRecordMock(recordId).then((nextRecord) => {
      if (isMounted) {
        setRecord(nextRecord)
        setIsLoading(false)
      }
    })

    return () => {
      isMounted = false
    }
  }, [recordId])

  return (
    <S.Page>
      <Sidebar logo={<S.Logo src={logoUrl} alt="PartTrip" />} menus={MENUS} />
      <S.Content>
        <S.TopBar>
          <button type="button" onClick={() => navigate(paths.record)}>← 여행 기록</button>
          <button type="button" onClick={() => navigate(paths.recordWrite)}>새 기록 작성</button>
        </S.TopBar>

        {isLoading ? (
          <S.StateCard>여행 기록을 불러오고 있습니다.</S.StateCard>
        ) : record ? (
          <S.Layout>
            <S.Hero>
              <img src={record.imageUrl} alt={`${record.destination} 여행`} />
              <S.HeroOverlay>
                <span>{record.destination}</span>
                <h1>{record.title}</h1>
                <p>{formatDate(record.startDate)} - {formatDate(record.endDate)}</p>
              </S.HeroOverlay>
            </S.Hero>
            <S.Body>
              <S.Memo><h2>여행 메모</h2><p>{record.memo}</p></S.Memo>
              <S.Schedule>
                <h2>여행 일정</h2>
                {record.schedule.map((schedule) => (
                  <article key={schedule.day}><strong>{schedule.day}</strong><ul>{schedule.items.map((item) => <li key={item}>{item}</li>)}</ul></article>
                ))}
              </S.Schedule>
            </S.Body>
            <S.MapPanel aria-label={`${record.destination} 지도 미리보기`}>
              <S.MapGrid aria-hidden />
              <S.MapPin aria-hidden>●</S.MapPin>
              <div><strong>{record.destination}</strong><span>여행 경로 지도</span></div>
            </S.MapPanel>
          </S.Layout>
        ) : (
          <S.StateCard>
            <h1>여행 기록을 찾을 수 없습니다.</h1>
            <p>목록에서 다른 기록을 선택해주세요.</p>
            <button type="button" onClick={() => navigate(paths.record)}>목록으로 돌아가기</button>
          </S.StateCard>
        )}
      </S.Content>
    </S.Page>
  )
}
