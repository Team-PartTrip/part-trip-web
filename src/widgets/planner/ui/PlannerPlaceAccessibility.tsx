import { useId, useState } from 'react'
import { useTourPlaceAccessibilityQuery } from '@/entities/travel'
import { Button } from '@/shared/ui/parttrip'
import * as S from './PlannerAiFlow.styles'

export function PlannerPlaceAccessibility({ tourPlaceId }: { tourPlaceId: number }) {
  const contentId = useId()
  const [open, setOpen] = useState(false)
  const query = useTourPlaceAccessibilityQuery(tourPlaceId, open)

  return <div>
    <Button type="button" $variant="secondary" style={{ minHeight: '3rem' }} aria-expanded={open} aria-controls={contentId} onClick={() => setOpen((value) => !value)}>
      {open ? '무장애 정보 접기' : '무장애 정보 보기'}
    </Button>
    <div id={contentId} hidden={!open}>{open ? query.isLoading ? <p role="status" aria-busy="true">무장애 정보를 불러오는 중이에요.</p>
      : query.isError ? <S.EditorFeedback $error role="alert">무장애 정보를 불러오지 못했어요.</S.EditorFeedback>
        : query.data?.items?.length ? <dl>
          {query.data.items.map((item, index) => <div key={`${item.key ?? item.label ?? 'item'}-${index}`}>
            {item.label || item.key ? <dt>{item.label || item.key}</dt> : null}
            {item.text ? <dd>{item.text}</dd> : null}
          </div>)}
        </dl> : <p>등록된 무장애 정보가 없어요.</p> : null}</div>
  </div>
}
