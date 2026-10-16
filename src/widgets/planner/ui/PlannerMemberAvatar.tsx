import { useState } from 'react'
import { resolveApiAssetUrl } from '@/shared/libs/api-client'
import * as S from './PlannerPage.styles'

type Props = { name: string; imgUrl?: string | null }

export function PlannerMemberAvatar({ name, imgUrl }: Props) {
  const imageUrl = resolveApiAssetUrl(imgUrl)
  const [failedUrl, setFailedUrl] = useState<string>()
  return (
    <S.Avatar>
      {imageUrl && imageUrl !== failedUrl ? (
        <img src={imageUrl} alt={`${name} 프로필 사진`} onError={() => setFailedUrl(imageUrl)} />
      ) : name.slice(0, 1).toUpperCase()}
    </S.Avatar>
  )
}
