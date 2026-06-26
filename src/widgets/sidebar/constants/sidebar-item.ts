import type { SidebarMenuType } from '../types/sidebar-item/sidebar-item'
import {
  CommunityIcon,
  HomeIcon,
  MissionIcon,
  ProfileIcon,
  RecordIcon,
} from '@shared/assets'

export const MENUS: SidebarMenuType[] = [
  {
    text: '홈',
    herf: '/',
    icon: HomeIcon,
  },
  {
    text: '커뮤니티',
    herf: '/community',
    icon: CommunityIcon,
  },
  {
    text: '기록',
    herf: '/record',
    icon: RecordIcon,
  },
  {
    text: '미션',
    herf: '/mission',
    icon: MissionIcon,
  },
  {
    text: '프로필',
    herf: '/profile',
    icon: ProfileIcon,
  },
]
