export type CommunityPostKind = 'board' | 'review' | 'trip'

const communityPostIdPattern = /^(board|review|trip)-([1-9]\d*)$/

export function parseCommunityPostId(
  value: string,
): { id: number; type: CommunityPostKind } | null {
  const match = communityPostIdPattern.exec(value)
  if (!match) return null

  const type = match[1]
  const id = Number(match[2])
  if (
    (type !== 'board' && type !== 'review' && type !== 'trip')
    || !Number.isSafeInteger(id)
  ) {
    return null
  }

  return { id, type }
}
