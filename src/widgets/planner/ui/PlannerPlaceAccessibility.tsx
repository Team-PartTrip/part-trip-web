import { useState } from 'react'
import { useTourPlaceAccessibilityQuery } from '@/entities/travel'
import { accessibilityMessage } from '../model/accessibility'

export function PlannerPlaceAccessibility({ tourPlaceId, collapsible = false }: { tourPlaceId: number; collapsible?: boolean }) {
  const [open, setOpen] = useState(false)
  const query = useTourPlaceAccessibilityQuery(tourPlaceId, !collapsible || open)
  const message = accessibilityMessage(query.data, query.isError)
  const content = query.isLoading ? <p role="status" aria-busy="true">편의 시설 정보를 불러오는 중이에요.</p>
    : message ? <p role="status">{message}</p>
      : query.data?.items?.length ? <dl>
        {query.data.items.map((item, index) => <div key={`${item.key ?? item.label ?? 'item'}-${index}`}>
          {item.label || item.key ? <dt>{item.label || item.key}</dt> : null}
          {item.text ? <dd>{item.text}</dd> : null}
        </div>)}
      </dl> : <p>등록된 편의 시설 정보가 없어요.</p>

  return collapsible ? <details onToggle={(event) => setOpen(event.currentTarget.open)}>
    <summary>편의 시설 보기</summary>{open ? content : null}
  </details> : <section aria-label="편의 시설"><strong>편의 시설</strong>{content}</section>
}
