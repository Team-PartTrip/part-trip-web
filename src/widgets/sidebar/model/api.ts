import {
  clearAuthTokens,
  getRefreshToken,
  logout as logoutRequest,
} from '@shared/api'

export const logout = async () => {
  const refreshToken = getRefreshToken()

  try {
    if (refreshToken) await logoutRequest({ refreshToken })
  } finally {
    clearAuthTokens()
  }
}
