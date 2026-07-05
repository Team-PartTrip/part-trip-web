import type { FC, SVGProps } from 'react'

export interface SidebarMenuType {
  href: string
  text: string
  icon?: FC<SVGProps<SVGSVGElement>>
}
