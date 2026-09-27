import { createFileRoute, redirect } from '@tanstack/react-router'
import { paths } from '@/shared/config'
import { validateAuthSearch } from '@/shared/utils'

export const Route = createFileRoute('/(public)/sign-up/')({
  validateSearch: validateAuthSearch,
  beforeLoad: ({ search }) => {
    throw redirect({
      to: paths.login,
      search: search.redirect ? { redirect: search.redirect } : undefined,
      replace: true,
    })
  },
})
