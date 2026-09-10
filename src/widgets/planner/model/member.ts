type PlannerMemberIdentity = {
  nickName?: string
  userId?: string
}

export function getPlannerMemberDisplayName(member: PlannerMemberIdentity) {
  return member.nickName || member.userId || '멤버'
}
