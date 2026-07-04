import type { SidebarMenuType } from '../types/sidebar-item/sidebar-item'
import {
  CommunityIcon,
  HomeIcon,
  MissionIcon,
  ProfileIcon,
  RecordIcon,
} from '@shared/assets'
import { paths } from '@shared/config'

export const MENUS: SidebarMenuType[] = [
  {
    text: '홈',
    href: paths.main,
    icon: HomeIcon,
  },
  {
    text: '커뮤니티',
    href: paths.community,
    icon: CommunityIcon,
  },
  {
    text: '기록',
    href: paths.record,
    icon: RecordIcon,
  },
  {
    text: '미션',
    href: paths.mission,
    icon: MissionIcon,
  },
  {
    text: '프로필',
    href: paths.profile,
    icon: ProfileIcon,
  },
]
