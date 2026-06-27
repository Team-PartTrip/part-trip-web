import * as S from './Festival.styles'

const calendarDays = [
  '28', '29', '30', '30', '30', '1', '2',
  '3', '4', '5', '6', '7', '8', '9',
  '10', '11', '12', '13', '14', '15', '16',
]

const Festival = () => {
  return (
    <S.Card>
      <S.Header>
        <span aria-hidden="true">▣</span>
        <h2>축제 캘린더</h2>
      </S.Header>
      <S.Calendar>
        <S.CalendarTop>
          <strong>2026년 6월</strong>
          <div><button type="button" aria-label="이전 달">‹</button><button type="button" aria-label="다음 달">›</button></div>
        </S.CalendarTop>
        <S.Grid>
          {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
            <S.Weekday key={day}>{day}</S.Weekday>
          ))}
          {calendarDays.map((day, index) => (
            <S.Day key={`${day}-${index}`} $muted={index < 5} $event={day === '5'} $selected={day === '8'}>
              {day}
            </S.Day>
          ))}
        </S.Grid>
      </S.Calendar>
    </S.Card>
  )
}

export default Festival
