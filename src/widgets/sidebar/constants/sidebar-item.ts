import type { SidebarMenuType } from '../types/sidebar-item/sidebar-item'
import {
  figmaHomeIcon,
  figmaPlannerIcon,
  figmaProfileIcon,
  figmaRecordsIcon,
} from '@/shared/assets'
import { paths } from '@/shared/config'

export const MENUS: SidebarMenuType[] = [
  {
    text: '홈',
    href: paths.main,
    iconSrc: figmaHomeIcon,
  },
  {
    text: '플래너',
    href: paths.planner,
    iconSrc: figmaPlannerIcon,
  },
  {
    text: '기록',
    href: paths.record,
    iconSrc: figmaRecordsIcon,
  },
  {
    text: '마이',
    href: paths.profile,
    iconSrc: figmaProfileIcon,
  },
]
