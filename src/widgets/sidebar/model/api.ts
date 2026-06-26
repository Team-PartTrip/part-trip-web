import { apiClient } from "@shared/api/client"

export const logout = async () => {
  return await apiClient.post(`/auth/logout`);
}