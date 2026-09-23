export type CreatePlannerRequestDto = {
  title: string
  memberCount: number
  isSolo: boolean
}

export type PlannerCreateResponseDto = {
  plannerId?: number
  title?: string
  status?: string
  memberCount?: number
  startDate?: string
  endDate?: string
  countryName?: string
  cityName?: string
  inviteLink?: string
}

export type PlannerListResponseDto = {
  plannerId?: number
  title?: string
  countryName?: string
  cityName?: string
  startDate?: string
  endDate?: string
  status?: string
  memberCount?: number
  joinedMemberCount?: number
}

export type PlannerDetailResponseDto = {
  plannerId?: number
  title?: string
  countryName?: string
  cityName?: string
  startDate?: string
  endDate?: string
  status?: string
  role?: string
  memberCount?: number
  joinedMemberCount?: number
  inviteLink?: string
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
  voteId?: number
  category?: string
  categoryLabel?: string
  optionId?: number
  tourPlaceId?: number
  placeName?: string
  imageUrl?: string
  address?: string
  rating?: number
  voteCount?: number
}

export type PlannerConfirmResponseDto = {
  confirmedSchedule?: ConfirmedPlaceResponseDto[]
  plannerId?: number
}

export type PlannerScheduleResponseDto = {
  plannerId?: number
  title?: string
  cityName?: string
  startDate?: string
  endDate?: string
  days?: Array<{
    date?: string
    slots?: Array<{
      slotId?: number
      order?: number
      place?: {
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
    }>
  }>
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
  cityName: string
  startDate: string
  endDate: string
  blocks: PlannerBlockDto[]
}
