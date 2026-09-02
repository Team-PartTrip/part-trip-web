import {
  clearAuthTokens,
  getRefreshToken,
  logout as logoutRequest,
} from '@/entities/session/api'

export const logout = async () => {
  try {
    const refreshToken = getRefreshToken()
    if (refreshToken) await logoutRequest({ refreshToken })
  } finally {
    clearAuthTokens()
  }
}
