import { logout as logoutRequest } from '@shared/api'

export const logout = async () => {
  return logoutRequest()
}
