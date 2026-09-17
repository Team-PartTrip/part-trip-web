export const plannerCategories = ['맛집', '명소', '숙소', '카페', '액티비티', '쇼핑'] as const

export type PlannerCategory = (typeof plannerCategories)[number]

export type PlannerStep =
  | 'list'
  | 'group'
  | 'destination'
  | 'explore'
  | 'vote'
  | 'progress'
  | 'place'
