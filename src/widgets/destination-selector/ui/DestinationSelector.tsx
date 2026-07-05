import { useEffect, useState } from 'react'
import { DestinationBackIcon, DestinationSearchIcon } from '@shared/assets'
import {
  destinations,
  getDestinationsMock,
  selectDestinationMock,
  type Destination,
} from '@shared/api'
import {
  destinationBangkokUrl,
  destinationDaNangUrl,
  destinationSingaporeUrl,
  destinationTokyoUrl,
} from '@shared/assets/images'

import * as S from './DestinationSelector.styles'

interface Props {
  onBack: () => void
}

const destinationImages: Record<string, string> = {
  bangkok: destinationBangkokUrl,
  'da-nang': destinationDaNangUrl,
  singapore: destinationSingaporeUrl,
  tokyo: destinationTokyoUrl,
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 12 12" width="12" height="12" fill="none" aria-hidden="true">
      <path
        d="m3 3 6 6m0-6L3 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

const DestinationSelector = ({ onBack }: Props) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<readonly Destination[]>(destinations)
  const [recentDestinations, setRecentDestinations] = useState<readonly Destination[]>([destinations[0]])
  const [isLoading, setIsLoading] = useState(true)
  const [selectingId, setSelectingId] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    void getDestinationsMock(query).then((nextResults) => {
      if (isMounted) {
        setResults(nextResults)
        setIsLoading(false)
      }
    })
    return () => { isMounted = false }
  }, [query])

  const handleSelect = async (destination: Destination) => {
    setSelectingId(destination.id)
    await selectDestinationMock(destination)
    onBack()
  }

  return (
    <S.Root>
      <S.TopBar>
        <S.BackButton type="button" aria-label="메인으로 돌아가기" onClick={onBack}>
          <DestinationBackIcon aria-hidden="true" />
          <span>여행지 선택</span>
        </S.BackButton>

        <S.SearchLabel>
          <DestinationSearchIcon aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => {
              setIsLoading(true)
              setQuery(event.target.value)
            }}
            placeholder="어디로 여행을 떠나시나요?"
            aria-label="여행지 검색"
          />
        </S.SearchLabel>
      </S.TopBar>

      <S.Body>
        <S.RecentSection>
          <S.SectionHeader>
            <h2>최근 검색</h2>
            <button type="button" onClick={() => setRecentDestinations([])} disabled={recentDestinations.length === 0}>모두 지우기</button>
          </S.SectionHeader>
          {recentDestinations.length === 0 ? <S.EmptyRecent>최근 검색한 여행지가 없습니다.</S.EmptyRecent> : recentDestinations.map((destination) => (
            <S.RecentChip key={destination.id}>
              <span aria-hidden="true"><img src={destinationImages[destination.id]} alt="" /></span>
              <span><strong>{destination.name}</strong><small>{destination.currency}</small></span>
              <button type="button" aria-label={`${destination.name} 최근 검색 삭제`} onClick={() => setRecentDestinations((current) => current.filter((item) => item.id !== destination.id))}><CloseIcon /></button>
            </S.RecentChip>
          ))}
        </S.RecentSection>

        <S.PopularSection>
          <h2>인기 여행지</h2>
          {isLoading ? <S.ResultState aria-live="polite">여행지를 찾는 중입니다.</S.ResultState> : null}
          {!isLoading && results.length === 0 ? <S.ResultState>검색 결과가 없습니다.</S.ResultState> : null}
          <S.DestinationGrid>
            {!isLoading && results.map((destination) => (
              <S.DestinationCard
                key={destination.id}
                type="button"
                data-destination-card
                $imageUrl={destinationImages[destination.id]}
                onClick={() => void handleSelect(destination)}
                disabled={selectingId !== null}
              >
                <span>
                  <strong>{selectingId === destination.id ? '선택 중...' : destination.name}</strong>
                  <small>{destination.country}</small>
                </span>
              </S.DestinationCard>
            ))}
          </S.DestinationGrid>
        </S.PopularSection>
      </S.Body>
    </S.Root>
  )
}

export default DestinationSelector
