export const paths = {
  changePassword: '/change-password',
  community: '/community',
  communityDetail: '/community/:postId',
  communityWrite: '/community/write',
  login: '/login',
  main: '/main',
  planner: '/planner',
  plannerCreate: '/planner/new',
  plannerGroup: '/planner/group',
  plannerDestination: '/planner/destination',
  plannerExplore: '/planner/explore',
  plannerVote: '/planner/vote',
  plannerLineup: '/planner/lineup',
  plannerProgress: '/planner/progress',
  plannerFinal: '/planner/final',
  plannerPlace: '/planner/place/:placeId',
  profile: '/profile',
  profileEdit: '/profile/edit',
  profileMap: '/profile/map',
  profileCountries: '/profile/countries',
  profileAchievements: '/profile/achievements',
  notifications: '/notifications',
  notificationDetail: '/notifications/:notificationId',
  notificationSettings: '/settings/notifications',
  tripCards: '/trip-cards',
  tripCardDetail: '/trip-cards/:tripId',
  tripCardCreate: '/trip-cards/new',
  tripCardDelete: '/trip-cards/delete',
  mission: '/mission',
  record: '/record',
  recordMap: '/record/map',
  recordCalendar: '/record/calendar',
  recordCamera: '/record/camera',
  recordCameraDetail: '/record/camera/:imageId',
  recordCameraWrite: '/record/camera/:imageId/write',
  recordDetail: '/record/:recordId',
  recordWrite: '/record/write',
  signUp: '/sign-up',
  travelSelect: '/travel/select',
} as const

export const createCommunityDetailPath = (postId: string) =>
  `/community/${encodeURIComponent(postId)}`

export const createRecordDetailPath = (recordId: string) =>
  `/record/${encodeURIComponent(recordId)}`

export const createRecordCameraDetailPath = (imageId: number | string) =>
  `/record/camera/${encodeURIComponent(String(imageId))}`

export const createRecordCameraWritePath = (imageId: number | string) =>
  `/record/camera/${encodeURIComponent(String(imageId))}/write`
