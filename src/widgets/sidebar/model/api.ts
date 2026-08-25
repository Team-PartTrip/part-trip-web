import {
  clearAuthTokens,
  getRefreshToken,
  logout as logoutRequest,
} from '@/entities/session/api'

export const logout = async () => {
  const refreshToken = getRefreshToken()

  try {
    if (refreshToken) await logoutRequest({ refreshToken })
  } finally {
    clearAuthTokens()
  }
}
