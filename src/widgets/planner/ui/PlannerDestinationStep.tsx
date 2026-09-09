import type { CountryInfoResponseDto } from '@/entities/travel'
import { Input as PartTripInput } from '@/shared/ui/parttrip'
import { formatDate, formatTripDuration } from '@/shared/utils'

import { type usePlannerFlow } from '../model/usePlannerFlow'
import * as S from './PlannerPage.styles'

type DestinationFlow = ReturnType<typeof usePlannerFlow>['destination']
type Destination = CountryInfoResponseDto

type Props = Pick<
  DestinationFlow,
  | 'handleDestinationSelect'
  | 'saveDestination'
  | 'selectedCityName'
  | 'selectedCountryInfoId'
  | 'selectedCountryName'
  | 'selectedEndDate'
  | 'selectedHeadcount'
  | 'selectedStartDate'
  | 'setCityName'
  | 'setEndDate'
  | 'setHeadcount'
  | 'setStartDate'
> & {
  calendarDays: Array<number | null>
  calendarMonth: Date
  destinationResults: Destination[]
  handleCalendarDay: (day: number) => void
  isDestinationSearch: boolean
  isSaving: boolean
  setCalendarMonthOverride: (month: Date) => void
  travelStyle: string
  setTravelStyle: (style: string) => void
}

export function PlannerDestinationStep({
  calendarDays,
  calendarMonth,
  destinationResults,
  handleCalendarDay,
  handleDestinationSelect,
  isDestinationSearch,
  isSaving,
  saveDestination,
  selectedCityName,
  selectedCountryInfoId,
  selectedCountryName,
  selectedEndDate,
  selectedHeadcount,
  selectedStartDate,
  setCalendarMonthOverride,
  setCityName,
  setEndDate,
  setHeadcount,
  setStartDate,
  setTravelStyle,
  travelStyle,
}: Props) {
  return (
    <>
      <S.SettingsLayout>
        <S.StepCard
          as="form"
          autoComplete="off"
          id="planner-destination-form"
          onSubmit={(event) => void saveDestination(event)}
        >
          <S.SectionTitle>여행 조건</S.SectionTitle>
          <S.StepField>
            <label htmlFor="planner-departure">출발 국가</label>
            <PartTripInput id="planner-departure" value="대한민국" readOnly />
          </S.StepField>
          <S.StepField>
            <label htmlFor="planner-city">여행지</label>
            <PartTripInput
              id="planner-city"
              autoComplete="off"
              aria-autocomplete="list"
              value={selectedCityName}
              onChange={(event) => setCityName(event.target.value)}
              placeholder="도시 또는 국가를 입력하세요"
            />
            <S.FieldHint>
              국가명 또는 도시명으로 검색할 수 있어요. 한글·영문 모두 지원합니다.
            </S.FieldHint>
          </S.StepField>
          <S.StepField>
            <span id="planner-destination-results-label">
              {isDestinationSearch ? '검색 결과' : '인기 여행지'}
            </span>
            <S.PopularGrid role="group" aria-labelledby="planner-destination-results-label">
              {destinationResults.map((country) => (
                <S.PopularButton
                  type="button"
                  key={country.countryInfoId ?? `${country.countryName}-${country.cityName}`}
                  $active={
                    String(country.countryInfoId) === selectedCountryInfoId ||
                    (country.countryName === selectedCountryName && country.cityName === selectedCityName)
                  }
                  onClick={() => handleDestinationSelect(country)}
                >
                  <strong>{country.cityName || country.countryName}</strong>
                  <span>{country.cityName ? country.countryName : '국가'}</span>
                </S.PopularButton>
              ))}
            </S.PopularGrid>
            {isDestinationSearch && selectedCityName && destinationResults.length === 0 ? (
              <S.SearchEmpty>
                검색 결과가 없습니다. 국가명 또는 도시명을 다시 입력해주세요.
              </S.SearchEmpty>
            ) : null}
          </S.StepField>
          <S.StepField>
            <span id="planner-date-range-label">여행 기간</span>
            <S.DateRange role="group" aria-labelledby="planner-date-range-label">
              <PartTripInput
                aria-label="출발일"
                type="date"
                value={selectedStartDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
              <span>–</span>
              <PartTripInput
                aria-label="도착일"
                type="date"
                value={selectedEndDate}
                onChange={(event) => setEndDate(event.target.value)}
              />
            </S.DateRange>
          </S.StepField>
          <S.StepField>
            <label htmlFor="planner-headcount">인원</label>
            <S.Stepper>
              <span>{selectedHeadcount}</span>
              <button
                type="button"
                aria-label="인원 줄이기"
                onClick={() => setHeadcount(String(Math.max(1, Number(selectedHeadcount) - 1)))}
              >
                −
              </button>
              <button
                type="button"
                aria-label="인원 늘리기"
                onClick={() => setHeadcount(String(Math.min(30, Number(selectedHeadcount) + 1)))}
              >
                +
              </button>
            </S.Stepper>
          </S.StepField>
          <S.StepField>
            <span id="planner-travel-style-label">여행 스타일</span>
            <S.ChipRow role="group" aria-labelledby="planner-travel-style-label">
              {['휴양', '맛집', '액티비티', '문화'].map((style) => (
                <S.StyleChip
                  key={style}
                  type="button"
                  $active={travelStyle === style}
                  onClick={() => setTravelStyle(style)}
                >
                  {style}
                </S.StyleChip>
              ))}
            </S.ChipRow>
          </S.StepField>
        </S.StepCard>
        <S.CalendarPanel>
          <S.SectionTitle>여행 기간</S.SectionTitle>
          <S.CalendarHeader>
            <strong>
              {calendarMonth.getFullYear()}년 {calendarMonth.getMonth() + 1}월
            </strong>
            <span>
              <button
                type="button"
                aria-label="이전 달"
                onClick={() => setCalendarMonthOverride(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="다음 달"
                onClick={() => setCalendarMonthOverride(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}
              >
                ›
              </button>
            </span>
          </S.CalendarHeader>
          <S.Weekdays>
            {['일', '월', '화', '수', '목', '금', '토'].map((day) => <span key={day}>{day}</span>)}
          </S.Weekdays>
          <S.CalendarGrid>
            {calendarDays.map((day, index) => {
              const date = day == null
                ? ''
                : `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              return day ? (
                <S.CalendarDay
                  key={day}
                  type="button"
                  $selected={date === selectedStartDate || date === selectedEndDate}
                  $range={Boolean(selectedStartDate && selectedEndDate && date > selectedStartDate && date < selectedEndDate)}
                  onClick={() => handleCalendarDay(day)}
                >
                  {day}
                </S.CalendarDay>
              ) : <span key={`empty-${index}`} />
            })}
          </S.CalendarGrid>
          <S.CalendarSummary>
            <strong>
              {selectedStartDate && selectedEndDate
                ? `${formatDate(selectedStartDate)} – ${formatDate(selectedEndDate)}`
                : '날짜를 선택하세요'}
            </strong>
            {selectedStartDate && selectedEndDate ? <span>{formatTripDuration(selectedStartDate, selectedEndDate)}</span> : null}
          </S.CalendarSummary>
        </S.CalendarPanel>
      </S.SettingsLayout>
      <S.FullWidthAction type="submit" form="planner-destination-form" disabled={isSaving}>
        {isSaving ? '저장 중' : '다음'}
      </S.FullWidthAction>
    </>
  )
}
