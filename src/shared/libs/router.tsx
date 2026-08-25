import { forwardRef, type AnchorHTMLAttributes } from 'react'
import {
  Link as TanStackLink,
  useLocation as useTanStackLocation,
  useNavigate as useTanStackNavigate,
  useParams as useTanStackParams,
} from '@tanstack/react-router'

type NavigateOptions = {
  replace?: boolean
}

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string
  replace?: boolean
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function RouterLink(
  { to, replace, ...props },
  ref,
) {
  return <TanStackLink ref={ref} to={to as never} replace={replace} {...props} />
})

export function useNavigate() {
  const navigate = useTanStackNavigate()

  return (to: string, options?: NavigateOptions) =>
    navigate({ to: to as never, replace: options?.replace })
}

export function useLocation() {
  const location = useTanStackLocation()

  return {
    pathname: location.pathname,
    search: location.searchStr,
  }
}

export function useParams() {
  return useTanStackParams({ strict: false }) as Record<string, string | undefined>
}
