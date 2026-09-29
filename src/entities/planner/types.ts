export type CreatePlannerRequestDto = {
  title: string
  memberCount: number
  isSolo: boolean
  regionCode?: string
  cityName?: string
  startDate?: string
  endDate?: string
  cities?: PlannerCityRequestDto[]
}

export type PlannerCityRequestDto = {
  regionCode: string
  cityName: string
  startDate: string
  endDate: string
}

export type PlannerCityResponseDto = {
  regionCode?: string
  regionName?: string
  cityName?: string
  startDate?: string
  endDate?: string
}

export type PlannerCreateResponseDto = {
  plannerId?: number
  title?: string
  status?: string
  memberCount?: number
  startDate?: string
  endDate?: string
  regionCode?: string
  regionName?: string
  cityName?: string
  inviteLink?: string
}

export type PlannerListResponseDto = {
  plannerId?: number
  title?: string
  regionCode?: string
  regionName?: string
  cityName?: string
  startDate?: string
  endDate?: string
  status?: string
  role?: string
  memberCount?: number
  joinedMemberCount?: number
}

export type PlannerDetailResponseDto = {
  plannerId?: number
  title?: string
  regionCode?: string
  regionName?: string
  cityName?: string
  startDate?: string
  endDate?: string
  status?: string
  role?: string
  memberCount?: number
  joinedMemberCount?: number
  inviteLink?: string
  cities?: PlannerCityResponseDto[]
}

export type PlannerMemberResponseDto = {
  invitationId?: number
  status?: string
  userId?: string
  nickName?: string
  role?: string
  joinedAt?: string
}

export type PlannerInvitationResponseDto = {
  createdAt?: string
  invitedByUserId?: string
  invitedUserId?: string
  invitationId?: number
  plannerId?: number
  plannerTitle?: string
  respondedAt?: string
  status?: string
}

export type JoinPlannerRequestDto = {
  inviteCode: string
}

export type PlannerJoinResponseDto = {
  plannerId?: number
  title?: string
  role?: string
  status?: string
  memberCount?: number
  joinedMemberCount?: number
}

export type ConfirmedPlaceResponseDto = {
  category?: string
  categoryLabel?: string
  tourPlaceId?: number
  placeName?: string
  imageUrl?: string
  address?: string
  rating?: number
  visitedDate?: string
}

export type PlannerConfirmResponseDto = {
  confirmedSchedule?: ConfirmedPlaceResponseDto[]
  plannerId?: number
  tripCardId?: number
}

export type SavePlannerTravelPlanRequestDto = {
  regionCode: string
  cityName: string
  startDate: string
  endDate: string
  memberCount?: number
  isSolo?: boolean
  cities?: PlannerCityRequestDto[]
}

export type PlannerTravelPlanResponseDto = {
  plannerId?: number
  planId?: number
  title?: string
  memberCount?: number
  isSolo?: boolean
  regionCode?: string
  regionName?: string
  cityName?: string
  startDate?: string
  endDate?: string
}

export type InvitePlannerMembersRequestDto = {
  userIds: string[]
}

export type PlannerInviteResponseDto = {
  inviteLink?: string
  invitedCount?: number
  invitations?: PlannerInvitationResponseDto[]
}

export type PlannerFinalResponseDto = {
  plannerId?: number
  title?: string
  regionCode?: string
  regionName?: string
  cityName?: string
  startDate?: string
  endDate?: string
  status?: string
  places?: ConfirmedPlaceResponseDto[]
}

export type PlannerSchedulePlaceDto = {
  tourPlaceId?: number
  name?: string
  category?: string
  categoryLabel?: string
  imageUrl?: string
  address?: string
  rating?: number
  latitude?: number
  longitude?: number
}

export type PlannerScheduleRouteStatus =
  | 'READY'
  | 'CALCULATING'
  | 'DAILY_QUOTA_REACHED'
  | 'API_ERROR'
  | 'NO_ROUTE'
  | 'MISSING_COORDINATES'
  | 'WAITING_FOR_API_KEY'

export type PlannerScheduleTransportMode = 'PUBLIC_TRANSIT' | 'CAR' | 'TAXI' | 'WALKING'

export type PlannerScheduleRouteStepDto = {
  type?: string | null
  name?: string | null
  boardingStop?: string | null
  alightingStop?: string | null
  stopCount?: number | null
  durationMinutes?: number | null
}

export type PlannerScheduleRouteDto = {
  transportMode?: PlannerScheduleTransportMode | null
  fromName?: string | null
  toName?: string | null
  durationMinutes?: number | null
  walkingMinutes?: number | null
  steps?: PlannerScheduleRouteStepDto[] | null
}

export type PlannerScheduleSlotDto = {
  slotId?: number
  order?: number
  tourPlaceId?: number
  place?: PlannerSchedulePlaceDto | null
  routeStatus?: PlannerScheduleRouteStatus | null
  routeFromPrevious?: PlannerScheduleRouteDto | null
}

export type PlannerScheduleDayDto = {
  date?: string
  slots?: PlannerScheduleSlotDto[]
}

export type PlannerScheduleResponseDto = {
  plannerId?: number
  title?: string
  cityName?: string
  startDate?: string
  endDate?: string
  days?: PlannerScheduleDayDto[]
}

export type SavePlannerScheduleRequestDto = {
  days: Array<{
    date: string
    slots: Array<{ slotId?: number; tourPlaceId?: number }>
  }>
}

export type PlannerScheduleCandidateDto = PlannerSchedulePlaceDto & {
  tourPlaceId: number
  name: string
}

export type PlannerBlockResponseDto = {
  type?: string
  label?: string
  multiple?: boolean
  options?: string[]
}

export type PlannerBlockDto = {
  type: string
  value: string
}

export type GeneratePlannerRequestDto = {
  title: string
  memberCount: number
  isSolo: boolean
  regionCode: string
  cityName: string
  startDate: string
  endDate: string
  blocks: PlannerBlockDto[]
  departurePoint?: { placeName: string; latitude: number; longitude: number }
}
