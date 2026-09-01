import {
  clearAuthTokens,
  logout as logoutRequest,
} from '@/entities/session/api'

export const logout = async () => {
  try {
    await logoutRequest()
  } finally {
    clearAuthTokens()
  }
}
