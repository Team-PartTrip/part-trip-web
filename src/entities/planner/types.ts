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
  role?: string
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

export type InvitePlannerMembersRequestDto = {
  userIds: string[]
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

export type PlannerInviteResponseDto = {
  inviteLink?: string
  invitedCount?: number
  invitations?: PlannerInvitationResponseDto[]
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

export type CreateVoteRequestDto = {
  category: string
  placeId?: number
  deadline?: string
}

export type VoteCreateResponseDto = {
  voteId?: number
  plannerId?: number
  planId?: number
  category?: string
  categoryLabel?: string
  status?: string
  deadline?: string
  createdAt?: string
  count?: number
}

export type SavePlannerTravelPlanRequestDto = {
  memberCount?: number
  isSolo?: boolean
  countryName: string
  cityName: string
  startDate: string
  endDate: string
}

export type PlannerTravelPlanResponseDto = {
  plannerId?: number
  planId?: number
  title?: string
  memberCount?: number
  isSolo?: boolean
  countryName?: string
  cityName?: string
  startDate?: string
  endDate?: string
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

export type PlannerFinalResponseDto = {
  plannerId?: number
  title?: string
  countryName?: string
  cityName?: string
  startDate?: string
  endDate?: string
  status?: string
  places?: ConfirmedPlaceResponseDto[]
}

export type VoteOptionStatusResponseDto = {
  optionId?: number
  tourPlaceId?: number
  placeName?: string
  imageUrl?: string
  address?: string
  rating?: number
  addedByUserId?: string
  voteCount?: number
  selectedByMe: boolean
  confirmed?: boolean
}

export type VoteStatusResponseDto = {
  voteId?: number
  plannerId?: number
  category?: string
  categoryLabel?: string
  status?: string
  deadline?: string
  deadlinePassed?: boolean
  eligibleMemberCount?: number
  votedMemberCount?: number
  confirmedOptionId?: number
  options: VoteOptionStatusResponseDto[]
}

export type VoteBallotRequestDto = {
  optionId: number
}

export type VoteBallotResponseDto = {
  voteRecordId?: number
  voteId?: number
  optionId?: number
  placeName?: string
  changed?: boolean
  votedAt?: string
}

export type VoteConfirmRequestDto = {
  optionId?: number
}

export type VoteConfirmResponseDto = {
  voteId?: number
  voteStatus?: string
  confirmedOptionId?: number
  tourPlaceId?: number
  placeName?: string
  voteCount?: number
  plannerStatus?: string
}

export type VoteCloseResponseDto = {
  voteId?: number
  status?: string
  totalVoteCount?: number
  highestVoteCount?: number
  topOptionIds?: number[]
  tied?: boolean
}

export type VoteReminderResponseDto = {
  message?: string
  notifiedCount?: number
}

export type PlannerCartRequestDto = {
  placeIds: number[]
}

export type VoteOptionCreateRequestDto = {
  tourPlaceId?: number
  placeName?: string
}

export type VoteOptionCreateResponseDto = {
  optionId?: number
  voteId?: number
  tourPlaceId?: number
  placeName?: string
  addedByUserId?: string
  createdAt?: string
}

export type RandomPlaceResponseDto = {
  placeId?: number
  placeName?: string
}

export type PlannerConfirmResponseDto = {
  confirmedSchedule?: ConfirmedPlaceResponseDto[]
  plannerId?: number
}

export type PlannerConfirmRequestDto = {
  selections?: Array<{
    voteId: number
    optionId: number
  }>
}
