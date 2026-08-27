export const missionWeekDays = ['일', '월', '화', '수', '목', '금', '토']
export const missionCalendarDays = [
  ...Array.from({ length: 5 }, () => null),
  ...Array.from({ length: 31 }, (_, index) => index + 1),
  ...Array.from({ length: 6 }, () => null),
]
export const missionCalendarTitle = '2026년 5월'
