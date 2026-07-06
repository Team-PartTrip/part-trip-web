export const paths = {
  changePassword: '/change-password',
  community: '/community',
  communityDetail: '/community/:postId',
  communityWrite: '/community/write',
  diagnosis: '/diagnosis',
  diagnosisResult: '/result',
  login: '/login',
  main: '/main',
  profile: '/profile',
  profileEdit: '/profile/edit',
  mission: '/mission',
  record: '/record',
  recordDetail: '/record/:recordId',
  recordWrite: '/record/write',
  signUp: '/sign-up',
  travelSelect: '/travel/select',
} as const

export const createCommunityDetailPath = (postId: string) =>
  `/community/${encodeURIComponent(postId)}`

export const createRecordDetailPath = (recordId: string) =>
  `/record/${encodeURIComponent(recordId)}`
