export const MISSING_TRAVEL_PLAN_MESSAGE = '등록된 여행 일정이 없습니다.'

export function isMissingTravelPlanResponse(status: number | undefined, data: unknown) {
  return status === 400
    && typeof data === 'string'
    && data.trim() === MISSING_TRAVEL_PLAN_MESSAGE
}
