const redirectOrigin = 'https://parttrip.invalid'

type AuthSearch = {
  redirect?: string
}

export function validateAuthSearch(search: Record<string, unknown>): AuthSearch {
  return typeof search.redirect === 'string'
    ? { redirect: search.redirect }
    : {}
}

export function getSafeRedirect(value: unknown) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) {
    return undefined
  }

  try {
    const url = new URL(value, redirectOrigin)
    return url.origin === redirectOrigin
      ? `${url.pathname}${url.search}${url.hash}`
      : undefined
  } catch {
    return undefined
  }
}
