import { waitForMock } from './storage'

export type CompleteMissionResponse = {
  completedAt: string
  missionId: string
}

export async function completeMissionMock(
  missionId: string,
): Promise<CompleteMissionResponse> {
  await waitForMock(450)
  return {
    completedAt: new Date().toISOString(),
    missionId,
  }
}
