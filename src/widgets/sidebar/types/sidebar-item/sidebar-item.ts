import type { FC, SVGProps } from 'react'

export interface SidebarMenuType {
  text: string
  herf: string
  icon?: FC<SVGProps<SVGSVGElement>>
}
